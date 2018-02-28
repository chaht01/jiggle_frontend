import React from 'react'
import ReactDOM from 'react-dom'
import Button from '../../../../../../components/Button'
import FullPage from '../../../../../../components/Layout/FullPage'
import Composition from '../../../../../../components/Composition'
import PaddedContainer from '../PaddedContainer'
import SectionFooter from '../SectionFooter'
import {Popup} from 'semantic-ui-react'
import styled, {keyframes} from 'styled-components'
import Resizeable from '../../../../components/Resizeable'
import Workspace from '../Workspace'

import connect from "react-redux/es/connect/connect";
import * as numeral from "numeral";
import {appearancePlayerSet, updatePlayers} from "../../sagas/actions";



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

const PreviewOpts = styled.div`
    width: ${props => props.width};
    text-align: center;
    padding: 1rem 0;
`
const ResizeHandleSVG = styled.svg`
    position: absolute;
    left: 0;
    top:0;
    z-index: ${props => props.active ? '1': 'auto'}
`

const RelativeWorkspace = styled(Workspace)`
    position: relative;
    width: 100%;
    height: 100%;
`

const spinAni = keyframes`
    0%, 100% { 
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
`

const Spinner = styled.div`
    cursor: pointer;
    width: 40px;
    height: 40px;
    position: relative;
    margin: 0 auto;
    &:before, &:after{
        display:block;
        content:'';
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #FB4C1E;
        opacity: 0.6;
        position: absolute;
        top: 0;
        left: 0;
        animation: ${spinAni} 2.0s infinite ease-in-out;
    }
    &:after{
        animation-delay: -1.0s;
    }
`

const Progress = styled.div`
        display:block;
        width: 100%;
        transform: translateX(${props => -100+props.progress}%);
        top: 0;
        height: 2px;
        position: absolute;
        background: #F74E2C;
        transition: all .2s;
        left: 0;
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
const mapDispatchToProps = (dispatch) => {
    return {
        setAppearancePlayerNode: (node) => dispatch(appearancePlayerSet(node)),
        updatePlayers: () => dispatch(updatePlayers())
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
            transitionPlay: false,
            renderProgress: 0
        }
        this.renderGIF = this.renderGIF.bind(this)
        this.focusImage = this.focusImage.bind(this)
        this.setAnchorIdx = this.setAnchorIdx.bind(this)
        this.updateTransformer = this.updateTransformer.bind(this)
        this.deleteImage = this.deleteImage.bind(this)
        this.play = this.play.bind(this)
        this.stop = this.stop.bind(this)
    }
    renderGIF(){
        if(this.renderNode!==null){
            this.renderNode.getWrappedInstance().renderGIF(1080, (progress)=>{
                console.log(progress)
                this.setState({renderProgress: progress*100})
            })
        }
    }
    setAnchorIdx(idx, cb){
        this.setState({
            anchorIdx: idx
        }, cb)
    }
    focusImage(idx, cb){
        this.props.updatePlayers()
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

    play(){
        this.setState({transitionPlay: true}, () => this.renderNode.getWrappedInstance().draw())
    }
    stop(){
        this.setState({transitionPlay: false}, () => this.renderNode.getWrappedInstance().draw())
    }

    componentDidMount(){
        this.props.setAppearancePlayerNode(this.renderNode.getWrappedInstance())
        this.renderNode.getWrappedInstance().draw()
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
                                    transitionActive={this.state.transitionPlay}
                                />
                                <ResizeHandleSVG active={this.state.focusedIdx>-1}
                                                 innerRef={node => this.node = node}
                                                 width={this.state.width}
                                                 height={this.state.width*9/16}
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
                                                            scale={1}
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
                            <PreviewOpts>
                                {this.state.transitionPlay ?
                                    <Popup
                                        style={{
                                            opacity: 0.7,
                                            borderRadius: '2px',
                                            padding: '.8rem'
                                        }}
                                        trigger={<Spinner onClick={()=>this.stop()}/>}
                                        content={'정지 화면으로 보려면 클릭'}
                                        position='top center'
                                    />

                                    :
                                    <Button compact size='small' rounded style={{width: '6rem'}} inverted theme={{fg:'#FA4D1E', bg:'#FA4D1E'}}
                                            onClick={()=>this.play()}
                                    > 재생 </Button>
                                }
                            </PreviewOpts>
                        </PreviewContainer>
                    </FullPage>
                </PaddedContainer>
                <SectionFooter>
                    <Progress progress={this.state.renderProgress}/>
                    <Button compact size='small' theme={{fg:'#fff', bg:'#FA4D1E'}} style={{width: '8rem'}} onClick={this.renderGIF}>
                        저장하기
                    </Button>
                </SectionFooter>
            </React.Fragment>
        )
    }
}

const PreviewPlayer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PreviewPlayerRepresentation)

export default PreviewPlayer
