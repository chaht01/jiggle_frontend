import React from 'react'
import ReactDOM from 'react-dom'

import SectionScrollContainer from './SectionScrollContainer'
import SectionScrollSection from './SectionScrollSection'
import SectionScrollRouteSection from './SectionScrollRouteSection'
import SectionScrollSpy from './SectionScrollSpy'
import FullPage from '../Layout/FullPage'

import styled from 'styled-components'

const SectionScrollComponent = styled(FullPage)`
    position:relative;
`

export default class SectionScroll extends React.Component{
    constructor(props){
        super(props);
        /**
         *
         * @type {{self: null, screenHeight: Number, direction: string, isWheelEvent: boolean, animatingId: Array, nextSection: number, activeSection: number, prevDelta: number, wheelTId: number}}
         */
        this.state = {
            self: null,                         // scrollable container DOM Node
            screenHeight: window.innerHeight,   // scrollable container DOM Node's clientHeight
            direction: 'idle',                  // scroll status: 'idle', 'up' and 'down'
            isWheelEvent: false,                // wheel event flag
            animatingId: [],                    // request animation frame id sequences
            nextSection: 0,                     // scroll Destination Section Index
            activeSection: 0,                   // current(but not synchronized with real scroll position) Source Section Index
            prevDelta: 0,                       // deltaY value of wheel event(for detecting direction of wheel event)
            wheelTId: -1                        // wheel Timeout Id for self blocking wheel event until reaching to next Section
        }

        this.sanitizedChildren = null           // sanitized React component functions
        this.exceptionChildren = null           // sanitized but not regular SectionScroll's component set
        this.spy = null                         // SectionScrollSpy component
        this.spyHeight = '50px'                 // default scroll spy height
        this.anchorIdx = 0                      // current activated anchorIdx(synchronized with real scroll position)
        this.activeAnchorLength = 0             // the number of active anchors (it can be used to style any component related to currently clickable object)

        this.scroll = this.scroll.bind(this)
        this.handleSection = this.handleSection.bind(this)
        this.disableScroll = this.disableScroll.bind(this)
        this.handleWheelEvents = this.handleWheelEvents.bind(this)
        this.activateSection = this.activateSection.bind(this)
        this.checkValidSectionIdx = this.checkValidSectionIdx.bind(this)
        this.checkAnchorIndex = this.checkAnchorIndex.bind(this)
        this.getPropsToSend = this.getPropsToSend.bind(this)
        this.finished = this.finished.bind(this)
        this.triggerScrollAnimate = this.triggerScrollAnimate.bind(this)
    }

    /**
     * Cancel wheel event
     * @param e
     * @returns {boolean}
     */
    disableScroll(e){
        e.preventDefault()
        return false
    }

    /**
     * Set state as current viewport statuses(screen, container, section, delta, and etc)
     * @param cb
     */
    updateScreenProperties(cb){
        this.setState((prevState, props) => {
            const container = ReactDOM.findDOMNode(this.container)
            return {
                screenHeight: container.clientHeight,
                self: container,
                activeSection: Math.round(container.scrollTop/prevState.screenHeight),
                delta: 0
            }
        }, () => {
            if(cb && typeof cb === "function"){
                cb()
            }
        })
    }

    /**
     * Check if given idx(index)th section exists
     * @param idx {Number}
     * @returns {boolean}
     */
    checkValidSectionIdx(idx){
        return !(this.state.self.children[idx] == undefined)
    }

    /**
     * Pre-process wheel event(event handler registration & detaching, block self event by using timeout, and etc)
     * to trigger section scroll method(handleSection).
     * @param e
     */
    handleWheelEvents(e){
        this.setState((prevState)=>{
            // Update current activeSection sync with current scroll bar position
            const container = ReactDOM.findDOMNode(this.container)
            return {
                activeSection: Math.round(prevState.self.scrollTop/container.clientHeight)
            }
        }, () => {
            ReactDOM.findDOMNode(this.container).removeEventListener('wheel', this.disableScroll) // remove block function of wheel event

            const currDelta = e.deltaY
            const direction = (currDelta < 0 ? 'up':'down')

            let nextSection = direction === 'down' ? this.state.activeSection+1 :
                (direction==='idle' ? this.state.activeSection : this.state.activeSection-1)
            if(!this.checkValidSectionIdx(nextSection)){
                nextSection = this.state.activeSection
            }

            this.setState((prevState) => {
                if(prevState.wheelTId!=-1) { // if there exist blocking wheel event by previous call, cancel it
                    clearTimeout(prevState.wheelTId)
                }
                return{
                    direction,
                    isWheelEvent: true,
                    nextSection: nextSection,
                    prevDelta: currDelta,
                    wheelTId: setTimeout(() => {
                        this.setState(()=>{
                            return {
                                direction: 'idle', // 상태 idle로 바꿈
                                wheelTId: -1,
                                isWheelEvent: false
                            }
                        }, () => {
                            ReactDOM.findDOMNode(this.container).addEventListener('wheel', this.handleWheelEvents) // Re-registration wheel handle function to wheel event
                        })
                    }, 500)
                }
            }, ()=>{
                ReactDOM.findDOMNode(this.container).addEventListener('wheel', this.disableScroll, {passive: false}) // registration wheel block function to wheel event
                ReactDOM.findDOMNode(this.container).removeEventListener('wheel', this.handleWheelEvents) // detach wheel handle function of wheel event
                if(this.state.animatingId.length == 0) { // execute section scroll event only when all previous scroll animation ends
                    this.handleSection()
                }
            })
        })


    }

    /**
     * Handle section scroll event along to activeSection and nextSection of current State.
     */
    handleSection(){
        if(this.state.nextSection!=this.state.activeSection){
            this.triggerScrollAnimate(ReactDOM.findDOMNode(this.container).children[this.state.nextSection])
        }
    }

    /**
     * Set nextSection of state and execute callback function
     * @param index {Number}
     * @param cb {function}
     */
    activateSection(index){
        if(this.checkValidSectionIdx(index)){
            this.finished(() => this.setState(()=>{
                return {
                    nextSection: index
                }
            }, () => {
                this.handleSection()
            }))

        }
    }


    /**
     * scroll animation
     * @param container {Object}
     * @param destination {Object}
     * @param startTime {Number}
     * @param duration {Number}
     * @param easing {string}
     * @param callback {function}
     * @returns {*}
     */
    scroll(container, destination, startTime, duration, easing, callback){
        const easings = {
            linear(t) {
                return t;
            },
            easeInQuad(t) {
                return t * t;
            },
            easeOutQuad(t) {
                return t * (2 - t);
            },
            easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            },
            easeInCubic(t) {
                return t * t * t;
            },
            easeOutCubic(t) {
                return (--t) * t * t + 1;
            },
            easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            },
            easeInQuart(t) {
                return t * t * t * t;
            },
            easeOutQuart(t) {
                return 1 - (--t) * t * t * t;
            },
            easeInOutQuart(t) {
                return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
            },
            easeInQuint(t) {
                return t * t * t * t * t;
            },
            easeOutQuint(t) {
                return 1 + (--t) * t * t * t * t;
            },
            easeInOutQuint(t) {
                return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
            }
        }
        const start = container.scrollTop
        const now = 'now' in window.performance ? performance.now() : new Date().getTime()
        const time = Math.min(1, ((now - startTime) / duration))
        const timeFunction = easings[easing||'easeInOutCubic'](time)

        const documentHeight = Math.max(container.scrollHeight, container.offsetHeight, container.clientHeight, container.scrollHeight, container.offsetHeight)
        const windowHeight = container.clientHeight
        const destinationOffset = destination.offsetTop
        const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset)

        if ('requestAnimationFrame' in window === false) {
            container.scrollTo(0, destinationOffsetToScroll);
            if (callback) {
                callback();
            }
            return;
        }

        container.scrollTo(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start))
        if (container.scrollTop-destinationOffsetToScroll === 0 || time==1) {
            if (callback) {
                callback()
            }
            return
        }

        this.setState((prevState, props)=>{
            const aniID = requestAnimationFrame(this.scroll.bind(this, container, destination, startTime, duration, easing, callback))
            return {
                animatingId: [aniID].concat(prevState.animatingId)
            }
        })
    }

    /**
     * clear up scroll animate action with setState
     */
    finished(cb){
        const container = this.state.self || ReactDOM.findDOMNode(this.container)
        this.state.animatingId.forEach(id => cancelAnimationFrame(id))
        this.setState((prevState, props) => {
            return {
                animatingId: [],
                direction: 'idle',
                isWheelEvents: false,
                activeSection: Math.round(container.scrollTop/prevState.screenHeight),
            }
        }, () => {
            if(typeof cb === 'function')
                cb()
        })
    }

    /**
     * trigger scroll animation
     * @param destination {Object}
     * @param duration {Number}
     * @param easing {string}
     */
    triggerScrollAnimate(destination, duration=1000, easing='easeInOutCubic') {
        const container = this.state.self || ReactDOM.findDOMNode(this.container)
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime()
        this.scroll(container, destination, startTime, duration, easing, this.finished)
    }

    /**
     * anchor index synchronized with current scroll position
     */
    checkAnchorIndex() {
        this.anchorIdx = Math.round(this.state.self.scrollTop/this.state.screenHeight)
    }

    /**
     * sanitize children(assume given as this.props.children) components
     * @param children
     */
    sanitizeChildren(children){
        /**
         * Check children is SectionScrollSection Component
         */
        this.sanitizedChildren = children.filter((child)=>(child!==null && child!==undefined))
        const childrenIsArray = Array.isArray(this.sanitizedChildren)
        const allowedComponents = [SectionScrollSection, SectionScrollRouteSection, SectionScrollSpy]
        const allowedSections = [SectionScrollSection, SectionScrollRouteSection]
        const allowedTimeline = [SectionScrollSpy]
        if((childrenIsArray ?
                this.sanitizedChildren.filter((child)=> {
                    return allowedComponents.indexOf(child.type)<0 && (child && child.props && !child.props.hasOwnProperty('sectionScrollException'))
                }).length>0
                : allowedComponents.indexOf(children.type)<0)){
            console.error('Render error: cannot render component but "SectionScrollSection"')
        }
        if(childrenIsArray){
            this.sanitizedChildren = children.filter((child)=>allowedSections.indexOf(child.type)>-1)
            this.exceptionChildren = children.filter((child)=> child && child.props && child.props.hasOwnProperty('sectionScrollException'))
            this.spy = children.filter((child)=>allowedTimeline.indexOf(child.type)>-1)[0]
            this.sanitizedChildren = this.sanitizedChildren.length === 0 ? null : this.sanitizedChildren
            this.activeAnchorLength = this.sanitizedChildren.length
        }else{
            this.sanitizedChildren = allowedSections.indexOf(children)>-1 ? children : null
            this.spy = allowedTimeline.indexOf(children)>-1 ? children : null
            this.exceptionChildren = children.props.hasOwnProperty('sectionScrollException') ? children : null
            this.activeAnchorLength = 0
        }
    }

    /**
     * process and return props to give to children components
     * @returns {{active: (number|Number|*), activeAnchorLength: (*|number), activateSection: (function(*=): *), direction: string}}
     */
    getPropsToSend(){
        return {
            active: this.anchorIdx,
            activeAnchorLength: this.activeAnchorLength,
            activateSection: this.activateSection,
            // activateSection: this.testFunction,
            direction: (this.state.activeSection === this.state.nextSection ? 'idle' :
                (this.state.activeSection < this.state.nextSection) ? 'down' : 'up'),
            spyHeight: this.spy ? (this.spy.props.spyHeight || this.spyHeight) : this.spyHeight
        }
    }

    componentWillMount(){
        this.sanitizeChildren(this.props.children)
    }

    componentDidMount(){
        this.setState((prevState, props) => {
            const container = ReactDOM.findDOMNode(this.container)
            return {
                screenHeight: container.clientHeight
            }
        }, () => {
            this.updateScreenProperties(()=>{
                window.addEventListener('resize', this.updateScreenProperties.bind(this), false)
                this.state.self.addEventListener('scroll', this.checkAnchorIndex)
                this.state.self.addEventListener('wheel', this.handleWheelEvents, {passive:false})
                const active = this.props.active || 0
                this.activateSection(active)
            })
        })

    }

    componentWillReceiveProps(nextProps){
        this.sanitizeChildren(nextProps.children)
        const active = nextProps.active
        if(active){
            setTimeout(()=>this.activateSection(active), 250) //TODO: async
        }
    }

    render(){
        return (
            <SectionScrollComponent>
                {React.cloneElement(this.spy, Object.assign({}, this.getPropsToSend(), this.spy.props))}
                <SectionScrollContainer ref={(container)=> this.container = container} timeline={this.spy!==null}>
                    {Array.isArray(this.sanitizedChildren) ?
                        this.sanitizedChildren.map((child, i)=>{
                            return (
                                React.cloneElement(child, Object.assign({}, this.getPropsToSend(), {key:i}, child.props))
                            )
                        })
                        : React.cloneElement(this.sanitizedChildren, Object.assign(this.getPropsToSend(), this.sanitizedChildren.props))}
                </SectionScrollContainer>
                {
                    Array.isArray(this.exceptionChildren) ?
                        this.exceptionChildren.map((child, i)=>{
                            return (
                                React.cloneElement(child, Object.assign({}, this.getPropsToSend(), {key:i}, child.props))
                            )
                        })
                        : React.cloneElement(this.exceptionChildren, Object.assign(this.getPropsToSend(), this.exceptionChildren.props))
                }
            </SectionScrollComponent>
        )

    }

}
