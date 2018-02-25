import React from 'react'
import ReactDOM from 'react-dom'
import {Loader} from 'semantic-ui-react'
import Composition from '../../../../../../components/Composition'
import styled from 'styled-components'
import {getFactory, colorToPalette} from "../../config/common";
import factory from '../../config/factory'
import {getDefaultSwatch} from '../../config/common'
import connect from "react-redux/es/connect/connect";
import * as _ from "lodash";
import download from 'downloadjs'
import {TEMPLATE} from "../../config/types";

const RenderComposition = styled(Composition)`
    background: ${props=> props.background || '#fff'};
`
const RenderSVG = styled.svg`
    transform: scale(${props => props.renderWidth/props.originWidth});
    transform-origin: 0 0;
    overflow: visible !important;
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
    console.log(ownProps)
    return {
        templateType: ownProps.templateType || state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type,
        dirtyDataLoading: ownProps.dirtyDataLoading || state.PrivateReducer.AsapReducer.procedureManager.dirtyData.loading,
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
            msg: ''
        }
        this.drawChart = this.drawChart.bind(this)
        this.renderGIF = this.renderGIF.bind(this)
        this.handleError = this.handleError.bind(this)
        console.log(this.props)
    }

    handleError(msg){
        this.setState({error: true, msg})
    }

    renderGIF(){
        if(this.charts && this.charts.length!=0 && this.factory){
            const onProcess = (progress) => {
                console.log(progress)
            };
            const onFinished = (blob) => {
                download(blob, `chart.gif`, 'image/gif')
            };

            this.factory.recordTransition(
                this.renderNode,
                this.charts,
                onProcess,
                onFinished,
                this.imageSerializer(this.props.images)
            )
        }

    }

    drawChart(recentProps){
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
                const color = recentProps.color || colorToPalette(getDefaultSwatch(templateType), templateType, masks)
                const {charts, factory} = getFactory(templateType, masks, meta, templateConfig, width, color, theme, comments, breakPoint)

                this.charts = charts
                this.factory = factory

                if(transitionActive){
                    const renderTransition = factory.renderTransition()
                    renderTransition(this.renderNode, charts)
                }else{
                    const renderChart = factory.renderChart()
                    if(imageVisible){
                        let chartArgs
                        if([TEMPLATE.LINE, TEMPLATE.LINE_DENSE].indexOf(templateType)>-1){
                            chartArgs = [charts[charts.length-1]]
                        }else{
                            chartArgs = charts[charts.length-1]
                        }
                        const gParent = renderChart(this.renderNode, chartArgs, this.imageSerializer(images))

                    }else{
                        let chartArgs
                        if([TEMPLATE.LINE, TEMPLATE.LINE_DENSE].indexOf(templateType)>-1){
                            chartArgs = [charts[charts.length-1]]
                        }else{
                            chartArgs = charts[charts.length-1]
                        }
                        const gParent = renderChart(this.renderNode, chartArgs)
                    }
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
                mimeType: href.slice(href.indexOf(':')+1,href.indexOf(';')),
                base64: href.slice(href.indexOf(',')+1)
            })
        })
    }

    componentDidMount(){
        this.drawChart(this.props)
    }

    componentWillReceiveProps(nextProps){
        if(!_.isEqual(nextProps, this.props) && !nextProps.dirtyDataLoading){
            // ReactDOM.unmountComponentAtNode(this.renderNode)
            this.drawChart(nextProps)
        }
    }
    render(){
        const {width, background, errorVisible} = this.props
        return(
            <RenderComposition background={background}>
                <RenderSVG
                    renderWidth={width}
                    originWidth={1080}
                    innerRef={node => this.renderNode = node}
                />
                {errorVisible &&
                <PlayerController error={this.state.error}>
                    {this.state.error ? this.state.msg : ''}
                </PlayerController>
                }

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