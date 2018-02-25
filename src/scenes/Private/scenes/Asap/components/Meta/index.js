import React from 'react'
import ReactDOM from 'react-dom'

/* COMPONENT */
import Input from '../../../../../../components/Input'
import Button from '../../../../../../components/Button'
import {Form, Grid, Modal, Header, Icon, Button as SemanticButton} from 'semantic-ui-react'
import Handson from '../../../../../../components/Handson'
import Composition from '../../../../../../components/Composition'
import MetaPlayer from '../MetaPlayer'
import Workspace from '../Workspace'

/* STYLE */
import styled from 'styled-components'

/* UTILS */
import { saveMeta, dataPlayerSet, updatePlayers} from '../../sagas/actions'
import connect from "react-redux/es/connect/connect";
import {TEMPLATE} from "../../config/types";
import config from '../../config/factory'
import * as _ from "lodash";

const ConfigPanel = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    left: auto;
    right: 0;
    top: 0;
    width: 360px;
    height: 100%;
    background: #2b2d2f;
    padding-bottom: 50px;
    -webkit-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    -moz-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    z-index: 201;
`
const ConfigForm = styled(Form)`
    overflow: auto;
`
const ConfigField = styled(Form.Field)`
    display: grid;
    grid-template-columns: 4.5rem auto;
    grid-column-gap: 1rem;
    grid-row-gap: 36px;
    padding: ${props => {
        const padding = props.padding ? props.padding  : '31px'
        return padding+' 1rem '+padding+' 2rem !important;'
    }}
    border-bottom: 1px solid #333738 !important;
    margin-bottom: 0 !important;
    color: #848484;
    &:last-of-type{
        border-bottom: none !important;   
        margin-bottom: 1rem !important;
    }
`

const ConfigLabel = styled.label`
    color: #848484 !important;
    align-self: center;
    font-weight: 300 !important;
`

const PreRender = styled.div`
    padding: 1rem;
`

const mapStateToProps = (state, ownProps) => {
    return {
        meta: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.meta,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveMeta: (e, key) => {
            let obj = {}
            obj[key] = e.target.value
            return dispatch(saveMeta(obj))
        },
        setDataPlayerNode: (node) => dispatch(dataPlayerSet(node)),
        updatePlayers: () => dispatch(updatePlayers())
    }
}


class MetaRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.form = null
        this.playerNode = null
        this.preventWheel = this.preventWheel.bind(this)
        this.handleWheelEvent = this.handleWheelEvent.bind(this)
        this.saveMeta = _.throttle(this.saveMeta.bind(this), 250)
        this.updatePlayer = this.updatePlayer.bind(this)
    }
    handleWheelEvent(element, e){
        const dY = e.deltaY,
            currScrollPos = element.scrollTop,
            scrollableDist = element.scrollHeight - element.clientHeight
        if((dY>0 && currScrollPos >= scrollableDist) ||
            (dY<0 && currScrollPos <= 0)){
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        e.stopPropagation();
    }
    saveMeta(e, field){
        this.props.saveMeta(e, field)
    }
    updatePlayer(){
        this.props.updatePlayers()
    }
    preventWheel(node){
        ReactDOM.findDOMNode(node).addEventListener('wheel', this.handleWheelEvent.bind(this, ReactDOM.findDOMNode(node)), {passive: false})
    }
    componentDidMount(){
        this.props.setDataPlayerNode(this.playerNode.getWrappedInstance())
        this.preventWheel(this.form)
    }

    componentWillReceiveProps(nextProps){
        if(!_.isEqual(nextProps.meta, this.props.meta)){
            console.log(nextProps.meta)
            this.props.updatePlayers()
        }
    }

    componentDidUpdate(){
        this.props.setDataPlayerNode(this.playerNode.getWrappedInstance())
        this.preventWheel(this.form)
    }
    render(){
        const {meta} = this.props
        const {saveMeta} = this
        return(
            <ConfigPanel>
                <ConfigForm ref={node => this.form = node}>
                    <ConfigField inline padding="36px">
                        <ConfigLabel>제목</ConfigLabel>
                        <Input invert size='small' square={true} placeholder={meta.title}
                               onChange={(e) => {
                                   e.persist()
                                   saveMeta(e, 'title')
                               }}/>
                    </ConfigField>
                    <ConfigField inline>
                        <ConfigLabel>부제목</ConfigLabel>
                        <Input invert size='small' square={true} placeholder={meta.subtitle}
                               onChange={(e) => {
                                   e.persist()
                                   saveMeta(e, 'subtitle')
                               }}/>
                    </ConfigField>
                    <ConfigField inline padding="18px">
                        <ConfigLabel>단위</ConfigLabel>
                        <Input invert fluid size='small' square={true} placeholder=''
                               onChange={(e) => {
                                   e.persist()
                                   saveMeta(e, 'unit')
                               }}/>
                    </ConfigField>
                    <ConfigField inline>
                        <ConfigLabel>자료 출처</ConfigLabel>
                        <Input invert size='small' square={true} placeholder=''
                               onChange={(e) => {
                                   e.persist()
                                   saveMeta(e, 'reference')
                               }}/>
                    </ConfigField>
                    <ConfigField inline>
                        <ConfigLabel>만든이</ConfigLabel>
                        <Input invert size='small' square={true} placeholder=''
                               onChange={(e) => {
                                   e.persist()
                                   saveMeta(e, 'madeBy')
                               }}/>
                    </ConfigField>
                </ConfigForm>
                <PreRender>
                    <Workspace
                        ref={node => this.playerNode = node}
                        errorVisible={true}
                        background="#18171C"
                        width={328}
                        transitionActive={true}
                    />
                </PreRender>
            </ConfigPanel>
        )
    }
}

const Meta = connect(
    mapStateToProps,
    mapDispatchToProps
)(MetaRepresentation)


export default Meta
