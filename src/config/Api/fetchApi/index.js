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
        .then(res=>res)
        .catch(err=>{
            const errState = (err.response!==undefined ? err.response.status : undefined)
            if(errState === undefined){
                return err;
            }else if(errState === 401){
                /**
                 * 401 unauthorized error detect
                 */
                sessionStorage.removeItem('token')
            }
            return err;

        })
}

export default fetchApi
