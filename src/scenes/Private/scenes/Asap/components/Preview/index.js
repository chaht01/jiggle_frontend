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
    }
}

class PreviewRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            imageContainer: null,
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
            images:[
                {
                    width: 231,
                    height: 217,
                    x: 351,
                    y: 20,
                    href: "data:image/gif;base64,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"
                },
                {
                    width: 231,
                    height: 217,
                    x: 101,
                    y: 20,
                    href: "data:image/gif;base64,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"
                }
            ]
        }
        // Usage
        getDataUri('https://cdn.mdn.mozilla.net/static/img/home-globe.ce5923c4246e.jpg', (dataUri)=>{
            this.setState((prevState) => {
                return {
                    images: prevState.images.map((img,i)=>{
                        return {
                            ...img,
                            href: dataUri
                        }
                    })
                }
            })
        });
        this.renderGIF = this.renderGIF.bind(this)
        this.focusImage = this.focusImage.bind(this)
        this.setAnchorIdx = this.setAnchorIdx.bind(this)
        this.updateTransformer = this.updateTransformer.bind(this)
        this.deleteImage = this.deleteImage.bind(this)
        this.clearChart = this.clearChart.bind(this)
        this.renderImages = this.renderImages.bind(this)
        this.images = []
        this.finalNode = null
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
        }, cb)
    }
    deleteImage(idx){
        this.focusImage(-1, ()=>{
            this.setState((prevState) =>{
                let newArr = prevState.images.slice()
                newArr.splice(idx, 1);
                return {
                    images:newArr
                }
            }, ()=>this.updateTransformer())
        })


    }
    clearChart(){
        for(let i=0; i<this.renderNode.childNodes.length; i++){
            this.renderNode.childNodes[i].remove()
        }
    }

    renderImages(){
        return this.state.images.map((image, i) => {
            return(
            //     React.createElement(Resizeable,
            //         ((ctx)=>{
            //             return {
            //                 key: i,
            //                 idx: i,
            //                 ref: node => ctx.images.push(node),
            //                 focused: i === ctx.state.focusedIdx,
            //
            //                 focus: ctx.focusImage,
            //
            //                 setAnchorIdx: ctx.setAnchorIdx,
            //                 anchorIdx: ctx.state.anchorIdx,
            //                 diff: ctx.state.diff,
            //                 deleteSelf: ctx.deleteImage,
            //                 ...image
            //
            //             }
            //         })(this))
            // )
            <Resizeable key={i}
                        idx={i}
                        ref={node => this.images.push(node)}
                        focused={i === this.state.focusedIdx}
                        focus={this.focusImage}
                        setAnchorIdx={this.setAnchorIdx}
                        anchorIdx={this.state.anchorIdx}
                        diff={this.state.diff}
                        deleteSelf={this.deleteImage}
                        {...image}/>)

        })
    }
    init(recentProps){
        this.setState({imageContainer:null})
        if(recentProps.mask.length == 0){
            return
        }
        const width = numeral(getComputedStyle(ReactDOM.findDOMNode(this.renderNode)).width).value()
        const {mask, meta} = recentProps
        const settings = [{
            type: "vertical",
            rawData: mask[0],
            duration: 1500,
            width_svg: width,
            height_svg: width*9/16,
            title: meta.title,
            subtitle: meta.subtitle,
            reference: meta.reference,
            madeBy: meta.producer,
        }, {
            type: "vertical",
            rawData: mask[1],
            duration: 1500,
            delay: 1500,
            width_svg: width,
            height_svg: width*9/16,
            title: meta.title,
            subtitle: meta.subtitle,
            reference: meta.reference,
            madeBy: meta.producer,
        }]

        this.charts = settings.map((setting) => {
            return Object.assign({}, this.props.template, setting)
        })
        this.charts.forEach(chart => parseBar(chart));
        this.factory = new BarFactory();

        const renderTransition = this.factory.renderTransition()
        renderTransition(this.renderNode, this.charts)

        const renderStatic = this.factory.renderChart()
        const gParent =renderStatic(this.renderNode, this.charts[this.charts.length-1])
        this.gChildren = getChildG(gParent)
        this.gChildren['graph'].style.cssText = "user-select:none; pointer-events:none;"
        this.setState({imageContainer: this.gChildren['image']})
        this.gChildren['image'].innerHTML = "<use href='#images'/>"
    }
    componentDidMount(){
        this.init(this.props)
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        this.init(nextProps)
    }
    updateTransformer(){
        const focusedIdx = this.state.focusedIdx
        const focusedAnchorIdx = this.state.anchorIdx
        this.setState((prevState)=>{
            return {
                images: prevState.images.map((image, i)=>{
                    if(i != focusedIdx){
                        return image
                    }else{
                        return {
                            ...image,
                            ...this.images[focusedIdx].transform(image, {width:100, height:100, x:100, y:100}, focusedAnchorIdx, this.state.diff)
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
                            <svg style={{width:'100%', height:'100%'}} ref={node => this.node = node}
                                 onMouseDown={(e)=>{
                                     e.persist()
                                     this.setState({x:e.clientX, y: e.clientY})
                                     console.log(e.clientX, e.clientY)
                                     if(e.target == this.node){
                                         this.focusImage(-1)
                                     }
                                 }}
                                 onMouseMove={(e)=>{
                                     if(this.state.focusedIdx>-1 && this.state.anchorIdx>-1){
                                         const diffX = e.clientX - this.state.x
                                         const diffY = e.clientY - this.state.y
                                         this.setState({diff:{x: diffX, y: diffY}})
                                         console.log(this.state)
                                     }
                                 }}
                                 onMouseUp={(e)=> {
                                     this.updateTransformer()
                                 }}
                                 onMouseLeave={(e)=>{
                                     this.updateTransformer()
                                 }}
                            >
                                {/* 차트 */}

                                <g ref={node => this.renderNode = node}>
                                    <g id="images" ref={node => this.finalNode = node}>
                                        {this.state.imageContainer ?
                                            <ImageContainer images={this.renderImages} container={
                                                this.state.imageContainer
                                            }/>
                                            :null}
                                    </g>
                                </g>


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


class ImageContainer extends React.Component{
    constructor(props){
        super(props)
    }
    componentDidMount(){

    }
    componentWillReceiveProps(nextProps){
    }
    render(){
        return(
            ReactDOM.createPortal(
                this.props.images(),
                this.props.container
            )
        )


    }
}



const Preview = connect(
    mapStateToProps,
    null,
)(PreviewRepresentation)

export default Preview
