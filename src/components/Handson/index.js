import React from 'react'
import ReactDOM from 'react-dom'
import HotTable from 'react-handsontable'

import styled from 'styled-components'

class Handson extends React.Component {
    constructor(props){
        super(props);
        this.getInstance = this.getInstance.bind(this)
        this.preventWheel = this.preventWheel.bind(this)
        this.handleWheelEvent = this.handleWheelEvent.bind(this)

        this.contextMenu = {}
        this.updateContextMenu(this.props)

    }
    handleWheelEvent(element, e){
        const dY = e.deltaY,
            currScrollPos = element.scrollTop,
            scrollableDist = element.scrollHeight - element.clientHeight
        if((dY>0 && currScrollPos >= scrollableDist) ||
            (dY<0 && currScrollPos <= 0)){
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        e.stopPropagation();
    }
    preventWheel(){
        Array.prototype.forEach.call(
            ReactDOM.findDOMNode(this.container).querySelectorAll('.wtHolder'),
            (scrollableNode)=>{
                scrollableNode.addEventListener('wheel', this.handleWheelEvent.bind(this, scrollableNode), {passive: false})
            })
    }
    getInstance(){
        return this.container.hotInstance
    }
    updateContextMenu(props){
        const defaultContextMenu = {
            items: {
                "row_above": {
                    name: "위에 행 추가"
                },
                "row_below": {
                    name: "아래 행 추가"
                },
                "hsep1": "---------",
                "col_left": {
                    name: "왼쪽 열 추가"
                },
                "col_right": {
                    name: "오른쪽 열 추가"
                },
                "hsep2": "---------",
                "remove_row": {
                    name: "행 지우기"
                },
                "remove_col": {
                    name: "열 지우기"
                },
                "hsep3": "---------",
                "undo": {
                    name: "되돌리기"
                },
                "redo": {
                    name: "다시하기"
                },
                "make_read_only": {
                    name: "선택영역을 읽기전용으로"
                },
            }
        }
        if(props.settings && props.settings.contextMenu){
            this.contextMenu = {
                callback : props.settings.contextMenu.callback,
                items: Object.assign({}, defaultContextMenu.items, props.settings.contextMenu.items)
            }
        }
    }
    componentDidMount(){
        this.preventWheel()
    }
    componentWillReceiveProps(nextProps){
        this.updateContextMenu(nextProps)
    }
    componentDidUpdate(){
        this.preventWheel()
    }
    render(){
        const ScrollContainer = styled.div`
        width: ${props => props.width}px;
        height: ${props => props.height}px;
        overflow: hidden;
    `
        return(
            <ScrollContainer width={this.props.width} height={this.props.height}>
                <HotTable settings={Object.assign({}, this.props.settings, {contextMenu:this.contextMenu})} ref={(container)=> this.container = container}/>
            </ScrollContainer>
        )
    }
}

export default Handson
