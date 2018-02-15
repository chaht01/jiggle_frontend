import React from 'react'

/* COMPONENTS */
import Handson from '../../../../../../components/Handson'
import FullPage from '../../../../../../components/Layout/FullPage'
import LabelModal from '../LabelModal'

import styled from 'styled-components'
import './style.css'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import math from 'mathjs'

import connect from 'react-redux/es/connect/connect'
import {getRangeOfValidData, saveData, emphasizeTarget, saveComment, getValidDataWithinRange} from '../../../../scenes/Asap/sagas/actions'
import validator from "../../../../../../utils/validator";


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
            data: [
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
                ['','','','','','','','','','','','','','','','','','','',''],
            ],
        }

        this.labelModal = null
        this.handson = null

        this.setPlaceHolderStatus = this.setPlaceHolderStatus.bind(this)
        this.checkDirty = this.checkDirty.bind(this)
        this.saveData = this.saveData.bind(this)
        this.saveLabel = this.saveLabel.bind(this)

    }

    setPlaceHolderStatus(isOver){
        this.setState({placeholder:isOver})
    }

    saveLabel(comments){
        this.props.saveComment(comments)
    }

    checkDirty(){
        const {data} = this.state
        for(let i=0; i<data.length; i++){
            for(let j=0; j<data[i].length; j++){
                if(['', undefined, null].indexOf(data[i][j])==-1)
                    return true;
            }
        }
        return false;
    }

    saveData(){
        const {data} = this.state
        const dataToSave = JSON.parse(JSON.stringify(data))
        this.props.saveData(dataToSave)

        const range = getRangeOfValidData(this.state.data)
        const rangedData = getValidDataWithinRange(this.state.data, range)
        console.log(getValidNumerical(rangedData))
        console.log(generateArchi(rangedData))
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

                                if(col === emphasized[0] && row === emphasized[1]){
                                    cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                        td.style.background = '#FA4D1E'
                                        td.style.color = "#fff"
                                        td.innerText = value
                                    }
                                }else{
                                    if(range[0]<=col && col<=range[1]
                                        && range[2]<=row && row<=range[3]){
                                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                            td.innerText = value
                                        }
                                    }else{
                                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                            td.style.background = '#f1f1f5'
                                            td.innerText = value
                                        }
                                    }
                                }

                                comments.map((comment)=>{
                                    if(col == comment.col && row == comment.row){
                                        cellProperties.renderer = (instance, td, row, col, prop, value, cellProperties) => {
                                            td.classList.add('commentCell')
                                            td.innerText = value
                                        }
                                    }
                                })
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

const chartArchitecture = {
    axisColumnNamespace:[[]], // [['삼성', '엘지', '두산']] or [['2013', '2014', '2015']] or [...dates]

    legendNamespace:[[]], // [['삼성', '엘지', '두산']] or ['2013', '2014', '2015'].
    // 길이가 numeric의 length와 일치해야함(numeric의 length가 1이라면 비어있어도 됨). 1개일때는 곧 value Axis(direction의 보수)의 이름이 됨

    numeric: [[]], // [[]]. 가로 길이와 AxisColumnNamespace 길이가 일치해야함(빈 스트링 가능)
    direction: 'x' // or 'y'
}
const transpose = (arr) => {
    //check size validation
    if(arr.length == 0){
        return null
    }
    const width = arr[0].length
    if(arr.filter((row) => row.length!=width).length != 0){
        throw "Irregular # of columns in this array. Check missing entity of array."
    }

    return arr.reduce(($, row) => row.map((_, i) => [...($[i] || []), row[i]]), [])
}

const isDirty = (range) => {
    return !(range[0]==-1 && range[1]==-1 && range[2]==-1 && range[3]==-1)
}

const generateArchi = (data, direction) => {
    let archi = Object.assign({}, chartArchitecture)
    if(data===null || data.length===0 || data[0].length===0){
        return archi
    }

    /**
     * Initialize architecture object(archi)
     * @type {*}
     */
    archi.direction = direction || data.length > data[0].length ? 'y' : 'x'

    if(archi.direction == 'y')
        data = transpose(data)

    /**
     * Check data size
     */
    const width = data[0].length
    const height = data.length


    /**
     * Calculate vacant range
     */
    let colUntil = -1,
        rowUntil = -1
    let vacantColUntil = []
    let vacantRange
    const vacancy = [undefined, null, '']
    for(let i=0; i<data.length; i++){
        for(let j=0; j<data[i].length; j++){
            let trimmed = data[i][j]
            if(typeof trimmed === 'string'){
                trimmed = trimmed.trim()
            }
            if(vacancy.indexOf(trimmed)>-1){ // is vacant?
                if(vacantColUntil.length == i){
                    vacantColUntil.push(j)
                } else {
                    vacantColUntil[i] = j // update until index
                }
            }else{
                break; // go to next row
            }
        }
        if(vacantColUntil.length!=i+1){
            break;
        }
    }
    if(vacantColUntil.length == 0){
        vacantRange = [-1, colUntil, -1, rowUntil]
    } else {
        vacantRange = [0, Math.min(...vacantColUntil), 0, vacantColUntil.length-1]
    }

    /**
     * Calculate Numeric range
     */
    let numericExpectedRange = null
    if(vacantRange[0] == 0){ // if vacant range exist
        numericExpectedRange = [vacantRange[1]+1, width-1, vacantRange[3]+1, height-1]
    } else  {
        numericExpectedRange = [0, width-1, 0, height-1] // will be updated through below procedures
    }


    /**
     * Calculate Axis Column Namespace range
     * & legend Namespace range
     */
    let axisColumnNamespaceExpectedRange = null
    let legendNamespaceExpectedRange = null
    if(vacantRange[0] == 0){ // if vacant range exist
        axisColumnNamespaceExpectedRange = [
            vacantRange[1]+1, // right after vacant col position
            width-1,
            (vacantRange[3]==0 ? vacantRange[3] : vacantRange[3]-1), // right before first non-vacant row position
            vacantRange[3]
        ]
        legendNamespaceExpectedRange = [
            (vacantRange[1]==0 ? vacantRange[1] : vacantRange[1]-1),
            vacantRange[1],
            vacantRange[3]+1,
            height-1
        ]
    } else {
        axisColumnNamespaceExpectedRange = [-1, -1, -1, -1]
        legendNamespaceExpectedRange = [-1, -1, -1, -1]

        // Updating namespaces according to header & aside's non-numeric value
        const header = data[0]
        const aside = data.map(r => r[0])
        let headerNaN = 0, asideNaN = 0
        for(let i=1; i<header.length; i++){
            if(validator.numeric(header[i]) === false){
                headerNaN++
            }
        }
        for(let i=1; i<aside.length; i++){
            if(validator.numeric(aside[i]) === false){
                asideNaN++
            }
        }

        /**
         * Water fall
         */

        if (headerNaN>0) {
            axisColumnNamespaceExpectedRange = [0, width-1, 0, 0]
            numericExpectedRange[2] = 1 //update
        } else {
            // More deep validation -- rough checking of numerical data using 'numeral'
            // Check if increment(or decrement) exist either header or aside
            if (header.length>2) {
                let interval = []
                header.slice(1).reduce((a,c,i) => {
                    interval.push(
                        Number(math.subtract(math.bignumber(validator.numeric(c)), math.bignumber(validator.numeric(a))))
                    );
                    return c})
                if(interval.filter(diff => diff!=interval[0]).length === 0) {
                    let startPos = 1
                    const cornerValue = validator.numeric(header[0])
                    if(cornerValue!==false && Number(math.subtract(math.bignumber(validator.numeric(header[1])), math.bignumber(cornerValue))) == interval[0]){
                        startPos = 0
                    }
                    axisColumnNamespaceExpectedRange = [startPos, width-1, 0, 0]
                    numericExpectedRange[0] = startPos //update
                    numericExpectedRange[2] = 1 //update
                }
            }
        }

        if(axisColumnNamespaceExpectedRange[0]>0){
            //waterfall
            if (asideNaN>0) {
                let legendStart = 0
                if(isDirty(axisColumnNamespaceExpectedRange)){
                    legendStart = axisColumnNamespaceExpectedRange[3]+1
                }
                legendNamespaceExpectedRange = [0, 0, legendStart, height-1]  // dependent on header NaN
                numericExpectedRange[0] = 1 //update
                numericExpectedRange[2] = legendStart //update
            }
            if(headerNaN>0 && asideNaN>0){
                axisColumnNamespaceExpectedRange[0] = 1
                legendNamespaceExpectedRange[2] = 1
            }
        }

        console.log(numericExpectedRange)

        /*
        if(asideNaN==0){
            if(aside.length>2){
                let interval = []
                aside.slice(1).reduce((a,c,i) => {
                    interval.push(
                        Number(math.subtract(math.bignumber(validator.numeric(c)), math.bignumber(validator.numeric(a))))
                    );
                    return c})
                console.log(interval)
                if(interval.filter(diff => diff!=interval[0]).length === 0){
                    let startPos = 1
                    const cornerValue = validator.numeric(aside[0])
                    if(cornerValue!==false && Number(math.subtract(math.bignumber(validator.numeric(aside[1])), math.bignumber(cornerValue))) == interval[0]){
                        startPos = 0
                    }
                    legendNamespaceExpectedRange = [0, 0, startPos, height-1]
                    numericExpectedRange[0] = 1 //update
                    numericExpectedRange[2] = startPos //update
                }
            }
        }
        */
    }
    archi.axisColumnNamespace = getValidDataWithinRange(data, axisColumnNamespaceExpectedRange)
    archi.legendNamespace = getValidDataWithinRange(data, legendNamespaceExpectedRange)
    archi.numeric = getValidDataWithinRange(data, numericExpectedRange)
    return archi
}

const chartArchitectureValidator = (archi) => {
    let msg = {} // [key]: archi의 key. [value]: {warning:'', error: ''}
    const {AxisColumnNamespace, legendNamespace, unit, numeric, direction } = archi
    /**
     * 기본적으로 Numeric driven으로 진행
     */

    /**
     * Axis Column Namespace Validation
     * 서로 비슷한 타입의 namespace인지 확인한다 그렇지 않을 경우 warning
     * 없을 경우 dummy를 핸들하도록(warning)
     */



}




const getValidNumerical = (data) => {
    const initialRange = [-1, -1, -1, -1]
    let range = [-1, -1, -1, -1] //[left, right, top, bottom]
    for(let i=0; i<data.length; i++){
        for(let j=0; j<data[i].length; j++){
            if(validator.numeric(data[i][j])!==false){
                range[0] = range[0]==-1 ? j : Math.min(j, range[0])
                range[1] = range[1]==-1 ? j : Math.max(j, range[1])
                range[2] = range[2]==-1 ? i : Math.min(i, range[2])
                range[3] = range[3]==-1 ? i : Math.max(i, range[3])
            }
        }
    }

    let rangedData
    console.log(range, initialRange)
    if(initialRange.filter((v, i) => range[i]===v).length>0){
        rangedData = null
    }else{
        rangedData = getValidDataWithinRange(data, range)
    }

    let outsider = [-1, -1, -1, -1]
    if(rangedData!==null){
        for(let i=0; i<rangedData.length; i++){
            for(let j=0; j<rangedData[i].length; j++){
                console.log(rangedData[i][j], validator.numeric(rangedData[i][j]))
                if(validator.numeric(rangedData[i][j])===false){
                    outsider[0] = outsider[0]==-1 ? j : Math.min(j, outsider[0])
                    outsider[1] = outsider[1]==-1 ? j : Math.max(j, outsider[1])
                    outsider[2] = outsider[2]==-1 ? i : Math.min(j, outsider[2])
                    outsider[3] = outsider[3]==-1 ? i : Math.max(j, outsider[3])
                }
            }
        }
    }

    return {
        rangedData: rangedData,
        range: range,
        outsider: outsider
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
