import { delay } from 'redux-saga'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import * as actionType from './types'


export function* fetchTemplatesThumbnailsAsync() {
    yield call(delay, 1000)
    const thumbnails = yield Array.from(Array(10).keys())
    yield put({
        type: actionType.TEMPLATES_THUMBNAILS_FETCH_SUCCESS,
        payload: thumbnails
    })
}

export function* watchFetchTemplatesAsync() {
    yield takeEvery(actionType.TEMPLATES_THUMBNAILS_FETCH_REQUEST, fetchTemplatesThumbnailsAsync)
}


export function* getTemplate(number) {
    yield call(delay, 1000)
    const data = yield {value: number}
    yield put({type: actionType.INSTANCE_FETCH_SUCCESS, payload: data})
}

export function* watchGetTemplateAsync() {
    yield takeEvery(actionType.INSTANCE_FETCH_REQUEST, getTemplate)
}
