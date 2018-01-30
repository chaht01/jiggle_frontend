import React from 'react'
import ReactDOM from 'react-dom'

import SectionScrollContainer from './SectionScrollContainer'
import SectionScrollSection from './SectionScrollSection'
import SectionScrollRouteSection from './SectionScrollRouteSection'
import SectionScrollTimeline from './SectionScrollTimeline'
import FullPage from '../Layout/FullPage'

import styled from 'styled-components'

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
        this.updateScrollState = this.updateScrollState.bind(this)
        this.handleScrollEvents = this.handleScrollEvents.bind(this)
        this.disableScroll = this.disableScroll.bind(this)
        this.handleWheelEvents = this.handleWheelEvents.bind(this)
    }

    disableScroll(e){
        e.preventDefault()
        return false
    }

    updateScreenProperties(){
        this.setState((prevState, props) => {
            const container = ReactDOM.findDOMNode(this.container)
            return {
                screenHeight: container.clientHeight,
                self: container,
                prevScrollTop: container.scrollTop,
                // activeSection: parseInt(container.scrollTop/prevState.screenHeight),
                delta: 0
            }
        })
    }

    updateScrollState(){
        this.setState((prevState, props) => {
            const st = prevState.self.scrollTop
            return {
                direction: st > prevState.prevScrollTop ? 'down' : 'up',
                prevScrollTop: st,
                delta: st - prevState.prevScrollTop
            }
        })
    }


    handleWheelEvents(e){
        console.log("start@@")
        // console.log(e.deltaY, -e.wheelDelta, e.detail)
        // console.log(this.state.activeSection, this.state.nextSection, prevDelta, currDelta, forceUpdate)
        // console.log("start!!")
        // ReactDOM.findDOMNode(this.container).removeEventListener('scroll', this.handleScrollEvents, false) // 스크롤 이벤트와 중복되는 것을 막기위해 스크롤은 중지시킨다
        ReactDOM.findDOMNode(this.container).removeEventListener('wheel', this.disableScroll) // 휠 이벤트 블럭을 다시 푼다

        const prevDirection = this.state.direction
        // const direction = Math.abs(e.deltaY) < 20 ? 'idle' : (e.deltaY < 0 ? 'up':'down')
        const prevDelta = this.state.prevDelta
        const currDelta = e.deltaY
        const forceUpdate = currDelta * prevDelta > 0 && Math.abs(currDelta) > Math.abs(prevDelta)

        const direction = (currDelta < 0 ? 'up':'down')
        let nextSection = direction === 'down' ? this.state.activeSection+1 :
            (direction==='idle' ? this.state.activeSection : this.state.activeSection-1)
        if(this.state.self.children[nextSection] == undefined){
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
                        console.log('g', this.state.activeSection, this.state.nextSection)
                        ReactDOM.findDOMNode(this.container).addEventListener('wheel', this.handleWheelEvents) // 휠 이벤트 재등록
                    })
                }, 500)
            }
        }, ()=>{
            ReactDOM.findDOMNode(this.container).addEventListener('wheel', this.disableScroll, {passive: false}) // 휠 이벤트도 막는다(계산용으로만 사용)
            ReactDOM.findDOMNode(this.container).removeEventListener('wheel', this.handleWheelEvents) // 휠 이벤트 블럭
            if(this.state.animatingId.length == 0) { // 애니메이션이 끝났을때 재개
                this.handleScrollEvents(e)
            }
        })
    }

    handleScrollEvents(e){
        /*
        if(this.state.wheelTId==-1){ //catch idle

        }else{ //catch direction

        }
        */
        if(this.state.nextSection!=this.state.activeSection){
            this.triggerScrollAnimate(ReactDOM.findDOMNode(this.container).children[this.state.nextSection])
        }

        /*
        * const nextSection = this.state.direction === 'down' ? this.state.activeSection+1 :
         (this.state.direction==='idle' ? this.state.activeSection : this.state.activeSection-1)

         if(this.state.self.children[nextSection] !== undefined) {
         this.setState(()=>{
         return {
         activeSection: nextSection
         }
         }, () => {
         this.triggerScrollAnimate(ReactDOM.findDOMNode(this.container).children[nextSection])
         console.log('a')
         })
         }*/

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

        // 스크롤 이벤트 블럭
        ReactDOM.findDOMNode(this.container).removeEventListener('scroll', this.handleScrollEvents, false)
        ReactDOM.findDOMNode(this.container).addEventListener('scroll', this.disableScroll, false)

        const container = this.state.self || ReactDOM.findDOMNode(this.container)
        const startTime = 'now' in window.performance ? performance.now() : new Date().getTime()


        const finished = () => {
            console.log('finish called@', container.scrollTop, this.state.screenHeight)
            this.state.animatingId.forEach(id => cancelAnimationFrame(id))
            this.setState((prevState, props) => {
                return {
                    animatingId: [],
                    direction: 'idle',
                    activeSection: parseInt(container.scrollTop/prevState.screenHeight),
                }
            })
        }
        this.scroll(container, destination, startTime, duration, easing, finished)
    }

    sanitizeChildren(children){
        /**
         * Check children is SectionScrollSection Component
         */
        this.sanitizedChildren = children.filter((child)=>(child!==null && child!==undefined))
        const childrenIsArray = Array.isArray(this.sanitizedChildren)
        const allowedComponents = [SectionScrollSection, SectionScrollRouteSection, SectionScrollTimeline]
        if((childrenIsArray ?
                this.sanitizedChildren.filter((child)=> allowedComponents.indexOf(child.type)<0).length>0
                : allowedComponents.indexOf(children.type)<0)){
            console.error('Render error: cannot render component but "SectionScrollSection"')
            if(childrenIsArray){
                this.sanitizedChildren = children.filter((child)=>allowedComponents.indexOf(child.type)>-1)
                this.sanitizedChildren = this.sanitizedChildren.length === 0 ? null : this.sanitizedChildren
            }else{
                this.sanitizedChildren = null
            }
        }
    }

    componentWillMount(){
        this.sanitizeChildren(this.props.children)
    }

    componentDidMount(){
        this.updateScreenProperties()
        window.addEventListener('resize', this.updateScreenProperties.bind(this), false)
        // ReactDOM.findDOMNode(this.container).addEventListener('scroll', this.handleScrollEvents)
        ReactDOM.findDOMNode(this.container).addEventListener('wheel', this.handleWheelEvents, {passive:false})
        const active = this.props.active || 0
        this.triggerScrollAnimate(ReactDOM.findDOMNode(this.container).children[active])
    }

    componentWillReceiveProps(nextProps){
        this.sanitizeChildren(nextProps.children)
    }

    render(){
        return (
            <SectionScrollContainer ref={(container)=> this.container = container}>
                {this.sanitizedChildren}
            </SectionScrollContainer>
        )

    }

}

export default SectionScroll
