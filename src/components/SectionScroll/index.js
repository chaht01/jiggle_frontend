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

class SectionScroll extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            self: null,
            screenHeight: window.innerHeight,
            prevScrollTop: 0,
            direction: 'idle',
            isWheelEvent: false,
            animatingId: [],
            nextSection: 0,
            activeSection: 0,
            prevDelta: 0,
            wheelTId: -1
        }
        this.sanitizedChildren = null
        this.exceptionChildren = null
        this.timeline = null
        this.anchorIdx = 0
        this.activeAnchorLength = 0
        this.handleSection = this.handleSection.bind(this)
        this.disableScroll = this.disableScroll.bind(this)
        this.handleWheelEvents = this.handleWheelEvents.bind(this)
        this.activateSection = this.activateSection.bind(this)
        this.checkValidSectionIdx = this.checkValidSectionIdx.bind(this)
        this.checkAnchorIndex = this.checkAnchorIndex.bind(this)
        this.getPropsToSend = this.getPropsToSend.bind(this)
    }

    disableScroll(e){
        e.preventDefault()
        return false
    }

    updateScreenProperties(cb){
        this.setState((prevState, props) => {
            const container = ReactDOM.findDOMNode(this.container)
            return {
                screenHeight: container.clientHeight,
                self: container,
                prevScrollTop: container.scrollTop,
                activeSection: parseInt(container.scrollTop/prevState.screenHeight),
                delta: 0
            }
        }, () => {
            if(cb && typeof cb === "function"){
                cb()
            }
        })
    }

    checkValidSectionIdx(idx){
        if(this.state.self.children[idx] == undefined){
            return false
        }
        return true
    }

    handleWheelEvents(e){
        // Update current activeSection sync with current scroll bar status.
        this.setState((prevState)=>{
            return {
                activeSection: parseInt(prevState.self.scrollTop/prevState.screenHeight)
            }
        }, () => {
            ReactDOM.findDOMNode(this.container).removeEventListener('wheel', this.disableScroll) // 휠 이벤트 블럭을 다시 푼다

            const currDelta = e.deltaY
            const direction = (currDelta < 0 ? 'up':'down')

            let nextSection = direction === 'down' ? this.state.activeSection+1 :
                (direction==='idle' ? this.state.activeSection : this.state.activeSection-1)
            if(!this.checkValidSectionIdx(nextSection)){
                nextSection = this.state.activeSection
            }

            this.setState((prevState) => {
                if(prevState.wheelTId!=-1) { // 이미 휠 이벤트를 중지할 계획이었다면 취소한다(계속 휠 이벤트를 블럭하기 위함)
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
                            ReactDOM.findDOMNode(this.container).addEventListener('wheel', this.handleWheelEvents) // 휠 이벤트 재등록
                        })
                    }, 500)
                }
            }, ()=>{
                ReactDOM.findDOMNode(this.container).addEventListener('wheel', this.disableScroll, {passive: false}) // 휠 이벤트도 막는다(계산용으로만 사용)
                ReactDOM.findDOMNode(this.container).removeEventListener('wheel', this.handleWheelEvents) // 휠 이벤트 블럭
                if(this.state.animatingId.length == 0) { // 애니메이션이 끝났을때 재개
                    this.handleSection(e)
                }
            })
        })


    }

    handleSection(e){
        if(this.state.nextSection!=this.state.activeSection){
            this.triggerScrollAnimate(ReactDOM.findDOMNode(this.container).children[this.state.nextSection])
        }
    }

    activateSection(index, cb){
        if(this.checkValidSectionIdx(index)){
            this.setState(()=>{
                return {
                    nextSection: index
                }
            }, () => {
                if(cb && typeof cb === "function"){
                    cb()
                }
            })
        }
    }


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
            container.scroll(0, destinationOffsetToScroll);
            if (callback) {
                callback();
            }
            return;
        }

        container.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start))
        if (container.scrollTop === destinationOffsetToScroll) {
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
    triggerScrollAnimate(destination, duration=1000, easing='easeInOutCubic') {

        const container = this.state.self || ReactDOM.findDOMNode(this.container)
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime()


        const finished = () => {
            this.state.animatingId.forEach(id => cancelAnimationFrame(id))
            this.setState((prevState, props) => {
                return {
                    animatingId: [],
                    direction: 'idle',
                    isWheelEvents: false,
                    activeSection: parseInt(container.scrollTop/prevState.screenHeight),
                }
            }, () => {
            })
        }
        this.scroll(container, destination, startTime, duration, easing, finished)
    }

    checkAnchorIndex() {
        this.anchorIdx = parseInt((this.state.self.scrollTop+this.state.screenHeight/2)/this.state.screenHeight)
    }

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
                    return allowedComponents.indexOf(child.type)<0 && (child && !child.props.hasOwnProperty('sectionScrollException'))
                }).length>0
                : allowedComponents.indexOf(children.type)<0)){
            console.error('Render error: cannot render component but "SectionScrollSection"')
        }
        if(childrenIsArray){
            this.sanitizedChildren = children.filter((child)=>allowedSections.indexOf(child.type)>-1)
            this.exceptionChildren = children.filter((child)=> child && child.props.hasOwnProperty('sectionScrollException'))
            this.timeline = children.filter((child)=>allowedTimeline.indexOf(child.type)>-1)[0]
            this.sanitizedChildren = this.sanitizedChildren.length === 0 ? null : this.sanitizedChildren
            this.activeAnchorLength = this.sanitizedChildren.length
        }else{
            this.sanitizedChildren = allowedSections.indexOf(children)>-1 ? children : null
            this.timeline = allowedTimeline.indexOf(children)>-1 ? children : null
            this.exceptionChildren = children.props.hasOwnProperty('sectionScrollException') ? children : null
            this.activeAnchorLength = 0
        }
    }

    componentWillMount(){
        this.sanitizeChildren(this.props.children)
    }

    componentDidMount(){
        this.updateScreenProperties(()=>{
            window.addEventListener('resize', this.updateScreenProperties.bind(this), false)
            this.state.self.addEventListener('scroll', this.checkAnchorIndex)
            this.state.self.addEventListener('wheel', this.handleWheelEvents, {passive:false})
            const active = this.props.active || 0
            this.activateSection(active, this.handleSection)
        })
    }

    componentWillReceiveProps(nextProps){
        this.sanitizeChildren(nextProps.children)
        const active = nextProps.active || 0
        setTimeout(()=>this.activateSection(active, this.handleSection), 250) //TODO: async
    }

    getPropsToSend(){
        return {
            active: this.anchorIdx,
            activeAnchorLength: this.activeAnchorLength,
            activateSection: (index)=>this.activateSection(index, this.handleSection),
            direction: (this.state.activeSection === this.state.nextSection ? 'idle' :
                (this.state.activeSection < this.state.nextSection) ? 'down' : 'up')
        }
    }

    render(){
        return (
            <SectionScrollComponent>
                {React.cloneElement(this.timeline, this.getPropsToSend())}
                <SectionScrollContainer ref={(container)=> this.container = container} timeline={this.timeline!==null}>
                    {this.sanitizedChildren}
                </SectionScrollContainer>
                {
                    Array.isArray(this.exceptionChildren) ?
                        this.exceptionChildren.map((child, i)=>{
                            return (
                                React.cloneElement(child, Object.assign({}, this.getPropsToSend(),{key:i}))
                            )
                        })
                        : React.cloneElement(this.exceptionChildren, this.getPropsToSend())
                }
            </SectionScrollComponent>
        )

    }

}

export default SectionScroll
