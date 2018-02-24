import React from 'react'
import ReactDOM from 'react-dom'
import Button from '../../../../../../components/Button'
import FullPage from '../../../../../../components/Layout/FullPage'
import Composition from '../../../../../../components/Composition'
import PaddedContainer from '../PaddedContainer'
import SectionFooter from '../SectionFooter'

import styled from 'styled-components'
import parseBar from 'd3-reusable/src/parser/bar-parser'
import BarFactory from "d3-reusable/src/factory/bar-factory";
import {getChildG} from 'd3-reusable/src/common/utils'
import Resizeable from '../../../../components/Resizeable'
import Workspace from '../Workspace'

import connect from "react-redux/es/connect/connect";
import * as numeral from "numeral";
import {getFactory, colorsByType, getDefaultSwatch} from "../../config/common";
import * as d3 from 'd3'
import * as _ from "lodash";



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
    width: ${props => props.originWidth}px;
    height: ${props => props.originWidth*9/16}px;
    transform: scale(${props => props.renderWidth/props.originWidth});
    transform-origin: 0 0;
    z-index: ${props => props.active ? '1': 'auto'}
`

const RelativeWorkspace = styled(Workspace)`
    position: relative;
    width: 100%;
    height: 100%;
`

const mapStateToProps = (state, ownProps) => {
    return {
        mask: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.safeMask,
        meta: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.meta,
        templateType: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type,
        template: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config,
        color: state.PrivateReducer.AsapReducer.procedureManager.appearance.color,
        theme: state.PrivateReducer.AsapReducer.procedureManager.appearance.theme
    }
}

class PreviewPlayerRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            width: 0,
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
    }
    renderGIF(){
        if(this.renderNode!==null){
            this.renderNode.getWrappedInstance().renderGIF()
            // this.renderNode.renderGIF()
        }
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

    componentDidMount(){
        this.setState({width: numeral(getComputedStyle(ReactDOM.findDOMNode(this.renderNode)).width).value()})
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
            <React.Fragment>
                <PaddedContainer>
                    <FullPage>
                        <PreviewContainer>
                            <PreviewThumbnails>
                                <RelativeWorkspace
                                    innerRef={node => this.renderNode = node}
                                    width={this.state.width}
                                    images={this.state.images}
                                    imageVisible={this.state.focusedIdx==-1}
                                    transitionActive={false}
                                />
                                <ResizeHandleSVG active={this.state.focusedIdx>-1}
                                                 innerRef={node => this.node = node}
                                                 originWidth={1080}
                                                 renderWidth={this.state.width}
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
                                                            visible={this.state.focusedIdx!=-1}
                                                            scale={this.state.width/1080}
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
                            </PreviewThumbnails>
                        </PreviewContainer>
                    </FullPage>
                </PaddedContainer>
                <SectionFooter>
                    <Button compact size='small' theme={{fg:'#fff', bg:'#FA4D1E'}} style={{width: '7.5rem'}} onClick={this.renderGIF}>저장하기</Button>
                </SectionFooter>
            </React.Fragment>
        )
    }
}

const PreviewPlayer = connect(
    mapStateToProps,
    null,
)(PreviewPlayerRepresentation)

export default PreviewPlayer
