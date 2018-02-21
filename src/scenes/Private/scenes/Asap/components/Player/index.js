import React from 'react'
import ReactDOM from 'react-dom'
import {TEMPLATE} from '../../config/types'
import Composition from '../../../../../../components/Composition'
import Button from '../../../../../../components/Button'
import parseBar from 'd3-reusable/src/parser/bar-parser'
import {lineParser} from 'd3-reusable/src/parser/line-parser'
import BarFactory from "d3-reusable/src/factory/bar-factory"
import LargeDataLineFactory from "../../../../../../components/project-md/src/factory/large-line-factory"
import {Button as SemanticButton, Icon} from 'semantic-ui-react'
import styled from 'styled-components'
import numeral from 'numeral'
import * as _ from "lodash";
const PreRenderComposition = styled(Composition)`
position:fixed;
left:0;
top:0;
width: 1080px;
height: 600px;
    background: #17181C;
`
const PreRendered = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index:3;
    &:hover{
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
    opacity: ${props => props.played ? 0 :1};
    transition: all .2s;
    &:hover{
        opacity: ${props => props.played ? 0.8 :1};
    }
    color: ${props => props.error ? '#fff': '#000'};
    background: ${props => props.error ? 'rgba(0,0,0,0.6)' : 'transparent'};
`

const getSettings = (type) => {
    switch (type){
        case TEMPLATE.BAR_EMPHASIS:
            return
    }
}

const defaultSettings = (width, mask, meta) => {
    const {title, subtitle, reference, madeBy} = meta
    return _.cloneDeep({
        type: "vertical",
        rawData: mask,
        duration: 1500,
        width_svg: width,
        height_svg: width*9/16,
        title,
        subtitle,
        reference,
        madeBy
    })
}

class Player extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            played: false,
            error: false,
            width: 1080
        }
        this.play = this.play.bind(this)
    }
    handleError(){
        this.setState({played:false, error:true})
    }
    play(recentProps){
        this.setState({played:true, error:false}, ()=>{
            let isValid = true
            const props = recentProps || this.props
            const getMask = this.props.getMask
            try{
                const mask = getMask()

                for(let i=0; i<mask.length; i++){
                    if(mask[i].length == 0){
                        isValid = false
                        break;
                    }
                }
                console.log(mask)
                if(isValid){
                    const width = this.state.width|| numeral(getComputedStyle(ReactDOM.findDOMNode(this.renderNode)).width).value()
                    const meta = this.props.meta
                    let settings = []
                    if(this.props.type == TEMPLATE.BAR_EMPHASIS){
                        settings = [defaultSettings(width, mask[0], meta), defaultSettings(width, mask[1], meta)]
                    }else if(this.props.type == TEMPLATE.LINE){
                        settings = []
                        mask.map(m => {
                            const settingsForLine = Object.assign({}, defaultSettings(width, m, meta))
                            settings.push(settingsForLine)
                        })
                    }


                    this.charts = settings.map((setting) => {
                        return Object.assign({}, this.props.template, setting)
                    })
                    console.log(this.charts)
                    if(this.props.type == TEMPLATE.BAR_EMPHASIS) {
                        this.charts.forEach(chart => parseBar(chart));
                        this.factory = new BarFactory();
                    }else if(this.props.type == TEMPLATE.LINE){
                        // this.charts = lineParser(this.charts)
                        this.charts = this.charts.map(chart => {
                            chart.graph_colors = ['blue', 'red', 'blue', 'red', 'blue', 'red']
                            return chart
                        })
                        this.factory = new LargeDataLineFactory();
                    }


                    const renderTransition = this.factory.renderTransition()
                    renderTransition(this.renderNode, this.charts)
                    this.props.saveMask(mask)
                    // const renderStatic = this.factory.renderChart()
                    // const gParent =renderStatic(this.renderNode, this.charts[1])
                    // this.gChildren = this.factory.getChildG(gParent)
                    // this.gChildren['graph'].style.cssText = "user-select:none; pointer-events:none;"
                }else{
                    this.handleError()
                }
            }catch (err){
                console.error('Cannot render preview')
                console.error(err.stack)
                this.handleError()
            }
        })
    }
    componentWillReceiveProps(nextProps){
        this.setState({played:false, error: false})
    }
    render(){
        return (
            <PreRenderComposition>
                <PreRendered>
                    <svg width={this.state.width} height={this.state.width*9/16} ref={node => this.renderNode = node}>

                    </svg>

                </PreRendered>
                <PlayerController played={this.state.played} error={this.state.error}>
                    {this.state.error ?  '표현할 수 없는 데이터입니다' : ''}
                    {this.state.error ? null :
                        <Button rounded inverted icon size="small" onClick={this.play} compact theme={{fg:'#FA4D1E', bg:'#FA4D1E'}}>
                            {this.state.played ? <Icon name='repeat'/> : <Icon name='play'/>}
                        </Button>
                    }

                </PlayerController>

            </PreRenderComposition>
        )
    }
}

export default Player