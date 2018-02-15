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
        const schema = generateSchema(rangedData)
        console.log(schema)
        console.log(schemaToRawData(schema))
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
const collapseMatrix = (arr) => {
    return [arr.map(row => {
        let reduced = []
        row.reduce((a,c,i)=>{
            if(c=='' || c===null || c==undefined){
                reduced[i] = a;
                return a;
            }else{
                reduced[i] = c;
                return c;
            }
        },0)
        return reduced
    }).reduce((a,c,i)=>{
        return a.map((e,j)=>e+' '+c[j])
    })]
}
const schemaToRawData = (schema) => {
    try{
        let axisColumns,
            axisLabel,
            legends,
            values

        if(schema.numeric.length===0){ // No way to draw chart
            return []
        }else{
            if(schema.axisColumnNamespace.length == 0){
                axisColumns = schema.dummyAxisColumnNamespace()
            }else{
                axisColumns = schema.axisColumnNamespace
            }

            if(axisColumns.length>1){
                //collapse to single axis column
                axisColumns = collapseMatrix(axisColumns)
            }


            axisLabel = schema.axisLabel || ''
            if(schema.legendNamespace.length == 0){
                legends = schema.dummyLegendNamespace()
            }else{
                legends = schema.legendNamespace
            }

            const legends_t = transpose(legends)
            if(legends_t.length>1){
                legends = transpose(collapseMatrix(legends_t))
            }
            legends.unshift([axisLabel])

            values = schema.numeric.map((row) => {
                return row.map((cell) => {
                    const parsed = numeral(cell).value()
                    return (parsed===null || isNaN(parsed)) ? '' : parsed
                })
            })

            return [].concat(transpose(legends)).concat(transpose([].concat(axisColumns).concat(values)))
        }
    }catch(err){
        console.error('Parse Error from schema to raw data.')
        console.log(err.stack)
        return [[]]
    }

}

const chartSchema = {
    axisColumnNamespace:[], // [['삼성', '엘지', '두산']] or [['2013', '2014', '2015']] or [...dates]
    axisLabel:'',
    legendNamespace:[], // [['삼성'], ['엘지'], ['두산']] or [['2013'], ['2014'], ['2015']].
    // 길이가 numeric의 length와 일치해야함(numeric의 length가 1이라면 비어있어도 됨). 1개일때는 곧 value Axis(direction의 보수)의 이름이 됨

    numeric: [], // [[]]. 가로 길이와 AxisColumnNamespace 길이가 일치해야함(빈 스트링 가능)
    direction: 'x', // or 'y'
    dummyAxisColumnNamespace(){
        let ret = []
        if(this.numeric.length==0){
            return []
        }
        for(let i=0; i<this.numeric[0].length; i++){
            let str = ''
            let curr = i
            while(true){
                str = (String.fromCharCode(97 + (curr%26)) + str)
                curr = parseInt(curr/26)
                if(curr === 0){
                    break;
                }
            }
            ret.push('항목_'+str)
        }
        return [ret]
    },
    dummyLegendNamespace(){
        let ret = []
        if(this.numeric.length==0){
            return []
        }
        for(let i=0; i<this.numeric.length; i++){
            let str = ''
            let curr = i
            while(true){
                str = (String.fromCharCode(97 + (curr%26)) + str)
                curr = parseInt(curr/26)
                if(curr === 0){
                    break;
                }
            }
            ret.push('계열_'+str)
        }
        return [ret]
    }
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

const generateSchema = (data, direction) => {
    let schema = Object.assign({}, chartSchema)
    if(data===null || data.length===0 || data[0].length===0){
        return schema
    }

    /**
     * Initialize schema object(schema)
     * @type {*}
     */
    schema.direction = direction || data.length > data[0].length ? 'y' : 'x'

    if(schema.direction == 'y')
        data = transpose(data)

    /**
     * Check data size
     */
    const width = data[0].length
    const height = data.length
    if(width<2 || height==0){
        return schema
    }

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
    let axisLabel = ''
    if(vacantRange[0] == 0){ // if vacant range exist: axis and value label could not be assigned
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

        const header = data[0]
        const aside = data.map(r => r[0])
        let headerNaN = 0, asideNaN = 0
        if(height===1){
            // 행이 1개뿐이면 그 행이 numerical 인지 아닌지에따라 axis col ns를 정한다
            for(let i=1; i<header.length; i++){
                if(validator.numeric(header[i]) === false){
                    headerNaN++
                }
            }
            if(headerNaN>0){ // axis col ns만 있고 numerical range는 없다
                axisColumnNamespaceExpectedRange = [0, width-1, 0, 0]
                numericExpectedRange = [-1, -1, -1, -1] // no numerics
            }else{
                if(validator.numeric(header[0]) === false){
                    axisLabel = header[0]
                    numericExpectedRange = [1, width-1, 0, height-1]
                }else{
                    numericExpectedRange = [0, width-1, 0, height-1]
                }
            }
        }else{
            axisColumnNamespaceExpectedRange = [0, width-1, 0, 0] //The first row should be axis col ns
            numericExpectedRange = [0, width-1, 1, height-1]
            for(let i=1; i<aside.length; i++){
                if(validator.numeric(aside[i]) === false){
                    asideNaN++
                }
            }
            if(asideNaN>0){ //exist
                legendNamespaceExpectedRange = [0, 0, 1, height-1]
                axisLabel = aside[0]
                axisColumnNamespaceExpectedRange[0] = 1 //waterfall updated
                numericExpectedRange[0] = 1
            }
        }

    }
    schema.axisColumnNamespace = getValidDataWithinRange(data, axisColumnNamespaceExpectedRange)
    schema.legendNamespace = getValidDataWithinRange(data, legendNamespaceExpectedRange)
    schema.numeric = getValidDataWithinRange(data, numericExpectedRange)
    schema.axisLabel = axisLabel
    return schema
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
