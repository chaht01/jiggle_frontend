import React from 'react'

/* COMPONENTS */
import Handson from '../../../../../../components/Handson'
import FullPage from '../../../../../../components/Layout/FullPage'
import LabelModal from '../LabelModal'

import styled from 'styled-components'
import './style.css'
import _ from 'lodash'
import connect from 'react-redux/es/connect/connect'
import {defaultDummyData, getRangeOfValidData, saveData, emphasizeTarget, saveComment, getValidDataWithinRange} from '../../sagas/actions'


const SheetContainer = styled.div`
            position: relative;
            width: calc(${props => props.width}px);
            background: #fff;
        `

const mapStateToProps = (state, ownProps) => {
    return {
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
        }
        this.labelModal = null
        this.saveData = this.saveData.bind(this)
        this.saveLabel = this.saveLabel.bind(this)
    }

    saveLabel(comments){
        this.props.saveComment(comments)
    }
    saveData(){
        const {data} = this.state
        const dataToSave = JSON.parse(JSON.stringify(data))
        this.props.saveData(dataToSave)
    }
    render(){
        const {width, height, emphasisTarget, emphasizeTarget, comments} = this.props
        return (
            <FullPage>
                <SheetContainer width={width}>
                    <Handson
                        ref={(handson)=> this.handson = handson}
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
                            comments: true,
                            contextMenu:{
                                callback: (key, options) => {
                                    if(key === 'emphasize'){
                                        emphasizeTarget(options.end.col, options.end.row)
                                    }
                                    if(key === 'label'){
                                        const selectedData = this.state.data.slice(options.start.row, options.end.row+1).map((row)=>row.slice(options.start.col, options.end.col+1))
                                        this.labelModal.open(selectedData, [options.start.col, options.end.col, options.start.row, options.end.row])
                                    }
                                },
                                items:{
                                    "hsep4": "---------",
                                    "emphasize": {
                                        name: '강조하기'
                                    },
                                    "label": {
                                        name: '라벨 추가'
                                    },
                                }
                            },
                            cells: (row, col, prop) => {
                                let cellProperties = {}
                                const range = getRangeOfValidData(this.state.data)
                                let emphasized = emphasisTarget || [range[1], range[3]]
                                if(range[0]>emphasized[0] || emphasized[0]>range[1]
                                    || range[2]>emphasized[1] || emphasized[1]>range[3]){
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
                            }
                        }}
                    />
                </SheetContainer>
                <LabelModal ref={node => this.labelModal = node} saveComment={this.saveLabel} comments={comments}/>
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
                next.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget === prev.PrivateReducer.AsapReducer.procedureManager.dirtyData.emphasisTarget
                && _.isEqual(next.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments, prev.PrivateReducer.AsapReducer.procedureManager.dirtyData.comments)
            )
        }
    }
)(SheetRepresentation)
export default Sheet
