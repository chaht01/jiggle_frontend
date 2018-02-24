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
        case 'Single Focus Bar':
            return TEMPLATE.BAR_EMPHASIS
        case 'Horizontal Single Focus Bar':
            return TEMPLATE.BAR_HORIZONTAL_EMPHASIS
        case 'Single Not Focus Bar':
            return TEMPLATE.BAR
        case 'Horizontal Single Not Focus Bar':
            return TEMPLATE.BAR_HORIZONTAL
        case 'Grouped Bar':
            return TEMPLATE.BAR_GROUPED
        case 'Small Data Line':
            return TEMPLATE.LINE
        case 'Large Data Line':
            return TEMPLATE.LINE_DENSE
    }
}

export function* fetchTemplatesThumbnailsAsync() {
    try{
        const res = yield call(Api.fetchApi, ['/template/all'])
        let thumbnails = res.data
        thumbnails = thumbnails.map((template) => {
            return Object.assign({}, template, {
                type: getTypeFromName(template.name),
                placeholder: mergeDataToDummy([
                            ['', '삼성', 'sk하이닉스'],
                            ['2014', '1', '4'],
                            ['2015', '2', '5'],
                            ['2016', '3', '6'],
                        ])
            })
        })

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
