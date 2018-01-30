import { combineReducers } from 'redux'

import * as actionType from '../sagas/types'
import PrivateReducer from '../scenes/Private/reducers'

const userReducer = (state={
    isAuthenticated: false || localStorage.getItem('token'),
    loading: false,
    token: null,
    redirectToReferrer: false,
}, action) => {
    switch (action.type){
        case actionType.LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actionType.LOGIN_SUCCESS:
            return {
                isAuthenticated: true,
                token: action.payload,
                redirectToReferrer: true
            }
        case actionType.LOGOUT:
            return {
                isAuthenticated: false,
                token: null,
                redirectToReferrer: false
            }
        case actionType.UNAUTHORIZED:
            return {
                isAuthenticated: false,
                token: null,
                redirectToReferrer: false
            }
        default:
            return state
    }
}


const appReducer = combineReducers({
    userReducer,
    PrivateReducer
});

const rootReducer = (state, action) => {
    return appReducer(state, action)
}

export default rootReducer
