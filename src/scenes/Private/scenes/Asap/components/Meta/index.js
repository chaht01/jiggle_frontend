import React from 'react'

/* COMPONENT */
import Input from '../../../../../../components/Input'
import {Form} from 'semantic-ui-react'

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
    height: 100%;
    background: #2A2E2F;
`

const ConfigField = styled(Form.Field)`
    display: grid;
    grid-template-columns: 4.5rem 1fr;
    grid-row-gap: 1rem;
    padding: 1rem 1rem 1rem 2rem !important;
    border-bottom: 1px solid #333738 !important;
    margin-bottom: 0 !important;
    color: #65696A;
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
        </ConfigPanel>
    )
}

const Meta = connect(
    mapStateToProps,
    mapDispatchToProps
)(MetaRepresentation)


export default Meta
