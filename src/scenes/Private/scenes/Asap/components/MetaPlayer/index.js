import React from 'react'
import ReactDOM from 'react-dom'
import {TEMPLATE} from '../../config/types'
import Composition from '../../../../../../components/Composition'
import Button from '../../../../../../components/Button'
import parseBar from 'd3-reusable/src/parser/bar-parser'
import BarFactory from "d3-reusable/src/factory/bar-factory"
import LargeDataLineFactory from "../../../../../../components/project-md/src/factory/large-line-factory"
import {Button as SemanticButton, Icon} from 'semantic-ui-react'
import styled from 'styled-components'
import numeral from 'numeral'
import * as _ from "lodash";
import {getFactory} from '../../config/common'
import Player from '../Player'



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
        }
        this.play = this.play.bind(this)
        this.handleError = this.handleError.bind(this)
        this.handleSuccess = this.handleSuccess.bind(this)
    }
    handleError(){
        this.setState({played:false, error:true})
    }
    handleSuccess(mask){
        this.props.saveMask(mask)
    }
    play(){
        this.setState({played:true, error:false})
    }
    componentWillReceiveProps(nextProps){
        this.setState({played:false, error: false})
    }
    shouldComponentUpdate(np, ns){
        if(_.isEqual(np, this.props) && _.isEqual(ns, this.state)){
            return false
        }
        return true
    }
    render(){
        const {
            data,
            comments,
            emphasisTarget,
            templateType,
            template,
            meta,
        } = this.props
        return (
            <Player {...{data,
                comments,
                emphasisTarget,
                templateType,
                template,
                meta}}
                width={328}
                onError={this.handleError}
                onSuccess={this.handleSuccess}
            >
                {
                <PlayerController played={this.state.played} error={this.state.error}>
                    {this.state.error ?  '표현할 수 없는 데이터입니다' : ''}
                </PlayerController>
                }
            </Player>

        )
    }
}

export default MetaPlayer