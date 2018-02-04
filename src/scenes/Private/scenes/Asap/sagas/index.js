import { delay } from 'redux-saga'
import { call, put, takeEvery, takeLatest, take, fork, cancel, cancelled } from 'redux-saga/effects'

import * as actionType from './types'
import {
    fetchTemplate, fetchTemplateSuccess, fetchTemplateFailure,
    saveData, saveDataSuccess, saveDataFailure,
    saveMeta, saveMetaSuccess, saveMetaFailure
} from './actions'


/*** FETCH TEMPLATE ***/
export function* fetchTemplateAsync({payload: idx}) {
    try{
        yield call(delay, 1000)
        const templates = yield {
            data: [
                ["", "2017", "2018", "2019", idx],
                ["서울", "1", "2", "3", "4"],
                ["대전", "3", "3", "2", "1"],
                ["대구", "0", "0", "0", "0"],
                ["부산", "11", "3", "6", "7"],
            ]
        }
        yield put(fetchTemplateSuccess(templates))
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
        yield call(delay, 1000)
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
