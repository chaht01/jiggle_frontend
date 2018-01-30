import * as axios from 'axios'
import fetchApi from '../fetchApi'

const authorize = (user, password) => {
    return () => fetchApi('/auth/', {user, password}, 'post')
}

export default authorize
