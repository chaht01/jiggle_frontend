import Api from '../../../../config/Api'
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

import {mergeDataToDummy} from '../../scenes/Asap/sagas/actions'
import {TEMPLATE} from '../../scenes/Asap/config/types'
import * as actionType from './types'


export const getTypeFromName = (name) => {
    switch (name) {
        case 'Single Bar':
            return TEMPLATE.BAR_EMPHASIS
        case 'Line':
            return TEMPLATE.LINE
    }
}

export function* fetchTemplatesThumbnailsAsync() {
    try{
        const res = yield call(Api.fetchApi, ['/template/all'])
        let thumbnails = res.data
        thumbnails = thumbnails.map((template) => {
            return Object.assign({}, template, {type: getTypeFromName(template.name)})
        })
        // thumbnails[0] = Object.assign({}, thumbnails[0], {
        //         thumb: animate_thumb,
        //         animate: animate,
        //         desc: '마지막 요소를 강조합니다',
        //         dummy: false,
        //         placeholder: mergeDataToDummy([
        //             ['', '삼성', 'sk하이닉스'],
        //             ['2014', '1', '4'],
        //             ['2015', '2', '5'],
        //             ['2016', '3', '6'],
        //         ]),
        //         type: TEMPLATE.LINE
        //     })
        // thumbnails[1] = Object.assign({}, thumbnails[0], {
        //     thumb: animate_thumb,
        //     animate: animate,
        //     desc: '마지막 요소를 강조합니다',
        //     dummy: false,
        //     placeholder: mergeDataToDummy([
        //         ['', '삼성', 'sk하이닉스'],
        //         ['2014', '1', '4'],
        //         ['2015', '2', '5'],
        //         ['2016', '3', '6'],
        //     ]),
        //     type: TEMPLATE.BAR_EMPHASIS
        // })
        // const thumbnails = yield Array.from(Array(20).keys())
        // thumbnails[0] = {
        //     thumb: funnyguy,
        //     desc: '음악.. 그것은 유일하게 허락된 마약..',
        //     dummy: true
        // }
        // thumbnails[1] = {
        //     thumb: cryinggirl,
        //     desc: '싫어! 너가해!',
        //     dummy: true
        // }
        // thumbnails[2] = {
        //     thumb: chairman,
        //     desc: '여러분, 우리, 함께',
        //     dummy: true
        // }
        // thumbnails[3] = {
        //     thumb: greenboy,
        //     desc: '그린가이맨',
        //     dummy: true
        // }
        // thumbnails[4] = {
        //     thumb: templestay,
        //     desc: '파계승 2명',
        //     dummy: true
        // }
        // thumbnails[5] = {
        //     thumb: animate_thumb,
        //     animate: animate,
        //     desc: '마지막 요소를 강조합니다',
        //     dummy: false
        // }
        // thumbnails[6] = {
        //     thumb: webtoonslave,
        //     desc: '웹툰 작가(노예)',
        //     dummy: true
        // }
        yield put({
            type: actionType.TEMPLATES_THUMBNAILS_FETCH_SUCCESS,
            payload: thumbnails
        })
    }catch(error){
        yield put({
            type: actionType.TEMPLATES_THUMBNAILS_FETCH_FAILURE,
            payload: error
        })
    }

}

export function* watchFetchTemplatesThumbnailsAsync() {
    yield takeEvery(actionType.TEMPLATES_THUMBNAILS_FETCH_REQUEST, fetchTemplatesThumbnailsAsync)
}
