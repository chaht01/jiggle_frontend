import Api from '../../../../../config/Api'
import { delay } from 'redux-saga'
import { call, put, takeEvery, takeLatest, take, fork, cancel, cancelled } from 'redux-saga/effects'
import * as actionType from './types'
import {
    fetchTemplate, fetchTemplateSuccess, fetchTemplateFailure,
    saveData, saveDataSuccess, saveDataFailure,
    saveMeta, saveMetaSuccess, saveMetaFailure,
    emphasisTargetValidate,
    commentValidate
} from './actions'


/*** FETCH TEMPLATE ***/
export function* fetchTemplateAsync(action) {
    try{
        yield call(delay, 1000)
        const template = yield action.payload.template
        yield put(fetchTemplateSuccess(template))
    } catch (error){
        yield put(fetchTemplateFailure(error))
    }
}

export function* watchFetchTemplateAsync() {
    yield takeLatest(actionType.TEMPLATE_FETCH_REQUEST, fetchTemplateAsync)
}


/*** SAVE DATA ***/
export function* saveDataAsync({payload: {data, range}}) {
    try{
        yield call(delay, 0) // equivalent to setTimeout with 0
        yield put(emphasisTargetValidate()) //async update emphasis validation
        yield put(commentValidate()) //async update comment validation

        yield call(delay, 1000) // throttle user's event with 1 seconds
        const sliced = yield data.slice(range[2], range[3]+1).map((row)=>row.slice(range[0], range[1]+1))
        yield call(console.log, sliced)
        yield put(saveDataSuccess())

    }catch (error){
        yield put(saveDataFailure(error))

        //retry this
        yield call(delay, 1000)
        yield put(saveData(data))
    }
}

export function* watchSaveDataAsync() {
    yield takeLatest(actionType.CHART_DATA_POST_REQUEST, saveDataAsync)
}


/*** SAVE META ***/
export function* saveMetaAsync({payload: meta}) {
    try{
        yield call(delay, 1000)
        yield put(saveMetaSuccess())

    }catch (error){
        yield put(saveMetaFailure(error))

        //retry this
        yield call(delay, 1000)
        yield put(saveMeta(meta))
    }
}

export function* watchSaveMetaAsync() {
    yield takeLatest(actionType.CHART_META_POST_REQUEST, saveMetaAsync)
}
