import React from 'react'
import ReactDOM from 'react-dom'
import {Dimmer} from 'semantic-ui-react'
import Composition from '../../../../../../components/Composition'
import styled from 'styled-components'
import {getFactory, colorToPalette} from "../../config/common";
import factory from '../../config/factory'
import {getDefaultSwatch} from '../../config/common'
import connect from "react-redux/es/connect/connect";
import * as _ from "lodash";
import download from 'downloadjs'
import {TEMPLATE} from "../../config/types";
import * as numeral from "numeral";

const RenderComposition = styled(Composition)`
    background: ${props=> props.background || '#fff'};
`
const RenderSVG = styled.svg`
    transform: scale(${props => props.renderWidth/props.originWidth});
    transform-origin: 0 0;
    fill: #fff;
    width: ${props => props.originWidth}px;
    height: ${props => props.originWidth*9/16}px;
`

const PlayerController = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    transition: all .2s;
    color: ${props => props.error ? '#fff': '#000'};
    background: ${props => props.error ? 'rgba(0,0,0,0.6)' : 'transparent'};
`

const mapStateToProps = (state, ownProps) => {
    return {
        templateType: ownProps.templateType || state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type,
        templateConfig: ownProps.templateConfig || state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config,
        safeMask: ownProps.safeMask || state.PrivateReducer.AsapReducer.procedureManager.dirtyData.safeMask,
        meta: ownProps.meta || state.PrivateReducer.AsapReducer.procedureManager.dirtyData.meta,
        color: ownProps.color || state.PrivateReducer.AsapReducer.procedureManager.appearance.color,
        theme: ownProps.theme || state.PrivateReducer.AsapReducer.procedureManager.appearance.theme,
    }
}



class WorkspaceRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            error: false,
            msg: '',
            renderBlock: false
        }
        this.setupChart = this.setupChart.bind(this)
        this.renderGIF = this.renderGIF.bind(this)
        this.handleError = this.handleError.bind(this)
        this.getSVGNode = this.getSVGNode.bind(this)
        this.draw = this.draw.bind(this)
    }

    handleError(msg){
        this.setState({error: true, msg})
    }
    getSVGNode(){
        return this.renderNode
    }
    draw(recentProps){
        try{
            if(this.state.renderBlock){
                return
            }
            const props = recentProps || this.props
            const {transitionActive, templateType, imageVisible, images=[]} = props

            if(this.charts && this.charts.length!=0 && this.factory){
                if(transitionActive && this.charts.length>1){ // TODO: this.charts length should be prepared as more than 1
                    const renderTransition = this.factory.renderTransition()
                    if(imageVisible) {
                        renderTransition(this.renderNode, this.charts, this.imageSerializer(images))
                    }else {
                        renderTransition(this.renderNode, this.charts)
                    }
                }else{
                    const renderChart = this.factory.renderChart()
                    if(imageVisible){
                        let chartArgs
                        if([TEMPLATE.LINE, TEMPLATE.LINE_DENSE].indexOf(templateType)>-1){
                            chartArgs = [this.charts[this.charts.length-1]]
                        }else{
                            chartArgs = this.charts[this.charts.length-1]
                        }
                        const gParent = renderChart(this.renderNode, chartArgs, this.imageSerializer(images))

                    }else{
                        let chartArgs
                        if([TEMPLATE.LINE, TEMPLATE.LINE_DENSE].indexOf(templateType)>-1){
                            chartArgs = [this.charts[this.charts.length-1]]
                        }else{
                            chartArgs = this.charts[this.charts.length-1]
                        }
                        const gParent = renderChart(this.renderNode, chartArgs)
                    }
                }
            }
        }catch(err){
            console.error('Cannot execute workspace method: draw()')
            console.error(err.stack)
        }

    }
    renderGIF(width, onProgress){
        if(this.charts && this.charts.length!=0 && this.factory){
            this.setState({renderBlock: true, GIFWidth: width}, () => {
                const onProcess = (progress) => {
                    if(this.state.renderBlock){
                        this.setState({renderBlock: false})
                    }
                    if(typeof onProgress === 'function'){
                        onProgress(progress)
                    }
                };
                const onFinished = (blob) => {
                    onProgress(0)
                    download(blob, `chart.gif`, 'image/gif')
                };
                const factoryCopied = _.cloneDeep(this.factory)
                const chartsCopied = _.cloneDeep(this.charts)
                const imagesCopied = _.cloneDeep(this.props.images)
                factoryCopied.recordTransition(
                    this.GIFNode,
                    chartsCopied,
                    onProcess,
                    onFinished,
                    this.imageSerializer(imagesCopied)
                )
            })
        }

    }

    setupChart(recentProps){
        let isValid = true
        try {
            this.setState({error:null, msg:''})
            if(recentProps.safeMask === null){ // not ready
                this.handleError('데이터가 부족합니다')
                return
            }
            const {mask:masks, comments, breakPoint = [-1,-1,-1,-1]} = recentProps.safeMask
            const {
                templateType,
                templateConfig,
                meta,
                theme,
            } = recentProps // received from redux

            const {
                images,
                imageVisible,
                transitionActive,
            } = recentProps // received from parent component
            for (let i = 0; i < masks.length; i++) {
                for(let j=0; j<masks[i].length; j++){
                    if (masks[i][j].length == 0) {
                        isValid = false
                        break;
                    }
                }
                if(!isValid)
                    break
            }
            if (isValid) {
                const width = 1080
                const defaultColor = colorToPalette(getDefaultSwatch(templateType), templateType, masks)
                const color = (this.props.templateType == templateType) ? (recentProps.color || defaultColor) : defaultColor
                const {charts, factory} = getFactory(templateType, masks, meta, templateConfig, width, color, theme, comments, breakPoint)

                this.charts = charts
                this.factory = factory
                if(recentProps.autoPlay){
                    this.draw(recentProps)
                }
            }else{
                throw (new Error('데이터가 유효하지 않습니다'))
            }
        }catch (err){
            console.error('Cannot render workspace')
            console.error(err.stack)
            this.handleError('데이터가 유효하지 않습니다')
        }
    }

    imageSerializer(images){
        return images.map((image)=>{
            const href = image.href
            return Object.assign({}, image, {
                x: image.x*1080/this.props.width,
                y: image.y*1080/this.props.width,
                width: image.width*1080/this.props.width,
                height: image.height*1080/this.props.width,
                mimeType: href.slice(href.indexOf(':')+1,href.indexOf(';')),
                base64: href.slice(href.indexOf(',')+1)
            })
        })
    }

    componentDidMount(){
        this.setupChart(this.props)
    }

    componentWillReceiveProps(nextProps){
        if(!_.isEqual(nextProps, this.props)){
            this.setupChart(nextProps)
        }
    }
    render(){
        const {width, background, errorVisible} = this.props
        let height = typeof width ==="string" ? (width.endsWith('%') ? '100%' :  numeral(width)*9/16) : width*9/16
        return(
            <RenderComposition background={background}>
                <svg
                    ref={node => this.renderNode = node}
                    width = {width}
                    height={height}
                />
                {errorVisible &&
                <PlayerController error={this.state.error}>
                    {this.state.error ? this.state.msg : ''}
                </PlayerController>
                }
                <Dimmer
                    active={this.state.renderBlock}
                >
                    <svg
                        ref={node => this.GIFNode = node}
                        width={numeral(this.state.GIFWidth).value()}
                        height={numeral(this.state.GIFWidth).value()*9/16}
                    />
                </Dimmer>
            </RenderComposition>
        )

    }
}

const Workspace = connect(
    mapStateToProps,
    null,
    null,
    { withRef: true }
)(WorkspaceRepresentation)

export default Workspace