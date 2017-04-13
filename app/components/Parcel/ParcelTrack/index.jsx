import React, {Component, PropTypes} from 'react'
import {Row, Col, Panel, Table} from 'react-bootstrap'
import {connect} from 'react-redux'

class ParcelTrack extends Component {
    render() {
        return (
            <Row>
                <Col xs={12}>
                    <h1>{this.props.parcel.name || ''}</h1>
                </Col>
                <Col xs={12} md={6}>
                    <Panel header="Event log">
                        <Table>
                            <thead>
                            <tr>
                                <th>Event</th>
                                <th>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Sent</td>
                                <td>2017-03-15 14:30:31</td>
                            </tr>
                            <tr>
                                <td>Taken</td>
                                <td>2017-03-15 14:31:31</td>
                            </tr>
                            <tr>
                                <td>Delivered</td>
                                <td>1 hour ago</td>
                            </tr>
                            <tr>
                                <td>Photo added</td>
                                <td>5 minutes ago</td>
                            </tr>
                            </tbody>
                        </Table>
                    </Panel>
                </Col>
                <Col xs={12} md={6}>
                    <Panel header="Parcel location">
                        <streamr-map url={'https://eth.streamr.com/api/v1/canvases/Zac64v1SQzy7QlHIAm6ecA4a-0NYa5S2ShGkfSQazLAw/modules/1/keys/' + this.props.params.address + '/modules/2'} />
                    </Panel>
                </Col>
                <Col xs={12}>
                    <Panel header="Parcel metrics">
                        <streamr-chart url={'https://eth.streamr.com/api/v1/canvases/Zac64v1SQzy7QlHIAm6ecA4a-0NYa5S2ShGkfSQazLAw/modules/1/keys/' + this.props.params.address + '/modules/1'} />
                    </Panel>
                </Col>
            </Row>
        )
    }
}

const {object} = PropTypes
ParcelTrack.propTypes = {
    user: object,
    params: object,
    parcel: object
}

const mapStateToProps = ({user, parcels}, props) => ({
    user: user.user,
    parcel: parcels.list ? (parcels.list.find(i => i.address === props.params.address) || {}) : {}
})

export default connect(mapStateToProps, null)(ParcelTrack)