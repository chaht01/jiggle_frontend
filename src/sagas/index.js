import { delay } from 'redux-saga'
import { all, call, fork, put, take, cancel, cancelled } from 'redux-saga/effects'
import * as actionType from './types'
import Api from '../config/Api'
import { watchFetchTemplatesThumbnailsAsync } from '../scenes/Private/sagas/templates'
import { watchFetchTemplateAsync, watchSaveDataAsync, watchSaveMetaAsync } from '../scenes/Private/scenes/Asap/sagas'


function* authorize(user, password) {
    try {
        // const token = yield call(Api.authorize, user, password)
        const token = yield call(Api.asyncTest)
        yield call(delay, 1000)
        yield put({
            type: actionType.LOGIN_SUCCESS,
            payload: token
        })
        yield call(Api.storeItem, {token})
        return token
    } catch (error) {
        yield put({
            type: actionType.LOGIN_FAILURE,
            payload: error
        })
    } finally {
        if (yield cancelled()) {
            //...
        }
    }
}

function* acceptAuthReq() {
    try {
        const {user, password} = yield take(actionType.LOGIN_REQUEST)
        // execute validation process about plain 'user', 'password'
        const task = yield fork(authorize, user, password)
    } catch (error) {
        yield put({
            type: actionType.LOGIN_FAILURE,
            payload: error
        })
    } finally {
        if (yield cancelled()){
            //...
        }
    }

}

function* loginFlow() {
    while(true){
        const task = yield fork(acceptAuthReq)
        const action = yield take([actionType.LOGOUT, actionType.LOGIN_FAILURE])
        if (action.type == actionType.LOGOUT) {
            yield cancel(task)
        }
        yield call(Api.clearItem, 'token')
    }

}



export default function* rootSaga() {
    yield all([
        loginFlow(),
        watchFetchTemplatesThumbnailsAsync(),
        watchFetchTemplateAsync(),
        watchSaveDataAsync(),
        watchSaveMetaAsync(),
    ])
}
