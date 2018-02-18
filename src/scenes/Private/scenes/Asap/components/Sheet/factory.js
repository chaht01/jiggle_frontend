import React from 'react'
import _ from 'lodash'
import Handson from '../../../../../../components/Handson'

import {defaultDummyData, getRangeOfValidData, saveData, emphasizeTarget, saveComment} from '../../sagas/actions'
import connect from "react-redux/es/connect/connect";
import LabelModal from '../LabelModal'
import BreakModal from '../BreakModal'


const mapStateToProps = (state, ownProps) => {
    return {
        // emphasisTarget: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget,
        // comments: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments,
        ...ownProps
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        saveData: (data) => dispatch(saveData(data)),

    }
}
class DefaultSheetRepresentation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            data: defaultDummyData,
            modal:{
                open: false
            }
        }
        this.saveData= this.saveData.bind(this)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    saveData(){
        const {data} = this.state
        const dataToSave = JSON.parse(JSON.stringify(data))
        this.props.saveData(dataToSave)
    }

    openModal(){
        this.setState((prevState) => {
            return {
                ...prevState,
                modal:{
                    open:true
                }
            }
        })
    }

    closeModal(){
        this.setState((prevState) => {
            return {
                ...prevState,
                modal:{
                    open: false
                }
            }
        })
    }
    render(){
        const customSettings = this.props.customSettings || null
        const Modal = this.props.modal && typeof this.props.modal == 'function' ? this.props.modal(this): null
        return(
            <React.Fragment>
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
                        width:this.props.width,
                        height:this.props.height,
                        colWidths:80,
                        rowHeights:23,
                        ...customSettings(this)
                    }}
                />
                {Modal ? <Modal/> : null}
            </React.Fragment>
        )
    }
}
const DefaultSheet = connect(mapStateToProps, mapDispatchToProps)(DefaultSheetRepresentation)


class BarSheet2 extends React.Component{
    constructor(props){
        super(props)
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    openModal(){
        this.setState((prevState) => {
            return {
                ...prevState,
                modal:{
                    open:true
                }
            }
        })
    }

    closeModal(){
        this.setState((prevState) => {
            return {
                ...prevState,
                modal:{
                    open: false
                }
            }
        })
    }
    render(){
        const customSettings = this.props.customSettings || null
        return (
            <React.Fragment>
                <DefaultSheet customSettings={customSettings}/>
            </React.Fragment>
        )
    }
}




export const BarSheet =
    connect(
        (state)=>{
            return {
                emphasisTarget: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget,
                comments: state.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments,
            }
        },
        (dispatch)=>{
            return {
                emphasizeTarget: (x, y) => dispatch(emphasizeTarget(x, y)),
                saveComment: (comments) => dispatch(saveComment(comments)),
            }
        },
        (stateProps, dispatchProps, ownProps) => {
            const {emphasisTarget, comments} = stateProps
            const {emphasizeTarget, saveComment} = dispatchProps
            return {
                ...ownProps,
                modal: (ctx) => {
                    //it can be passed conditionally.
                    const SelectedModal = [LabelModal,BreakModal][parseInt(Math.random()*2)]
                    return function(){
                        const props = {
                            data: this.selectedData,
                            range: this.range,
                            comments: comments,
                            saveComment: saveComment,
                            opened: this.state.modal.open,
                            close: this.closeModal
                        }
                        return (<SelectedModal {...props}/>)
                    }.bind(ctx)
                },
                customSettings: (ctx) => {
                    return {
                        contextMenu: {
                            callback: function(key, options){
                                if (key === 'emphasize') {
                                    emphasizeTarget(options.end.col, options.end.row)
                                }
                                if (key === 'label') {
                                    this.selectedData = this.state.data.slice(options.start.row, options.end.row + 1).map((row) => row.slice(options.start.col, options.end.col + 1))
                                    this.range = [options.start.col, options.end.col, options.start.row, options.end.row]
                                    this.openModal()
                                    // this.labelModal.open(selectedData, range)
                                }
                            }.bind(ctx),
                            items: {
                                "hsep4": "---------",
                                "emphasize": {
                                    name: '강조하기'
                                },
                                "label": {
                                    name: '라벨 편집'
                                },
                            }

                        },
                        cells: function(row, col, prop){
                            let cellProperties = {}


                            const range = getRangeOfValidData(this.state.data)
                            let emphasized = emphasisTarget || [range[1], range[3]]
                            if (range[0] > emphasized[0] || emphasized[0] > range[1]
                                || range[2] > emphasized[1] || emphasized[1] > range[3]) {
                                emphasized = [range[1], range[3]]
                            }

                            const inComments = (col, row) => {
                                return comments.filter((comment) => {
                                    if (col == comment.col && row == comment.row) {
                                        return true
                                    }
                                }).length !== 0
                            }



                            if (col === emphasized[0] && row === emphasized[1]) {
                                cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                    td.style.background = '#FA4D1E'
                                    td.style.color = "#fff"
                                    td.innerText = value
                                    if(inComments(col, row)){
                                        td.classList.add('commentCell')
                                    }
                                }
                            } else {

                                if (range[0] <= col && col <= range[1]
                                    && range[2] <= row && row <= range[3]) {
                                    cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                        td.innerText = value
                                        if(inComments(col, row)){
                                            td.classList.add('commentCell')
                                        }
                                    }
                                } else {
                                    cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                        td.style.background = '#f1f1f5'
                                        td.innerText = value
                                        if(inComments(col, row)){
                                            td.classList.add('commentCell')
                                        }
                                    }
                                }
                            }
                            return cellProperties
                        }.bind(ctx)

                    }
                }
            }
        },
        {
            areStatesEqual: (next,prev) => {
                return (
                    next.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget === prev.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget
                    && _.isEqual(next.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments, prev.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments)
                )
            }
        }
    )(DefaultSheet)
