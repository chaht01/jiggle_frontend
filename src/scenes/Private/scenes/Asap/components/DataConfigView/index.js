import React from 'react'


/* COMPONENT */
import { Segment, Form } from 'semantic-ui-react'
import Sheet from '../../../../components/Sheet'
import FullPage from '../../../../../../components/Layout/FullPage'
import Input from '../../../../../../components/Input'
import PaddedContainer from '../PaddedContainer'

/* ACTION */
import { saveData, saveMeta } from '../../sagas/actions'

/* STYLE */
import styled from 'styled-components'
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

const mapStateToDispatch = (state, ownProps) => {
    return {
        data: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.data,
        meta: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.meta,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveData: (data) => dispatch(saveData(data)),
        saveMeta: (e, key) => {
            let obj = {}
            obj[key] = e.target.value
            return dispatch(saveMeta(obj))
        }
    }
}

class DataConfigViewRepresentation extends React.Component{
    constructor(props){
        super(props)
    }
    render(){
        const {saveData, meta} = this.props
        return (
            <PaddedContainer>
                <FullPage>
                    <Sheet width={800} height={500} saveData={saveData}/>
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
                </FullPage>
            </PaddedContainer>


        )
    }
}

const DataConfigView = connect(
    mapStateToDispatch,
    mapDispatchToProps
)(DataConfigViewRepresentation)

export default DataConfigView
