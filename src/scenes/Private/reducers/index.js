import { combineReducers } from 'redux'

import templatesThumbnails from './templatesThumbnails'
import AsapReducer from '../scenes/Asap/reducers'

const PrivateReducer = combineReducers({
    templatesThumbnails,
    AsapReducer
})

export default PrivateReducer




