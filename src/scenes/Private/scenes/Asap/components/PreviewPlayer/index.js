import React from 'react'
import ReactDOM from 'react-dom'
import Button from '../../../../../../components/Button'
import FullPage from '../../../../../../components/Layout/FullPage'
import Composition from '../../../../../../components/Composition'
import PaddedContainer from '../PaddedContainer'

import styled from 'styled-components'
import parseBar from 'd3-reusable/src/parser/bar-parser'
import BarFactory from "d3-reusable/src/factory/bar-factory";
import {getChildG} from 'd3-reusable/src/factory/common-factory'
import Resizeable from '../../../../components/Resizeable'

import connect from "react-redux/es/connect/connect";
import * as numeral from "numeral";
import {getFactory} from "../../config/common";



const PreviewContainer = styled.div`
    height: 60vh;
    width: ${60*16/9}vh;
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

const ResizeHandleSVG = styled.svg`
    position: absolute;
    left: 0;
    top:0;
    right:0;
    bottom:0;
    width: 100%;
    height: 100%;
    z-index: ${props => props.active ? '1': 'auto'}
`


const Footer = ({activeAnchorLength, direction, renderGIF, ...rest}) => {
    return (
        <FooterStyled>
            <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}} disabled={true}>추가작업</Button>
            <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}} onClick={(e)=>renderGIF()}>렌더 & 저장하기</Button>
        </FooterStyled>
    )
}

function getDataUri(url, callback) {
    var image = new Image();
    image.crossOrigin = "Anonymous";

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        callback(canvas.toDataURL('image/png'));
    };

    image.src = url;
}

const mapStateToProps = (state, ownProps) => {
    return {
        mask: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.safeMask,
        meta: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.meta,
        templateType: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type,
        template: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config,
    }
}

class PreviewPlayerRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            focusedIdx: -1,
            event: {
                x: 0,
                y: 0
            },
            anchorIdx: -1,
            diff:{
                x:0,
                y:0
            },
            images: [],
        }
        this.renderGIF = this.renderGIF.bind(this)
        this.focusImage = this.focusImage.bind(this)
        this.setAnchorIdx = this.setAnchorIdx.bind(this)
        this.updateTransformer = this.updateTransformer.bind(this)
        this.deleteImage = this.deleteImage.bind(this)
        this.clearChart = this.clearChart.bind(this)
    }
    renderGIF(){
        this.clearChart()
        this.factory.recordTransition(this.node, [...this.charts])
    }
    setAnchorIdx(idx, cb){
        this.setState({
            anchorIdx: idx
        }, cb)
    }
    focusImage(idx, cb){
        this.setState({
            focusedIdx:idx,
        }, ()=>{
            if( typeof cb == 'function'){
                cb()
            }
            this.init(this.props)
        })
    }
    deleteImage(idx){
        this.setState((prevState) => {
            let newArr = prevState.images.slice()
            newArr.splice(idx, 1);
            return {
                images:newArr
            }
        }, ()=>{
            this.updateTransformer()
            this.focusImage(-1)
        })
    }
    clearChart(){
        for(let i=0; i<this.renderNode.childNodes.length; i++){
            this.renderNode.childNodes[i].remove()
        }
    }


    init(recentProps){
        const {meta} = recentProps
        if(recentProps.mask === null){
            return
        }
        const {mask, comments} = recentProps.mask
        if(!mask || !comments || mask.length==0){
            return
        }

        const width = numeral(getComputedStyle(ReactDOM.findDOMNode(this.renderNode)).width).value()

        const {templateType:type, template:templateConfig} = recentProps
        const {charts, factory} = getFactory(type, mask, meta, templateConfig, width, comments)

        const renderChart = factory.renderChart()
        const gParent = this.state.focusedIdx==-1 ? renderChart(this.renderNode, charts[charts.length-1], this.state.images.map((image)=>{
                const hello = image.href
                return Object.assign({}, image, {
                    mimeType: hello.slice(hello.indexOf(':')+1,hello.indexOf(';')),
                    base64: hello.slice(hello.indexOf(',')+1)
                })
            })) : renderChart(this.renderNode, charts[charts.length-1])

        this.gChildren = getChildG(gParent)
        this.gChildren['graph'].style.cssText = "user-select:none; pointer-events:none;"
        this.gChildren['image'].childNodes.forEach((child, i) => {
            child.addEventListener('click',()=>{
                this.focusImage(i)
            })
        })
        this.updateTransformer()
    }
    componentDidMount(){
        this.init(this.props)
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.attachIdx>-1){
            const uri = nextProps.images[nextProps.attachIdx]
            this.setState((prevState)=>{
                let newImages = prevState.images.slice()
                newImages.push({
                    width: 100,
                    height: 100,
                    x: Math.random()*(numeral(getComputedStyle(ReactDOM.findDOMNode(this.node)).width).value()-100),
                    y: Math.random()*(numeral(getComputedStyle(ReactDOM.findDOMNode(this.node)).height).value()-100),
                    href: uri.base64
                })
                return {
                    images: newImages
                }
            }, this.props.clearAttachCall)
        }
        this.init(nextProps)
    }
    updateTransformer(){
        const focusedIdx = this.state.focusedIdx
        const focusedAnchorIdx = this.state.anchorIdx
        this.setState((prevState)=>{
            console.log(this.refs)
            return {
                images: prevState.images.map((image, i)=>{
                    if(i != focusedIdx){
                        return image
                    }else{
                        return {
                            ...image,
                            ...this.refs[`image_${focusedIdx}`].transform(image, {width:100, height:100, x:100, y:100}, focusedAnchorIdx, prevState.diff)
                        }
                    }
                })
            }
        }, ()=>{
            this.setAnchorIdx(-1)
            this.setState({diff:{x:0, y:0}})
        })
    }

    render(){
        return (
            <PaddedContainer>
                <FullPage>
                    <PreviewContainer>
                        <PreviewThumbnails>
                            <ResizeHandleSVG active={this.state.focusedIdx>-1} innerRef={node => this.node = node}
                                             onMouseDown={(e)=>{
                                                 e.persist()
                                                 this.setState({x:e.clientX, y: e.clientY})
                                                 if(e.target == this.node){
                                                     this.focusImage(-1)
                                                 }
                                             }}
                                             onMouseMove={(e)=>{
                                                 if(this.state.focusedIdx>-1 && this.state.anchorIdx>-1){
                                                     const diffX = e.clientX - this.state.x
                                                     const diffY = e.clientY - this.state.y
                                                     this.setState({diff:{x: diffX, y: diffY}})
                                                 }
                                             }}
                                             onMouseUp={(e)=> {
                                                 this.updateTransformer()
                                             }}
                                             onMouseLeave={(e)=>{
                                                 this.updateTransformer()
                                             }}
                            >
                                {
                                    this.state.images.map((image, i) => {
                                        return(
                                            <Resizeable key={i}
                                                        idx={i}
                                                        ref={`image_${i}`}
                                                        focused={i === this.state.focusedIdx}
                                                        focus={this.focusImage}
                                                        setAnchorIdx={this.setAnchorIdx}
                                                        anchorIdx={this.state.anchorIdx}
                                                        diff={this.state.diff}
                                                        deleteSelf={this.deleteImage}
                                                        {...image}/>)

                                    })
                                }
                            </ResizeHandleSVG>
                            <svg style={{position:'relative', width:'100%', height:'100%'}} ref={node => this.renderNode = node}>
                                {/* bro's chart */}
                            </svg>
                        </PreviewThumbnails>
                    </PreviewContainer>

                    <Footer renderGIF={this.renderGIF}/>
                </FullPage>
            </PaddedContainer>

        )
    }
}


class ResizeImages extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        const {images, focusedIdx, focusImage, setAnchorIdx, anchorIdx, diff, deleteImage} = this.props
        return(
            images.map((image, i) => {
                return(
                    <Resizeable key={i}
                                idx={i}
                                focused={i === focusedIdx}
                                focus={focusImage}
                                setAnchorIdx={setAnchorIdx}
                                anchorIdx={anchorIdx}
                                diff={diff}
                                deleteSelf={deleteImage}
                                {...image}/>)

            })

        )
    }
}


const PreviewPlayer = connect(
    mapStateToProps,
    null,
)(PreviewPlayerRepresentation)

export default PreviewPlayer
