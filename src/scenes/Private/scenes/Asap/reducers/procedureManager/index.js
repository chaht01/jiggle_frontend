import * as actionType from '../../sagas/types'
import {defaultDummyData} from '../../sagas/actions'
import * as _ from "lodash";
import {THEME} from '../../config/types'

const initialTemplateState = {
    loading: false,
    error: null,
    idx: -1,
    config: null
}
const initialDataState = _.cloneDeep(defaultDummyData)
const initialCommentState = [] // [{col:Number, row:Number, value:""},...]
const initialMetaState = {
    placeholder: '빈 차트 제목',
    title: '',
    subtitle:'',
    unit:'',
    reference:'',
    madeBy:'',
}
const initialRange = [0,0,0,0]
const initialDataModal = {
    open: false,
    payload: null
}

const initialDirtyDataState = {
    loading: false,
    data: initialDataState,
    meta: initialMetaState,
    comments: initialCommentState,
    modal: initialDataModal,
    range:initialRange,
    emphasisTarget: null,
    safeMask: null,
    error: null
}
const initialColor = null
const initialTheme = _.cloneDeep(THEME.LIGHT)
const initialAppearanceState = {
    color: initialColor, // set init value null due to it has dependency on template type
    theme: initialTheme
}
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
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    loading: true,
                    error: null,
                }
            }
        case actionType.CHART_DATA_POST_SUCCESS:
            const {data, range} = action.payload
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    data,
                    range,
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
                        emphasisTarget: [action.payload.x, action.payload.x, action.payload.y, action.payload.y]
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
                        if(range[0]>e[0] || e[1]>range[1]
                            || range[2]>e[2] || e[3]>range[3]){
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
        case actionType.DATA_MODAL_OPEN:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    modal:{
                        ...state.dirtyData.modal,
                        open: true,
                        payload: action.payload
                    }
                }
            }
        case actionType.DATA_MODAL_CLOSE:
            return {
                ...state,
                dirtyData: {
                    ...state.dirtyData,
                    modal:{
                        ...state.dirtyData.modal,
                        open: false,
                        payload: null
                    }
                }
            }
        case actionType.MASK_SAVE:
            return {
                ...state,
                dirtyData:{
                    ...state.dirtyData,
                    safeMask: action.payload
                }
            }
        case actionType.MASK_CLEAR:
            return {
                ...state,
                dirtyData:{
                    ...state.dirtyData,
                    safeMask: []
                }
            }
        case actionType.COLOR_SAVE:
            return {
                ...state,
                appearance:{
                    ...state.appearance,
                    color: action.payload
                }
            }
        case actionType.COLOR_CLEAR:
            return {
                ...state.appearance,
                color: initialColor
            }
        case actionType.THEME_SAVE:
            return {
                ...state,
                appearance:{
                    ...state.appearance,
                    theme: action.payload
                }
            }
        case actionType.THEME_CLEAR:
            return {
                ...state,
                appearance: {
                    ...state.appearance,
                    theme: initialTheme
                }
            }
        /* GLOBAL */
        case actionType.PROCEDURE_CLEAR:
            return initialState
        /* ACTION RELATED TO APPEARANCE SETTINGS */
        default:
            return state;
    }
}

export default procedureManager
