import * as actionType from '../../sagas/types'

const procedureManager = (state={
    selectedTemplateIdx: 0,
    dirtyData: {},
    appearance: null
}, action) => {
    switch (action.type) {
        case actionType.TEMPLATE_SELECT:
            return {
                ...state,
                selectedTemplateIdx: action.payload
            }
        default:
            return state;
    }
}

export default procedureManager
