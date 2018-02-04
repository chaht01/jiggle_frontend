import { delay } from 'redux-saga'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import * as actionType from './types'


export function* fetchTemplatesThumbnailsAsync() {
    yield call(delay, 1000)
    const thumbnails = yield Array.from(Array(20).keys())
    yield put({
        type: actionType.TEMPLATES_THUMBNAILS_FETCH_SUCCESS,
        payload: thumbnails
    })
}

export function* watchFetchTemplatesThumbnailsAsync() {
    yield takeEvery(actionType.TEMPLATES_THUMBNAILS_FETCH_REQUEST, fetchTemplatesThumbnailsAsync)
}
