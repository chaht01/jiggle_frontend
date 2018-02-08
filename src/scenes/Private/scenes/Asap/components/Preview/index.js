import React from 'react'
import ReactDOM from 'react-dom'
import Button from '../../../../../../components/Button'
import FullPage from '../../../../../../components/Layout/FullPage'
import Composition from '../../../../../../components/Composition'
import PaddedContainer from '../PaddedContainer'


import {chart0, chart1, chart2} from 'd3-reusable/src/data/bar-data'

import styled from 'styled-components'
import {parseBar} from "d3-reusable/src/parser/bar-parser";
import BarFactory from "d3-reusable/src/factory/bar-factory";

const PreviewContainer = styled.div`
    width: 60rem;
    margin: 0 auto;
`

const PreviewThumbnails = styled(Composition)`
    background: #fff;
`

const FooterStyled = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 2rem;
    width: 100%;
    height: 64px;
    background: #000001;
    left: 0;
    bottom: 0;
    top: auto;
    color: #fff;
`

const GifViewer = styled.div`
    width: auto;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Transformable = styled.rect`
    cursor:pointer;
    stroke: blue;
    fill:transparent;
    stroke-width:2;       
`
const TransformAnchor = styled.rect`
    cursor: ${props => props.cursor};
    fill: #fff;
    stroke: blue;
    stroke-width:1;
`
class Sizeable extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            appearance:{
                width: this.props.width || 100,
                height: this.props.height || 100,
                x: this.props.x || 100,
                y: this.props.y || 100,
            },
            href: this.props.href,
            anchor:{
                triggered: -1,
                startPos:{
                    x: this.props.x || 100,
                    y: this.props.y || 100,
                    mouseX : 0,
                    mouseY : 0
                }
            },
            prevWidth: 0,
            prevHeight: 0,
        }
    }
    componentDidMount(){
        console.log(ReactDOM.findDOMNode(this.node).parentNode.getClientRects())
    }

    render(){
        const {children, focused, focus, idx} = this.props
        if(!this.state.href){
            return null
        }
        const focusSelf = (e, idx) => {
            focus(idx)
            e.stopPropagation()
        }
        const anchorSize = 6
        return(
            <g onClick={(e)=>focusSelf(e, idx)}
               ref={(node) => this.node = node}
               onMouseUp={()=>
                   this.setState((prevState)=>{
                       return{
                           anchor:{
                               triggered: -1,
                               startPos:{
                                   x: prevState.appearance.x,
                                   y: prevState.appearance.y,
                               }
                           },
                           prevWidth: prevState.appearance.width,
                           prevHeight: prevState.appearance.height
                       }})}>
                <image {...this.state.appearance} href={this.state.href}/>
                {focused &&
                <g>
                    <Transformable {...this.state.appearance}/>
                    <TransformAnchor cursor="nwse-resize" width={anchorSize} height={anchorSize}
                                     x={this.state.appearance.x + this.state.appearance.width*0 - anchorSize/2}
                                     y={this.state.appearance.y + this.state.appearance.height*0 - anchorSize/2}
                                     onMouseDown={(e)=>{
                                         console.log('f')
                                         e.persist()
                                         const {left, top} = ReactDOM.findDOMNode(this.node).parentNode.parentNode.getClientRects()[0]
                                         this.setState((prevState) => {
                                             return {
                                                 anchor: {
                                                     triggered: 0,
                                                     startPos: {
                                                         x: e.clientX - left,
                                                         y: e.clientY - top,
                                                         mouseX: e.clientX,
                                                         mouseY: e.clientY
                                                     }
                                                 },
                                             }
                                         })
                                     }}
                                     onMouseMove={(e)=>{
                                         if(this.state.anchor.triggered==0){
                                             const delX = e.clientX - this.state.anchor.startPos.mouseX
                                             const delY = e.clientY - this.state.anchor.startPos.mouseY
                                             console.log(delX, delY, this.state.anchor.startPos.mouseX, this.state.anchor.startPos.mouseY, this.state.prevWidth, this.state.prevHeight)
                                             this.setState((prevState) => {
                                                 return {
                                                     appearance:{
                                                         ...prevState.appearance,
                                                         x: prevState.anchor.startPos.x += (delX),
                                                         y: prevState.anchor.startPos.y += (delY),
                                                     }
                                                 }
                                             })
                                         }
                                     }}
                    />
                    <TransformAnchor cursor="ns-resize" width={anchorSize} height={anchorSize}
                                     x={this.state.appearance.x + this.state.appearance.width*0.5 - anchorSize/2}
                                     y={this.state.appearance.y + this.state.appearance.height*0 - anchorSize/2}/>
                    <TransformAnchor cursor="nesw-resize" width={anchorSize} height={anchorSize}
                                     x={this.state.appearance.x + this.state.appearance.width*1 - anchorSize/2}
                                     y={this.state.appearance.y + this.state.appearance.height*0 - anchorSize/2}/>
                    <TransformAnchor cursor="ew-resize" width={anchorSize} height={anchorSize}
                                     x={this.state.appearance.x + this.state.appearance.width*1 - anchorSize/2}
                                     y={this.state.appearance.y + this.state.appearance.height*0.5 - anchorSize/2}/>
                    <TransformAnchor cursor="nwse-resize" width={anchorSize} height={anchorSize}
                                     x={this.state.appearance.x + this.state.appearance.width*1 - anchorSize/2}
                                     y={this.state.appearance.y + this.state.appearance.height*1 - anchorSize/2}/>
                    <TransformAnchor cursor="ns-resize" width={anchorSize} height={anchorSize}
                                     x={this.state.appearance.x + this.state.appearance.width*0.5 - anchorSize/2}
                                     y={this.state.appearance.y + this.state.appearance.height*1 - anchorSize/2}/>
                    <TransformAnchor cursor="nesw-resize" width={anchorSize} height={anchorSize}
                                     x={this.state.appearance.x + this.state.appearance.width*0 - anchorSize/2}
                                     y={this.state.appearance.y + this.state.appearance.height*1 - anchorSize/2}/>
                    <TransformAnchor cursor="ew-resize" width={anchorSize} height={anchorSize}
                                     x={this.state.appearance.x + this.state.appearance.width*0 - anchorSize/2}
                                     y={this.state.appearance.y + this.state.appearance.height*0.5 - anchorSize/2}/>
                </g>
                }

            </g>
        )
    }
}

const Footer = ({activeAnchorLength, direction, renderGIF, ...rest}) => {
    return (
        <FooterStyled>
            <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}} disabled={true}>추가작업</Button>
            <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}} onClick={(e)=>renderGIF()}>렌더 & 저장하기</Button>
        </FooterStyled>
    )
}
class Preview extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            focusedIdx: -1,
            event: {
                x: 0,
                y: 0
            },
            anchorIdx: -1
        }
        this.renderGIF = this.renderGIF.bind(this)
        this.focusImage = this.focusImage.bind(this)
        this.setAnchorIdx = this.setAnchorIdx.bind(this)
    }
    renderGIF(){
        this.factory.recordTransition(this.node, [...this.charts])
    }
    init(){
        this.charts = [chart0, chart1, chart2]
        this.charts.forEach(chart => parseBar(chart));
        this.factory = new BarFactory();
        // const renderer = factory.renderChart();
        // renderer(this.node, props.charts[0]);
        const renderTransition = this.factory.renderTransition();
        renderTransition(this.node, [...this.charts]);
    }

    setAnchorIdx(idx){
        this.setState({
            anchorIdx: idx
        })
    }
    focusImage(idx){
        this.setState({
            focusedIdx:idx,
        })
    }
    componentDidMount(){
        this.init()
    }
    render(){
        const images = [
            {
                href: "https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png"
            }
        ]
        return (
            <PaddedContainer>
                <FullPage>
                    <PreviewContainer>
                        <PreviewThumbnails onClick={()=>this.focusImage(-1)}>
                            <svg style={{width:'100%', height:'100%'}} ref={node => this.node = node}
                                 onMouseDown={(e)=>{
                                     e.persist()
                                     console.log('ff')
                                     this.setState({x:e.clientX, y: e.clientY})
                                 }}
                                 onMouseMove={(e)=>{
                                     if(this.state.focusedIdx>-1){
                                         const {left, top} = ReactDOM.findDOMNode(this.node).getClientRects()[0]
                                         const diffX = e.clientX - this.state.x
                                         const diffY = e.clientY - this.state.y
                                         console.log(diffX, diffY)
                                     }
                                 }}>
                                {images.map((image, i)=>(
                                    <Sizeable key={i} idx={i} focused={i===this.state.focusedIdx} focus={this.focusImage} setAnchorIdx={this.setAnchorIdx} {...image}/>)
                                )}
                            </svg>

                            <GifViewer id="gif"/>
                        </PreviewThumbnails>
                    </PreviewContainer>
                    <Footer renderGIF={this.renderGIF}/>
                </FullPage>
            </PaddedContainer>

        )
    }

}

export default Preview
