import * as actionType from '../../sagas/types'

const initialTemplateState = {
    loading: false,
    error: null,
    idx: -1,
    config: null
}
const initialDataState = [
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
const initialCommentState = [] // [{col:Number, row:Number, value:""},...]
const initialMetaState = {
    placeholder: '빈 차트 제목',
    title: '',
    subtitle:'',
    xAxis:'',
    yAxis:'',
    reference:'',
    producer:'',
}
const initialRange = [0,0,0,0]

const initialDirtyDataState = {
    loading: false,
    data: initialDataState,
    meta: initialMetaState,
    comments: initialCommentState,
    range:initialRange,
    emphasisTarget: null,
    error: null
}
const initialAppearanceState = null
const initialState = {
    selectedTemplate: initialTemplateState,
    dirtyData: initialDirtyDataState,
    appearance: initialAppearanceState,
}

const procedureManager = (state=initialState, action) => {
    switch (action.type) {
        /* ACTION RELATED TO TEMPLATE FETCHING */
        case actionType.TEMPLATE_FETCH_REQUEST:
            return {
                ...state,
                selectedTemplate: {
                    ...state.selectedTemplate,
                    loading: true,
                    error: null,
                    idx: action.payload.idx,
                }
            }
        case actionType.TEMPLATE_FETCH_SUCCESS:
            return {
                ...state,
                selectedTemplate: {
                    ...state.selectedTemplate,
                    loading: false,
                    error: null,
                    config: action.payload
                }
            }
        case actionType.TEMPLATE_FETCH_FAILURE:
            return {
                ...state,
                selectedTemplate: {
                    ...state.selectedTemplate,
                    loading: false,
                    error: action.payload,
                    config: null,
                    idx: -1
                }
            }
        case actionType.TEMPLATE_CLEAR:
            return initialTemplateState

        /* ACTION RELATED TO CHART DATA */
        case actionType.CHART_DATA_POST_REQUEST:
            const {data, range} = action.payload
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    data,
                    range,
                    loading: true,
                    error: null,
                }
            }
        case actionType.CHART_DATA_POST_SUCCESS:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    loading: false,
                    error: null,
                }
            }
        case actionType.CHART_DATA_POST_FAILURE:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    loading: false,
                    error: action.payload
                }
            }
        case actionType.CHART_DATA_CLEAR:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    data: initialDataState,
                    range: initialRange
                }
            }

        /* ACTION RELATED TO CHART META */
        case actionType.CHART_META_POST_REQUEST:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    loading: true,
                    error: null,
                    meta: Object.assign({}, state.dirtyData.meta, action.payload)
                }
            }
        case actionType.CHART_META_POST_SUCCESS:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    loading: false,
                    error: null,
                }
            }
        case actionType.CHART_META_POST_FAILURE:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    loading: false,
                    error: action.payload,
                }
            }
        case actionType.CHART_META_CLEAR:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    meta: initialMetaState
                }
            }

        case actionType.CHART_CELL_EMPHASIZE:
            const {x, y} = action.payload
            if(state.dirtyData.range[0]<=x && x<=state.dirtyData.range[1]
                && state.dirtyData.range[2]<=y && y<=state.dirtyData.range[3]){
                return {
                    ...state,
                    dirtyData: {
                        ...state.dirtyData,
                        emphasisTarget: [action.payload.x, action.payload.y]
                    }
                }
            }else{
                return state
            }
        case actionType.CHART_CELL_EMPHASIZE_VALIDATE:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    emphasisTarget: ((e, range)=>{
                        if(e===null){
                            return e
                        }
                        if(range[0]>e[0] || e[0]>range[1]
                            || range[2]>e[1] || e[1]>range[3]){
                            return null
                        }
                        return e

                    })(state.dirtyData.emphasisTarget, state.dirtyData.range),
                }
            }

        case actionType.CHART_COMMENT_POST_REQUEST:
            return {
                ...state,
                dirtyData:{
                    ...state.dirtyData,
                    comments: (()=>{
                        const comments = action.payload
                        let ret = state.dirtyData.comments.filter((comment)=>{
                            for(let i=0; i<comments.length; i++){
                                if(comment.row === comments[i].row
                                    && comment.col === comments[i].col){
                                    return false
                                }
                            }
                            return true
                        })
                        let removeEmpty = comments.filter((comment)=>{
                            return comment.value!=''
                        })
                        ret = ret.concat(removeEmpty)
                        return ret
                    })()
                }
            }
        case actionType.CHART_COMMENT_VALIDATE:
            return (()=>{
                const range = state.dirtyData.range
                const filtered =state.dirtyData.comments.filter((comment)=>{
                    if(range[0]>comment.col || comment.col>range[1]
                        || range[2]>comment.row || comment.row>range[3] || ['',undefined,null].indexOf(state.dirtyData.data[comment.row][comment.col])>-1){
                        return false
                    }else{
                        return true
                    }
                })
                if(filtered.length === state.dirtyData.comments){
                    return state
                }else{
                    return {
                        ...state,
                        dirtyData:{
                            ...state.dirtyData,
                            comments: filtered
                        }
                    }
                }
            })()

        /* GLOBAL */
        case actionType.PROCEDURE_CLEAR:
            return initialState
        /* ACTION RELATED TO APPEARANCE SETTINGS */
        default:
            return state;
    }
}

export default procedureManager
