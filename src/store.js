import {compose, applyMiddleware, createStore } from "redux"
import { createLogger } from 'redux-logger'
import { persistStore } from 'redux-persist'
import rootReducer from './reducers'
import createSagaMiddleware from 'redux-saga';

import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(
            sagaMiddleware,
            createLogger(),
        ),
    )
)

sagaMiddleware.run(rootSaga)

persistStore(store)
export default store
