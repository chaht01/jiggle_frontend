import React from 'react'
import {Loader} from 'semantic-ui-react'
import Composition from '../../../../../../components/Composition'
import styled from 'styled-components'
import {getFactory, colorToPalette} from "../../config/common";
import factory from '../../config/factory'
import {getDefaultSwatch} from '../../config/common'
import connect from "react-redux/es/connect/connect";
import * as _ from "lodash";

const RenderComposition = styled(Composition)`
    background: #fff;
`
const RenderSVG = styled.svg`
    transform: scale(${props => props.renderWidth/props.originWidth});
    transform-origin: 0 0;
    overflow: visible !important;
    fill: #fff;
    width: ${props => props.originWidth}px;
    height: ${props => props.originWidth*9/16}px;
`

const mapStateToProps = (state, ownProps) => {
    return {
        templateType: ownProps.templateType || state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type,
        templateConfig: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config,
        safeMask: ownProps.safeMask || state.PrivateReducer.AsapReducer.procedureManager.dirtyData.safeMask,
        meta: ownProps.safeMask || state.PrivateReducer.AsapReducer.procedureManager.dirtyData.meta,
        color: ownProps.color || state.PrivateReducer.AsapReducer.procedureManager.appearance.color,
        theme: ownProps.theme || state.PrivateReducer.AsapReducer.procedureManager.appearance.theme,
    }
}



export default class WorkspaceRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.drawChart = this.drawChart.bind(this)
    }

    getChild(){

    }

    drawChart(recentProps){
        let isValid = true
        try {
            const {mask, comments, breakPoint = [-1,-1,-1,-1]} = recentProps.safeMask
            const {
                templateType,
                templateConfig,
                meta,
            } = recentProps // received from redux

            const {
                images,
                imageVisible,
                transitionActive
            } = recentProps // received from parent component
            for (let i = 0; i < mask.length; i++) {
                if (mask[i].length == 0) {
                    isValid = false
                    break;
                }
            }
            if (isValid) {
                const width = 1080
                const color = this.props.color || colorToPalette(getDefaultSwatch(templateType), templateType, mask)
                const {charts, factory} = getFactory(templateType, mask, meta, templateConfig, width, color, theme, comments, breakPoint)

                if(transitionActive){
                    const renderTransition = factory.renderTransition()
                    renderTransition(this.renderNode, charts)
                }else{
                    const renderChart = factory.renderChart()
                    if(imageVisible){
                        const gParent = renderChart(this.renderNode, charts[charts.length-1], images.map((image)=>{
                            const href = image.href
                            return Object.assign({}, image, {
                                mimeType: href.slice(href.indexOf(':')+1,href.indexOf(';')),
                                base64: href.slice(href.indexOf(',')+1)
                            })
                        }))

                    }else{
                        const gParent = renderChart(this.renderNode, charts[charts.length-1])
                    }
                }

            }else{
                throw 'Invalid mask'
            }
        }catch (err){
            console.error('Cannot render workspace')
            console.error(err.stack)
        }
    }

    componentDidMount(){
        this.drawChart(this.props)
    }

    componentWillReceiveProps(nextProps){
        if(!_.isEqual(nextProps, this.props)){
            this.drawChart(nextProps)
        }
    }

    render(){
        const {width} = this.props
        return(
            <RenderComposition>
                <RenderSVG
                    renderWidth={width}
                    originWidth={this.state.originWidth}
                    innerRef={node => this.renderNode = node}
                />
            </RenderComposition>
        )

    }
}

const Workspace = connect(
    mapStateToProps,
    null
)(WorkspaceRepresentation)

export default Workspace