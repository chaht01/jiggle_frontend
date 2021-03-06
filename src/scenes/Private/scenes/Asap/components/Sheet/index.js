import React from 'react'

/* COMPONENTS */
import Handson from '../../../../../../components/Handson'
import FullPage from '../../../../../../components/Layout/FullPage'
import ModalHandler from '../ModalHandler'

import styled from 'styled-components'
import './style.css'
import _ from 'lodash'
import connect from 'react-redux/es/connect/connect'
import {defaultDummyData, getRangeOfValidData, saveData, emphasizeTarget, saveComment, getValidDataWithinRange, dataModalOpen} from '../../sagas/actions'
import factory from '../../config/factory'
import {TEMPLATE} from "../../config/types";

const SheetContainer = styled.div`
            position: relative;
            width: calc(${props => props.width}px);
            background: #fff;
        `

const mapStateToProps = (state, ownProps) => {
    return {
        templateType: state.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type,
        emphasisTarget: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget,
        comments: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        saveData: (data) => dispatch(saveData(data)),
        emphasizeTarget: (x, y) => dispatch(emphasizeTarget(x, y)),
        saveComment: (comments) => dispatch(saveComment(comments)),
        modalOpen: (bool, payload) => dispatch(dataModalOpen(bool, payload))
    }
}
class SheetRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: _.cloneDeep(defaultDummyData),
        }
        this.refNode = null
        this.saveData = this.saveData.bind(this)
        this.getInstance = this.getInstance.bind(this)
    }
    getInstance(){
        if(this.refNode===null){
            return null
        }
        return this.refNode.getInstance()
    }
    saveData(){
        const {data} = this.state
        const dataToSave = JSON.parse(JSON.stringify(data))
        this.props.saveData(dataToSave)
    }
    render(){
        const {width, height, comments} = this.props
        const sheetConfig = factory.sheet(this.state.data)[this.props.templateType](this)
        const ReqModal = factory.modal[this.props.templateType]

        return (
            <React.Fragment>
                <SheetContainer width={width}>
                    <Handson
                        ref={node => this.refNode = node}
                        settings={{
                            data: this.state.data,
                            onAfterChange:(changes, source) => {
                                if(source !== 'loadData'){
                                    this.saveData()
                                }
                            },
                            onAfterUndo: this.saveData,
                            onAfterCreateRow:this.saveData,
                            onAfterCreateCol:this.saveData,
                            onAfterRemoveCol:this.saveData,
                            onAfterRemoveRow:this.saveData,
                            colHeaders:true,
                            rowHeaders:true,
                            width:width,
                            height:height,
                            colWidths:80,
                            rowHeights:23,
                            ...sheetConfig
                        }}
                    />
                </SheetContainer>
                {ReqModal ?
                    <ModalHandler reqModal={ReqModal}/>
                    : null
                }
            </React.Fragment>
        )
    }
}

const Sheet = connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        areStatesEqual: (next,prev) => {
            return (
                next.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type === prev.PrivateReducer.AsapReducer.procedureManager.selectedTemplate.config.type
                && next.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget === prev.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget
                && _.isEqual(next.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments, prev.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments)
            )
        },
        withRef: true
    }
)(SheetRepresentation)
export default Sheet
