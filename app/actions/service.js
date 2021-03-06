import axios from 'axios'

export const GET_ALL_SERVICES_REQUEST = 'GET_ALL_SERVICES_REQUEST'
export const GET_ALL_SERVICES_SUCCESS = 'GET_ALL_SERVICES_SUCCESS'
export const GET_ALL_SERVICES_FAILURE = 'GET_ALL_SERVICES_FAILURE'

export const LOGOUT = 'LOGOUT'

import UrlBuilder from './util/urlBuilder.js'

const urlBuilder = new UrlBuilder()

const parseError = (res) => (res.data && res.data.error) || (res.response && res.response.data && res.response.data.error) || (res.message)

export const getAllServices = () => dispatch => {
    dispatch(getAllServicesRequest())
    return new Promise((resolve, reject) => {
        axios.get(urlBuilder.build('services'))
            .then(res => {
                dispatch(getAllServicesSuccess(res.data))
                resolve(res.data)
            })
            .catch(res => {
                const e = parseError(res)
                dispatch(getAllServicesFailure(e))
                reject(e)
            })
    })
}

const getAllServicesRequest = () => ({
    type: GET_ALL_SERVICES_REQUEST
})

const getAllServicesSuccess = services => ({
    type: GET_ALL_SERVICES_SUCCESS,
    services
})

const getAllServicesFailure = error => ({
    type: GET_ALL_SERVICES_FAILURE,
    error
})