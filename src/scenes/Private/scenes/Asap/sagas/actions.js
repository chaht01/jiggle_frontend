import * as actionType from './types'

export const selectTemplate = (idx) => {
    return {
        type: actionType.TEMPLATE_SELECT,
        payload: idx
    }
}
