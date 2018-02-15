import authorize from './authorize'
import { storeItem, clearItem } from './storage'
import asyncTest from './asyncTest'
import fetchApi from './fetchApi'
const Api = {
    authorize,
    storeItem,
    clearItem,
    asyncTest,
    fetchApi
}

export default Api
