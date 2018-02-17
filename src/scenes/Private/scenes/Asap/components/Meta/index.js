import React from 'react'

/* COMPONENT */
import Input from '../../../../../../components/Input'
import Button from '../../../../../../components/Button'
import {Form, Grid} from 'semantic-ui-react'

/* STYLE */
import styled from 'styled-components'

/* UTILS */
import { saveMeta } from '../../sagas/actions'
import connect from "react-redux/es/connect/connect";


const ConfigPanel = styled.div`
    position: absolute;
    left: auto;
    right: 0;
    top: 0;
    width: 360px;
    padding-bottom: 1rem;
    background: #2b2d2f;
    -webkit-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    -moz-box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    box-shadow: 0px 9px 13px -5px rgba(0,0,0,0.33);
    z-index: 1000;
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


const MetaRepresentation = ({meta, saveMeta}) => {
    return(
        <ConfigPanel>
            <Form>
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
            </Form>
            <Grid centered>
                <Grid.Row>
                    <Button compact theme={{fg:'#fff', bg:'#FA4D1E'}}>프리뷰 확인</Button>
                </Grid.Row>
            </Grid>
        </ConfigPanel>
    )
}

const Meta = connect(
    mapStateToProps,
    mapDispatchToProps
)(MetaRepresentation)


export default Meta
