import React from 'react'

/* COMPONENTS */
import Handson from '../../../../../../components/Handson'
import FullPage from '../../../../../../components/Layout/FullPage'

import styled from 'styled-components'
import './style.css'
import _ from 'lodash'
import connect from 'react-redux/es/connect/connect'
import {defaultDummyData, getRangeOfValidData, saveData, emphasizeTarget, saveComment, getValidDataWithinRange} from '../../sagas/actions'
import config from './config'
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

    }
}
class SheetRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: defaultDummyData,
            labelModal: null,
            open: false
        }
        this.modalRef = null
        this.saveData = this.saveData.bind(this)
        this.saveLabel = this.saveLabel.bind(this)
        this.setLabelModal = this.setLabelModal.bind(this)
    }
    saveLabel(comments){
        this.props.saveComment(comments)
    }
    setLabelModal(ref){
        this.setState({labelModal: ref})
    }
    saveData(){
        const {data} = this.state
        const dataToSave = JSON.parse(JSON.stringify(data))
        this.props.saveData(dataToSave)
        console.log(config.mask[TEMPLATE.LINE](this)())
    }
    componentWillReceiveProps(nextProps) {
        this.setLabelModal(config.modal[this.props.templateType])
    }
    render(){
        const {width, height, comments} = this.props
        const sheetConfig = config.sheet[this.props.templateType](this)
        const ReqModal = this.state.labelModal

        return (
            <FullPage>
                <SheetContainer width={width}>
                    <Handson
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
                    <ReqModal ref={node => this.modalRef = node} saveComment={this.saveLabel} comments={comments}/>
                    : null
                }
            </FullPage>
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
        }
    }
)(SheetRepresentation)
export default Sheet
