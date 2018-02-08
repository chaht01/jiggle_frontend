import * as actionType from '../../sagas/types'

const initialTemplateState = {
    loading: false,
    index: 0,
    error: null,
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
const initialMetaState = {
    placeholder: '빈 차트 제목',
    title: '',
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
    range:initialRange,
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
                    index: action.payload
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
                    config: null
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

        /* GLOBAL */
        case actionType.PROCEDURE_CLEAR:
            return initialState
        /* ACTION RELATED TO APPEARANCE SETTINGS */
        default:
            return state;
    }
}

export default procedureManager
