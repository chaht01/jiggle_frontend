import React from 'react'
import {Loader} from 'semantic-ui-react'
import Composition from '../../../../../../components/Composition'
import styled from 'styled-components'
import {getFactory} from "../../config/common";
import factory from '../../config/factory'

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
    color: ${props => props.loading ? '#fff': '#000'};
    background: ${props => props.loading ? 'rgba(0,0,0,0.6)' : 'transparent'};
`


export default class Player extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            originWidth: 1080,
            tid: -1
        }
        this.drawChart = this.drawChart.bind(this)
    }

    drawChart(recentProps){
        let isValid = true
        const props = recentProps || this.props
        const {
            onSuccess,
            onError
        } = props
        try {
            const {
                data,
                comments: rawComment,
                emphasisTarget,
                templateType,
                template:templateConfig,
                meta,
            } = props
            const chartMaterials = factory.mask(data, rawComment, emphasisTarget)[templateType]()
            const {mask, comments, breakPoint} = chartMaterials
            for (let i = 0; i < mask.length; i++) {
                if (mask[i].length == 0) {
                    isValid = false
                    break;
                }
            }
            if (isValid) {
                const width = this.state.originWidth
                const {charts, factory} = getFactory(templateType, mask, meta, templateConfig, width, comments)

                const renderTransition = factory.renderTransition()
                renderTransition(this.renderNode, charts)
                if(typeof onSuccess ==='function')
                    onSuccess(chartMaterials)
            }else{
                if(typeof onError ==='function')
                    onError()
            }
        }catch (err){
            console.error('Cannot render preview')
            console.error(err.stack)
            if(typeof onError ==='function')
                onError()
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.state.tid > -1) {
            clearTimeout(this.state.tid)
        }
        this.setState({tid:setTimeout(()=>{
            this.drawChart(nextProps)
            this.setState({tid:-1})
        },1000)})
    }

    render(){
        const {width, children} = this.props
        return(
            <RenderComposition>
                <RenderSVG
                    renderWidth={width}
                    originWidth={this.state.originWidth}
                    innerRef={node => this.renderNode = node}
                />
                <PlayerController loading={this.state.tid!=-1}>
                    {this.state.tid!=-1 && <Loader active inline />}
                </PlayerController>
                {children}
            </RenderComposition>
        )

    }
}