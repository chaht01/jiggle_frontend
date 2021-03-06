import * as actionType from './types'
import _ from 'lodash'
import numeral from 'numeral'
import validator from "../../../../../utils/validator";

export const defaultDummyData = [
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
]


/*** FETCH TEMPLATE ***/
export const fetchTemplate = ({idx, template}) => {
    return {
        type: actionType.TEMPLATE_FETCH_REQUEST,
        payload: {
            idx,
            template
        }
    }
}

export const fetchTemplateSuccess = (template) => {
    return {
        type: actionType.TEMPLATE_FETCH_SUCCESS,
        payload: template
    }
}

export const fetchTemplateFailure = (err) => {
    return {
        type: actionType.TEMPLATE_FETCH_FAILURE,
        payload: err
    }
}

export const clearTemplate = () => {
    return {
        type: actionType.TEMPLATE_CLEAR
    }
}

/*** SAVE DATA ***/
export const getRangeOfValidData = (data) => {
    let range = [-1, -1, -1, -1] //[left, right, top, bottom]
    for(let i=0; i<data.length; i++){
        for(let j=0; j<data[i].length; j++){
            if(data[i][j]!==undefined && data[i][j]!==null && data[i][j].length!==0){
                range[0] = range[0]==-1 ? j : Math.min(j, range[0])
                range[1] = range[1]==-1 ? j : Math.max(j, range[1])
                range[2] = range[2]==-1 ? i : Math.min(i, range[2])
                range[3] = range[3]==-1 ? i : Math.max(i, range[3])
            }
        }
    }
    return range
}
export const validRange = (range) => {
    return range[0]<=range[1] && range[2]<=range[3]
}
export const isDirty = (range) => {
    return !(range[0]==-1 && range[1]==-1 && range[2]==-1 && range[3]==-1)
}
export const getValidDataWithinRange = (data, range) =>{
    if(!isDirty(range) || !validRange(range)){
        return []
    }
    const colSanitized = data.map((row, row_idx) => {
        if(range[2]<=row_idx && row_idx<=range[3]) {
            const filteredRow = row.filter((cell, col_idx) => {
                return (range[0] <= col_idx && col_idx <= range[1])
            })
            return filteredRow
        }else{
            return null
        }
    })
    const rangedData = colSanitized.filter((row)=>row!==null)
    return rangedData
}

export const saveData = (data) => {
    return {
        type: actionType.CHART_DATA_POST_REQUEST,
        payload: {
            data,
            range: getRangeOfValidData(data)
        },
    }
}

export const saveDataSuccess = (data, range) => {
    return {
        type: actionType.CHART_DATA_POST_SUCCESS,
        payload: {
            data,
            range
        }
    }
}

export const saveDataFailure = (err) => {
    return {
        type: actionType.CHART_DATA_POST_FAILURE,
        payload: err
    }
}

export const clearData = () => {
    return {
        type: actionType.CHART_DATA_CLEAR
    }
}

/*** SAVE META ***/
export const saveMeta = (meta) => {
    return {
        type: actionType.CHART_META_POST_REQUEST,
        payload: meta
    }
}

export const saveMetaSuccess = () => {
    return {
        type: actionType.CHART_META_POST_SUCCESS,
    }
}

export const saveMetaFailure = (err) => {
    return {
        type: actionType.CHART_META_POST_FAILURE,
        payload: err
    }
}

export const clearMeta = () => {
    return {
        type: actionType.CHART_META_CLEAR
    }
}

export const clearAllProcedure = () => {
    return {
        type: actionType.PROCEDURE_CLEAR
    }
}


/*** FOCUS TARGET ***/
export const emphasizeTarget = (x, y) => {
    return {
        type: actionType.CHART_CELL_EMPHASIZE,
        payload:{
            x,
            y
        }
    }
}
export const emphasisTargetValidate = () => {
    return {
        type: actionType.CHART_CELL_EMPHASIZE_VALIDATE
    }
}

/*** SAVE COMMENT ***/
export const saveComment = (comments) => {
    return {
        type: actionType.CHART_COMMENT_POST_REQUEST,
        payload: comments
    }
}

export const saveCommentSuccess = () => {
    return {
        type: actionType.CHART_COMMENT_POST_SUCCESS
    }
}

export const saveCommentFailure = (err) => {
    return {
        type: actionType.CHART_COMMENT_POST_FAILURE,
        payload: err
    }
}

export const commentValidate = () => {
    return {
        type: actionType.CHART_COMMENT_VALIDATE
    }
}

/*** DATA MODAL ***/
export const dataModalOpen = (bool, payload) => {
    return {
        type: bool ? actionType.DATA_MODAL_OPEN : actionType.DATA_MODAL_CLOSE,
        payload
    }
}

/*** DATA PLAYER NODE SET ***/
export const dataPlayerSet = (playerNode) => {
    return {
        type: actionType.DATA_PLAYER_SET,
        payload: playerNode
    }
}

export const dataPlayerClear = () => {
    return {
        type: actionType.DATA_PLAYER_CLEAR
    }
}

/*** MASK SAVE ***/
export const saveMask = (mask) => {
    return {
        type: actionType.MASK_SAVE,
        payload: mask
    }
}

export const clearMask = (mask) => {
    return {
        type: actionType.MASK_SAVE,
    }
}

/*** APPEARANCE SAVE ***/
export const saveColor = (color) => {
    return{
        type: actionType.COLOR_SAVE,
        payload: color
    }
}
export const clearColor = () => {
    return {
        type: actionType.COLOR_CLEAR
    }
}

export const saveTheme = (theme) => {
    return {
        type: actionType.THEME_SAVE,
        payload: theme
    }
}
export const clearTheme = () => {
    return {
        type: actionType.THEME_CLEAR
    }
}

/*** APPEARANCE PLAYER NODE SET ***/
export const appearancePlayerSet = (playerNode) => {
    return {
        type: actionType.APPEARANCE_PLAYER_SET,
        payload: playerNode
    }
}

export const appearancePlayerClear = () => {
    return {
        type: actionType.APPEARANCE_PLAYER_CLEAR
    }
}

/*** PLAYER UPDATE ***/
export const updatePlayers = () => {
    return {
        type: actionType.GLOBAL_PLAYER_UPDATE
    }
}




/*** DATA VALIDATION ***/

class ObjectCell {
    constructor(value){
        this.value = this.getTrimmed(value)
        this.emphasis = false
    }
    getTrimmed(value){
        const trimmed = typeof value==='string' ? value.trim() : value
        return trimmed
    }
    saveComment(comment){
        const trimmed = this.getTrimmed(comment)
        if([null, undefined, ''].indexOf(trimmed)>-1){
            delete this.comment
        }else{
            this.comment = comment
        }
    }
    getComment(){
        if(this.isCommented()){
            return this.comment
        }else{
            return undefined
        }
    }
    isCommented(){
        if(this.hasOwnProperty('comment') && [null, undefined, ''].indexOf(this.getTrimmed(this.comment))<0){
            return true
        }else{
            return false
        }
    }
    saveEmphasis(bool){
        this.emphasis = !!bool
    }
    isPure(){
        return [null,undefined,''].indexOf(this.value)<0 && !this.isCommented() && !this.emphasis
    }
}


export const performDataValidation = (data, range, comments, emphasisTarget=null) => {
    try{
        let dataWithOpts = _.cloneDeep(data)

        //data cell convert to object cell
        dataWithOpts = data.map(row => {
            return row.map(cell => {
                return new ObjectCell(cell)
            })
        })

        //merge comments with data
        comments.forEach(comment => {
            let value = dataWithOpts[comment.row][comment.col].value
            if(typeof value === 'string'){
                value = value.trim()
            }
            if(['', undefined, null].indexOf(value)==-1){
                dataWithOpts[comment.row][comment.col].saveComment(comment.value)
            }
        })

        //merge emphasisTarget to data
        if(emphasisTarget!==null && validRange(emphasisTarget) && !_.isEqual(emphasisTarget, [-1, -1, -1, -1])){
            const [emph_x, emph_y] = [emphasisTarget[0], emphasisTarget[2]]
            dataWithOpts[emph_y][emph_x].saveEmphasis(true)
        }

        const rangedDataWithComments = getValidDataWithinRange(dataWithOpts, range)
        const schema = generateSchema(rangedDataWithComments)
        const readyToSend = schemaToRawData(schema)
        return {
            rangedDataWithComments,
            rawData: readyToSend.rawData,
            comments: readyToSend.comments,
            breakPoint: readyToSend.breakPoint,
            schema,
        }
    }catch (err){
        console.error('Parse Error while generating raw data')
        console.error(err.stack)
        return null
    }

}

export const schemaToRawData = (schema) => {
    let ret = {
        rawData: [[]],
        comments: [],
        breakPoint: [-1, -1, -1, -1]
    }
    try{
        let axisColumns,
            axisLabel,
            legends,
            values,
            comments = [],
            breakPoint = [-1, -1, -1, -1]
        if(schema.numeric.length===0){ // No way to draw chart
            return ret
        }else{
            if(schema.axisColumnNamespace.length == 0){
                axisColumns = schema.dummyAxisColumnNamespace()
            }else{
                //extract value only
                axisColumns = _.cloneDeep(schema.axisColumnNamespace)
                    .map((row, row_idx)=> {
                        return row.map((cell, col_idx) => {
                            return cell.value
                        })
                    })
            }

            if(axisColumns.length>1){
                //collapse to single axis column
                axisColumns = collapseMatrix(axisColumns)
            }

            axisLabel = schema.axisLabel || ''
            if(schema.legendNamespace.length == 0){
                legends = schema.dummyLegendNamespace()
            }else{
                //extract value only
                legends = _.cloneDeep(schema.legendNamespace)
                    .map((row, row_idx)=> {
                        return row.map((cell, col_idx) => {
                            return cell.value
                        })
                    })
            }

            const legends_t = transpose(legends)
            if(legends_t.length>1){
                legends = transpose(collapseMatrix(legends_t))
            }
            legends.unshift([axisLabel])

            values = schema.numeric.map((row) => {
                return row.map((cell) => {
                    let parsed = numeral(cell.value).value()
                    cell.value = (parsed===null || isNaN(parsed)) ? '' : parsed
                    if(parsed===null || isNaN(parsed)){
                        cell.saveComment('')
                    }
                    return cell
                })
            })

            const rawDataWithComments = [].concat(transpose(legends)).concat(transpose([].concat(axisColumns).concat(values)))
            ret.rawData = rawDataWithComments.map((row, row_idx)=>{
                return row.map((cell, col_idx) => {
                    if(cell instanceof ObjectCell){
                        if(cell.isCommented()){
                            comments.push({
                                col:col_idx,
                                row:row_idx,
                                comment: cell.comment
                            })
                        }
                        if(cell.emphasis === true){
                            breakPoint = [col_idx, col_idx, row_idx, row_idx]
                        }
                        return cell.value
                    }else{
                        return cell
                    }
                })
            })
            ret.comments = comments
            ret.breakPoint = breakPoint
            return ret
        }
    }catch(err){
        console.error('Parse Error from schema to raw data.')
        console.error(err.stack)

        ret.rawData = [[]]
        ret.comments = []
        ret.breakPoint = [-1, -1, -1, -1]
        return ret
    }
}

export const chartSchema = {
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


export const generateSchema = (data, direction) => { //data must be comment integrated
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
            let trimmed = data[i][j].value
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
            for(let i=1; i<header.length; i++){ //todo
                let numericExpected = header[i].value
                if(validator.numeric(numericExpected) === false){
                    headerNaN++
                }
            }
            if(headerNaN>0){ // axis col ns만 있고 numerical range는 없다
                axisColumnNamespaceExpectedRange = [0, width-1, 0, 0]
                numericExpectedRange = [-1, -1, -1, -1] // no numerics
            }else{
                let numericExpected = header[0].value
                if(validator.numeric(numericExpected) === false){
                    axisLabel = header[0].value
                    numericExpectedRange = [1, width-1, 0, height-1]
                }else{
                    numericExpectedRange = [0, width-1, 0, height-1]
                }
            }
        }else{
            axisColumnNamespaceExpectedRange = [0, width-1, 0, 0] //The first row should be axis col ns
            numericExpectedRange = [0, width-1, 1, height-1]
            for(let i=1; i<aside.length; i++){
                let numericExpected = aside[i].value
                if(validator.numeric(numericExpected) === false){
                    asideNaN++
                }
            }
            if(asideNaN>0){ //exist
                legendNamespaceExpectedRange = [0, 0, 1, height-1]
                axisLabel = aside[0].value
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

export const collapseMatrix = (arr) => {
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

export const transpose = (arr) => {
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

export const mergeDataToDummy = (data, startIdx=[0,0]) => {
    //startIdx [colStart, rowStart]

    if(data===null || data===undefined || data.length==0 || data[0].length==0){
        return _.cloneDeep(defaultDummyData)
    }

    return _.cloneDeep(defaultDummyData).map((row, row_idx)=> {
        if(startIdx[1]<=row_idx && row_idx-startIdx[1]<data.length){
            return row.map((cell, col_idx) => {
                if(startIdx[0]<=col_idx && col_idx-startIdx[0]<data[0].length){
                    return data[row_idx-startIdx[1]][col_idx-startIdx[0]]
                }else{
                    return cell
                }
            })
        }else{
            return row
        }
    })
}