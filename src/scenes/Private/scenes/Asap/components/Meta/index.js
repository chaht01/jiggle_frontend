import React from 'react'
import ReactDOM from 'react-dom'

/* COMPONENT */
import Input from '../../../../../../components/Input'
import Button from '../../../../../../components/Button'
import {Form, Grid, Modal, Header, Icon} from 'semantic-ui-react'
import Handson from '../../../../../../components/Handson'

/* STYLE */
import styled from 'styled-components'

/* UTILS */
import { saveMeta } from '../../sagas/actions'
import connect from "react-redux/es/connect/connect";


const ConfigPanel = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    left: auto;
    right: 0;
    top: 0;
    width: 360px;
    height: 100%;
    padding-bottom: 1rem;
    background: #2b2d2f;
    -webkit-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    -moz-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    z-index: 1000;
`
const ConfigForm = styled(Form)`
    overflow: auto;
`
const ConfigField = styled(Form.Field)`
    display: grid;
    grid-template-columns: 4.5rem 1fr;
    grid-row-gap: 1rem;
    padding: 1rem 1rem 1rem 2rem !important;
    border-bottom: 1px solid #333738 !important;
    margin-bottom: 0 !important;
    color: #65696A;
    &:last-of-type{
        border-bottom: none !important;   
        margin-bottom: 1rem !important;
    }
`

const ConfigLabel = styled.label`
    color: #65696A !important;
    align-self: center;
`

const mapStateToProps = (state, ownProps) => {
    return {
        meta: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.meta,
        placeholder: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.placeholder
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveMeta: (e, key) => {
            let obj = {}
            obj[key] = e.target.value
            return dispatch(saveMeta(obj))
        }
    }
}


class MetaRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.form = null
        this.preventWheel = this.preventWheel.bind(this)
        this.handleWheelEvent = this.handleWheelEvent.bind(this)
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
    preventWheel(node){
        ReactDOM.findDOMNode(node).addEventListener('wheel', this.handleWheelEvent.bind(this, ReactDOM.findDOMNode(node)), {passive: false})
    }
    componentDidMount(){
        this.preventWheel(this.form)
    }
    componentDidUpdate(){
        this.preventWheel(this.form)
    }
    render(){
        const {meta, placeholder, saveMeta} = this.props
        return(
            <ConfigPanel>
                <ConfigForm ref={node => this.form = node}>
                    <ConfigField inline>
                        <ConfigLabel>제목</ConfigLabel>
                        <Input invert square={true} placeholder={meta.title} onChange={(e) => saveMeta(e, 'title')}/>
                        <ConfigLabel>부제목</ConfigLabel>
                        <Input invert square={true} placeholder={meta.subtitle} onChange={(e) => saveMeta(e, 'subtitle')}/>
                    </ConfigField>
                    <ConfigField inline>
                        <ConfigLabel>X축</ConfigLabel>
                        <Input invert square={true} placeholder='' onChange={(e) => saveMeta(e, 'xAxis')}/>
                        <ConfigLabel>Y축</ConfigLabel>
                        <Input invert square={true} placeholder='' onChange={(e) => saveMeta(e, 'yAxis')}/>
                    </ConfigField>
                    <ConfigField inline>
                        <ConfigLabel>자료 출처</ConfigLabel>
                        <Input invert square={true} placeholder='' onChange={(e) => saveMeta(e, 'reference')}/>
                    </ConfigField>
                    <ConfigField inline>
                        <ConfigLabel>만든이</ConfigLabel>
                        <Input invert square={true} placeholder='' onChange={(e) => saveMeta(e, 'producer')}/>
                    </ConfigField>
                </ConfigForm>
                <Grid centered>
                    <Grid.Row>
                        {/**
                         * Placeholder data
                         */}
                        <Modal trigger={<Button compact theme={{fg:'#fff', bg:'#FA4D1E'}}>프리뷰 확인</Button>}
                               basic size='small'
                        >
                            <Header icon='table' content='예시 데이터' />
                            <Modal.Content>
                                <Handson settings={{
                                    data:placeholder,
                                    colHeaders:true,
                                    rowHeaders:true,
                                    width: 830,
                                    height: 400,
                                    readOnly: true,
                                    allowInsertRow: false,
                                    allowInsertColumn: false,
                                    autoInsertRow: false,
                                    cells: (row, col, prop) => {
                                        let cellProperties = {}
                                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                            const trimmed = value ? value.trim() : value
                                            if(['', undefined, null].indexOf(trimmed)==-1){
                                                td.innerText = value
                                                td.style.color = '#000'
                                            }else{
                                                td.style.background = '#f1f1f5'
                                            }
                                        }
                                        return cellProperties
                                    }
                                }}/>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}}>확인</Button>
                            </Modal.Actions>
                        </Modal>
                    </Grid.Row>
                </Grid>
            </ConfigPanel>
        )
    }
}

const Meta = connect(
    mapStateToProps,
    mapDispatchToProps
)(MetaRepresentation)


export default Meta
