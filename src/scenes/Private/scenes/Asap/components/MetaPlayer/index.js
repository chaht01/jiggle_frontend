import React from 'react'
import Composition from '../../../../../../components/Composition'
import Button from '../../../../../../components/Button'
import {Button as SemanticButton, Icon} from 'semantic-ui-react'
import styled from 'styled-components'
import {getFactory, getDefaultSwatch, colorToPalette} from '../../config/common'
import factory from '../../config/factory'



const PreRenderComposition = styled(Composition)`
    background: #17181C;
`
const PreRendered = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index:3;
`
const PreRenderedSvg = styled.svg`
    overflow: visible;
    transform: scale(${props => props.container/props.width});
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

class MetaPlayer extends React.Component{
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
    play(){
        this.setState({played:true, error:false}, ()=>{
            let isValid = true
            try {
                const {
                    data,
                    comments: rawComment,
                    emphasisTarget,
                    templateType,
                    template:templateConfig,
                    meta,
                } = this.props
                const chartMaterials = factory.mask(data, rawComment, emphasisTarget)[templateType]()
                const {mask, comments, breakPoint} = chartMaterials
                for (let i = 0; i < mask.length; i++) {
                    if (mask[i].length == 0) {
                        isValid = false
                        break;
                    }
                }
                if (isValid) {
                    const width = this.state.width
                    const color = this.props.color || colorToPalette(getDefaultSwatch(templateType), templateType, mask)
                    const {charts, factory} = getFactory(templateType, mask, meta, templateConfig, width, color, comments, breakPoint)
                    const renderTransition = factory.renderTransition()
                    renderTransition(this.renderNode, charts)
                    this.props.saveMask(chartMaterials)
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
                    <svg style={{transform:`scale(${328/this.state.width})`, overflow:'visible', fill:'#fff'}} width={this.state.width} height={this.state.width*9/16} ref={node => this.renderNode = node}>
                    </svg>
                </PreRendered>
                <PlayerController played={this.state.played} error={this.state.error}>
                    {this.state.error ?  '표현할 수 없는 데이터입니다' : ''}
                    {this.state.error ? null :
                        <Button rounded inverted icon size="massive" onClick={this.play} compact theme={{fg:'#FA4D1E', bg:'transparent'}}>
                            {this.state.played ? <Icon name='repeat'/> : <Icon name='play'/>}
                        </Button>
                    }

                </PlayerController>

            </PreRenderComposition>
        )
    }
}

export default MetaPlayer


