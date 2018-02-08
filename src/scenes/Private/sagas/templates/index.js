import { delay } from 'redux-saga'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'

import funnyguy from '../../../../assets/images/thumbs/funnyguy.jpeg'
import cryinggirl from '../../../../assets/images/thumbs/cryinggirl.jpeg'
import chairman from '../../../../assets/images/thumbs/chairman.jpeg'
import greenboy from '../../../../assets/images/thumbs/greenboy.jpeg'
import templestay from '../../../../assets/images/thumbs/templestay.jpeg'
import webtoonslave from '../../../../assets/images/thumbs/webtoonslave.jpeg'
import animate from '../../../../assets/images/thumbs/example.gif'
import animate_thumb from '../../../../assets/images/thumbs/example_thumb.png'

import * as actionType from './types'


export function* fetchTemplatesThumbnailsAsync() {
    yield call(delay, 1000)
    const thumbnails = yield Array.from(Array(20).keys())
    thumbnails[0] = {
        thumb: funnyguy,
        desc: '음악.. 그것은 유일하게 허락된 마약..',
        dummy: true
    }
    thumbnails[1] = {
        thumb: cryinggirl,
        desc: '싫어! 너가해!',
        dummy: true
    }
    thumbnails[2] = {
        thumb: chairman,
        desc: '여러분, 우리, 함께',
        dummy: true
    }
    thumbnails[3] = {
        thumb: greenboy,
        desc: '그린가이맨',
        dummy: true
    }
    thumbnails[4] = {
        thumb: templestay,
        desc: '파계승 2명',
        dummy: true
    }
    thumbnails[5] = {
        thumb: animate_thumb,
        animate: animate,
        desc: '마지막 요소를 강조합니다',
        dummy: false
    }
    thumbnails[6] = {
        thumb: webtoonslave,
        desc: '웹툰 작가(노예)',
        dummy: true
    }
    yield put({
        type: actionType.TEMPLATES_THUMBNAILS_FETCH_SUCCESS,
        payload: thumbnails
    })
}

export function* watchFetchTemplatesThumbnailsAsync() {
    yield takeEvery(actionType.TEMPLATES_THUMBNAILS_FETCH_REQUEST, fetchTemplatesThumbnailsAsync)
}
