import React, {Component} from 'react'
import {Router, Route, IndexRedirect} from 'react-router'

import App from './components/App'

import ParcelsList from './components/Parcel/ParcelList'
import ParcelsShow from './components/Parcel/ParcelShow'
import ParcelsCreate from './components/Parcel/ParcelCreate'
import ParcelsTrack from './components/Parcel/ParcelTrack'

import DeliveryCreate from './components/Delivery/DeliveryCreate'

import PostboxesCreate from './components/Postbox/PostboxCreate'

import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import store, {history} from './store.js'

import {getParcel, getAllParcels, getEvents, getPhotos} from './actions/parcel'
import {getAllServices} from './actions/service'
import {getAllDeliveries, getMaxMinutesPeriodContract} from './actions/delivery'
import {getAllPostboxes} from './actions/postbox'

export default class ReactRouter extends Component {
    
    static requireAuth(nextState, replace) {
        if (!store.getState().user || !store.getState().user.user) {
            replace('/login')
        }
    }
    
    render() {
        return (
            <Router history={history}>
                <Route path="/" component={App}>
                    <Route path="/signup" component={SignupPage} onEnter={() => store.dispatch(getAllServices())}/>
                    <Route path="/login" component={LoginPage}/>
                    <Route path="/" onEnter={ReactRouter.requireAuth}>
                        <Route path="/parcels" component={ParcelsList} onEnter={() =>
                            store.dispatch(getAllParcels())
                        }/>
                        <Route path="/parcels/create" component={ParcelsCreate}/>
                        <Route path="/parcels/:address" component={ParcelsShow} onEnter={location => {
                            const deliveryCreatorAddress = store.getState().user.user.service.deliveryCreatorAddress
                            store.dispatch(getParcel(location.params.address))
                            store.dispatch(getAllDeliveries(deliveryCreatorAddress))
                            store.dispatch(getAllPostboxes())
                        }}/>
                        <Route path="/parcels/:address/track" component={ParcelsTrack} onEnter={location => {
                            store.dispatch(getParcel(location.params.address))
                            store.dispatch(getEvents(location.params.address))
                            store.dispatch(getPhotos(location.params.address))
                        }}/>
                        <Route path="/parcels/:address/deliveries/create" components={DeliveryCreate} onEnter={location => {
                            const deliveryCreatorAddress = store.getState().user.user.service.deliveryCreatorAddress
                            store.dispatch(getParcel(location.params.address))
                            store.dispatch(getAllPostboxes())
                            store.dispatch(getMaxMinutesPeriodContract(deliveryCreatorAddress))
                        }}/>
                        <Route path="/postboxes/create" components={PostboxesCreate}/>
                    </Route>
                    <IndexRedirect to="/parcels"/>
                </Route>
            </Router>
        )
    }
}