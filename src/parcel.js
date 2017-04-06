/*global web3*/
//import web3 from 'web3'
import {parcelCreatorABI, parcelCreatorAddress/*, parcelABI*/} from './abi'
import {getEventsFromLogs} from './ethCall'
import {promiseDoFor} from './promise-loops'
import _ from 'lodash'

const ParcelCreator = web3.eth.contract(parcelCreatorABI).at(parcelCreatorAddress)

const assertEqual = (a, b) => {
    if (a !== b) {
        console.error(`Expected ${JSON.stringify(a)} === ${JSON.stringify(b)}`)
    }
}

const lastOf = arr => arr[arr.length - 1]

const PARCEL_FETCH_STEP = 10

// parcels are mapped to running id, starting from 1
export const getAllParcelContracts = () => {
    return getParcelsAfter(0)
}

export const getParcelsAfter = startId => {
    return promiseDoFor(parcels => {
        return getParcelRange(startId + 1 + parcels.length, startId + 1 + parcels.length + PARCEL_FETCH_STEP)
    }, lastOf, [].concat.bind([]), []).then(parcels => {
        return _.filter(parcels)
    })
}

const getParcelRange = (startId, endId) => {
    const res = _.range(startId, endId).map(getParcelContract)
    return Promise.all(res)
}

export const getParcelContract = id => {
    return new Promise(done => {
        return ParcelCreator.parcelCreations(id, (err, result) => {
            if (!result) {
                done()
            } else {
                done({
                    id,
                    address: result[0],
                    creator: result[1],
                    name: result[2]
                })
            }
        })
    })
}

/**
 * Create PassParcel contract
 * @param temperatureLimit The maximum temperature in degrees celcius allowed for the parcel
 * @returns {Promise.<string>} created contract's address
 */
export const createParcelContract = (name = 'Parcel', description = 'Unnamed parcel', temperatureLimit = 100, ownerAddress = web3.eth.coinbase) => {
    const ParcelCreator = web3.eth.contract(parcelCreatorABI).at(parcelCreatorAddress)
    console.log('Creating parcel ' + name)  
    return new Promise(done => {
        ParcelCreator.createParcel(ownerAddress, ownerAddress, name, description, temperatureLimit, (err, tx) => {
            if (err) {
                throw err
            }
            const filter = web3.eth.filter('latest')
            filter.watch(function(error, blockHash) {   //eslint-disable-line no-unused-vars
                if (error) {
                    throw error
                }
                web3.eth.getTransactionReceipt(tx, (err, tr) => {
                    if (err) {
                        throw err
                    }
                    if (tr == null) {
                        return      // not yet...
                    }
                    filter.stopWatching()
                    const events = getEventsFromLogs(tr.logs, parcelCreatorABI)
                    const responseArray = events.NewParcel
                    if (!responseArray) {
                        throw new Error('NewParcel event not sent from Solidity')
                    }
                    const response = {
                        creator: responseArray[0],
                        address: responseArray[1],
                        owner: responseArray[2],
                        name: responseArray[3]
                    }
                    assertEqual(response.name, name)
                    assertEqual(response.creator, ownerAddress)
                    assertEqual(response.owner, ownerAddress)
                    console.log('Created parcel', response)
                    done(response)
                })
            })
        })
    })
}
