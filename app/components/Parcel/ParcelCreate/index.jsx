import React, {Component} from 'react'
import {Row, Col, FormGroup, Form, ControlLabel, FormControl, Button, Breadcrumb} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import {connect} from 'react-redux'
import {replace} from 'react-router-redux'
import {Link} from 'react-router'
import {createParcel} from '../../../actions/parcel'
import serialize from 'form-serialize'

class ParcelCreate extends Component {
    constructor() {
        super()
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(e) {
        e.preventDefault()
        const form = serialize(e.target, {
            hash: true
        })
        this.props.dispatch(createParcel(form)).then(() => { //parcel => {
            // TODO: replaced with return to parcel list page until NewParcel event argument address byte shift issue is resolved
            this.props.dispatch(replace('/parcels'))
            //this.props.dispatch(replace(`/parcels/${parcel.address}`))
        })
    }
    render() {
        return (
            <Row>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">
                        Parcels
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        Create
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Col xs={12}>
                    <h2>New Parcel</h2>
                </Col>
                <Col xs={4}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <ControlLabel>Name</ControlLabel>
                            <FormControl name="name" disabled={this.props.fetching}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl name="description" disabled={this.props.fetching}/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Temperature limit</ControlLabel>
                            <FormControl type="number" name="temperatureLimit" disabled={this.props.fetching}/>
                        </FormGroup>
                        {this.props.fetching ?
                            <Col xs={12}>
                                <FontAwesome
                                    name="spinner"
                                    size="3x"
                                    pulse
                                />
                                <span style={{
                                    padding: '15px'
                                }}>
                                    Creating parcel
                                </span>
                            </Col>
                            :
                            <FormGroup className="pull-right">
                                <Link to="/parcels" style={{
                                    marginRight: '10px'
                                }}>
                                    <Button>
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" bsStyle="primary">
                                    Create
                                </Button>
                            </FormGroup>
                        }
                    </Form>
                </Col>
            </Row>
        )
    }
}

const {object, func, bool} = React.PropTypes
ParcelCreate.propTypes = {
    user: object,
    params: object,
    dispatch: func,
    location: object,
    fetching: bool
}

const mapStateToProps = ({user, parcels}) => ({
    user: user.user,
    fetching: Boolean(parcels.fetching)
})

export default connect(mapStateToProps, null)(ParcelCreate)