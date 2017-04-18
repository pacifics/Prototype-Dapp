import React, {Component, PropTypes} from 'react'
import {Row, Col, Button, Panel, Table} from 'react-bootstrap'
import {Link} from 'react-router'
import FontAwesome from 'react-fontawesome'
import {DateLabel, AddressLabel} from '../../Util/Labels'
import {connect} from 'react-redux'
import commonStyles from '../../../commonStyles.pcss'

class ParcelShow extends Component {
    render() {
        return (
            <Row>
                <Col xs={8}>
                    <h1>{this.props.parcel.name}</h1>
                </Col>
                <Col xs={4} className={commonStyles.buttonContainer}>
                    <Link to={`/parcels/${this.props.params.address}/track`} className="pull-right">
                        <Button>
                            <FontAwesome name="search" /> Track Parcel
                        </Button>
                    </Link>
                </Col>
                <Col xs={12}>
                    <Row>
                        <Col xs={12} md={6}>
                            <Row>
                                <Col xs={4}>
                                    <label>Description</label>
                                </Col>
                                <Col xs={8}>
                                    <span>{this.props.parcel.description}</span>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={12} md={6}>
                            <Row>
                                <Col xs={4}>
                                    <label>Owner</label>
                                </Col>
                                <Col xs={8}>
                                    <span>{this.props.parcel.Owner}</span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={2}>
                            <label>Current holder</label>
                        </Col>
                        <Col xs={4}>
                            <span>{this.props.parcel.TransmittedTo}</span>
                        </Col>
                        <Col xs={2}>
                            <label>Temperature limit</label>
                        </Col>
                        <Col xs={4}>
                            <span>{this.props.parcel.TemperatureLimit}</span>
                        </Col>
                    </Row>
                </Col>
                
                <Col xs={8}>
                    <h2>Deliveries</h2>
                </Col>
                <Col xs={4} className={commonStyles.buttonContainer}>
                    <Link to={`/parcels/${this.props.params.address}/deliveries/create`} className="pull-right">
                        <Button>
                            <FontAwesome name="plus"/> New Delivery
                        </Button>
                    </Link>
                </Col>
                <Col xs={12}>
                    <Panel>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Start</th>
                                <th>Deadline</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/*TODO: change after solidity-getters:getIndexedPropAt works*/}
                            {this.props.deliveries.map(d => (
                                <tr key={d[1]}>
                                    <td>
                                        <AddressLabel address={d[3]} name={(this.props.postboxes.find(i => i.address === d[3]) || {}).name}/>
                                    </td>
                                    <td>
                                        <AddressLabel address={d[4]} name={(this.props.postboxes.find(i => i.address === d[4]) || {}).name}/>
                                    </td>
                                    <td>
                                        <DateLabel date={d[6]} />
                                    </td>
                                    <td>
                                        <DateLabel date={d[7]} />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Panel>
                </Col>
            </Row>
        )
    }
}

const {object, array, func} = PropTypes
ParcelShow.propTypes = {
    user: object,
    params: object,
    deliveries: array,
    parcel: object,
    dispatch: func,
    postboxes: array
}

const mapStateToProps = ({user, postboxes, parcels, deliveries}, props) => ({
    user: user.user,
    deliveries: deliveries.list ? deliveries.list.filter(d => d[2] === props.params.address) : [], // TODO: change after solidity-getters:getIndexedPropAt works
    parcel: parcels.list && parcels.list.find(p => p.address === props.params.address) || {},
    postboxes: postboxes.list || []
})

export default connect(mapStateToProps, null)(ParcelShow)