import * as axios from "axios";
import apiConfig from "../config"

const fetchApi = (endPoint, payload={}, method='get', headers={}, contentType='application/json') => {
    const accessToken = sessionStorage.getItem('token');
    return axios({
        method: method,
        url: `${apiConfig.url}${endPoint}`,
        headers: accessToken ? {
            'Authorization' : 'JWT ' + accessToken,
            'content-type' : contentType
        } : headers,
        data: payload
    })
}

export default fetchApi
