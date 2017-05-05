import { createDeliveryContract, getAllDeliveryContracts, signDeliveryContract } from '../src/deliveryContract'
import store from '../store'

export const GET_ALL_DELIVERIES_REQUEST = 'GET_ALL_DELIVERIES_REQUEST'
export const GET_ALL_DELIVERIES_SUCCESS = 'GET_ALL_DELIVERIES_SUCCESS'
export const GET_ALL_DELIVERIES_FAILURE = 'GET_ALL_DELIVERIES_FAILURE'

export const CREATE_DELIVERY_REQUEST = 'CREATE_DELIVERY_REQUEST'
export const CREATE_DELIVERY_SUCCESS = 'CREATE_DELIVERY_SUCCESS'
export const CREATE_DELIVERY_FAILURE = 'CREATE_DELIVERY_FAILURE'

export const SIGN_DELIVERY_REQUEST = 'SIGN_DELIVERY_REQUEST'
export const SIGN_DELIVERY_SUCCESS = 'SIGN_DELIVERY_SUCCESS'
export const SIGN_DELIVERY_FAILURE = 'SIGN_DELIVERY_FAILURE'

export const getAllDeliveries = () => dispatch => {
    const deliveryCreatorAddress = store.getState().user.user.service.deliveryCreatorAddress
    dispatch(getAllDeliveriesRequest())
    return new Promise((resolve, reject) => {
        getAllDeliveryContracts(deliveryCreatorAddress)
            .then(d => {
                dispatch(getAllDeliveriesSuccess(d))
                resolve(d)
            })
            .catch(e => {
                dispatch(getAllDeliveriesFailure(e))
                reject(e)
            })
    })
}

// js Date.getTime is ms, Solidity epoch is seconds
function dateToSeconds(date) {
    return Math.floor(new Date(date).getTime() / 1000)
}

export const createDelivery = (delivery, parcelAddress) => dispatch => {
    const startDate = dateToSeconds(delivery.canStartAfter)
    const deadline = dateToSeconds(delivery.deliveryDeadline)
    const minutes = Math.ceil((deadline - startDate) / 60)
    const depositETH = delivery.deposit ? parseFloat(delivery.deposit.replace(',', '.')) : 0
    
    const deliveryCreatorAddress = store.getState().user.user.service.deliveryCreatorAddress
    dispatch(createDeliveryRequest())
    
    // Timeout is a hack for a bug, where if deliveries are fetched right after creating a new one, the new one is not returned
    return new Promise((resolve, reject) => {
        createDeliveryContract(parcelAddress, delivery.senderPostbox, delivery.receiverPostbox, delivery.receiverAddress, 0, depositETH, startDate, minutes, deliveryCreatorAddress)
            .then(event => setTimeout(() => {
                dispatch(createDeliverySuccess())
                resolve(event)
            }), 5000) // TODO: remove
            .catch(error => {
                dispatch(createDeliveryFailure(error))
                reject(error)
            })
    })
}

export const signDelivery = (parcelAddress, deliveryAddress, userFee, deflationRate, temperaturePenalty) => dispatch => {
    dispatch(signDeliveryRequest())
    return new Promise((resolve, reject) => {
        signDeliveryContract(parcelAddress, deliveryAddress, userFee, deflationRate, temperaturePenalty)
        // Timeout is a hack for a bug, where if deliveries are fetched right after creating a new one, the new one is not returned
        // TODO: remove
            .then(d => setTimeout(() => {
                dispatch(signDeliverySuccess(d))
                resolve(d)
            }), 5000)
            .catch(e => {
                dispatch(signDeliveryFailure(e))
                reject(e)
            })
    })
}


const getAllDeliveriesRequest = () => ({
    type: GET_ALL_DELIVERIES_REQUEST
})

const getAllDeliveriesSuccess = list => ({
    type: GET_ALL_DELIVERIES_SUCCESS,
    list
})

const getAllDeliveriesFailure = error => ({
    type: GET_ALL_DELIVERIES_FAILURE,
    error
})

const createDeliveryRequest = () => ({
    type: CREATE_DELIVERY_REQUEST
})

const createDeliverySuccess = () => ({
    type: CREATE_DELIVERY_SUCCESS
})

const createDeliveryFailure = error => ({
    type: CREATE_DELIVERY_FAILURE,
    error
})

const signDeliveryRequest = () => ({
    type: SIGN_DELIVERY_REQUEST
})

const signDeliverySuccess = delivery => ({
    type: SIGN_DELIVERY_SUCCESS,
    delivery
})

const signDeliveryFailure = error => ({
    type: SIGN_DELIVERY_FAILURE,
    error
})
