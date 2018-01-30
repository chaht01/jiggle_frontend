import React from 'react'
import * as actionType from '../../sagas/templates/types'

const templatesThumbnails = (state={
    list:[],
    loading: false,
    error: null
}, action) => {
    switch (action.type){
        case actionType.TEMPLATES_THUMBNAILS_FETCH_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case actionType.TEMPLATES_THUMBNAILS_FETCH_SUCCESS:
            return {
                list: action.payload,
                loading: false,
                error: null
            }
        case actionType.TEMPLATES_THUMBNAILS_FETCH_FAILURE:
            return {
                list: [],
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

export default templatesThumbnails
