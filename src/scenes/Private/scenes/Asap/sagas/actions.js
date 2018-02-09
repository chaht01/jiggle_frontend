import * as actionType from './types'

/*** FETCH TEMPLATE ***/
export const fetchTemplate = (idx) => {
    return {
        type: actionType.TEMPLATE_FETCH_REQUEST,
        payload: idx
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

export const saveData = (data) => {
    return {
        type: actionType.CHART_DATA_POST_REQUEST,
        payload: {
            data,
            range: getRangeOfValidData(data)
        },
    }
}

export const saveDataSuccess = () => {
    return {
        type: actionType.CHART_DATA_POST_SUCCESS
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
export const focusTarget = (x, y) => {
    return {
        type: actionType.CHART_CELL_FOCUS,
        payload:{
            x,
            y
        }
    }
}
