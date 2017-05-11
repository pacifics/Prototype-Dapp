
import React, {Component, PropTypes} from 'react'
import moment from 'moment'
import commonStyles from '../../../commonStyles.pcss'

export class DateLabel extends Component {
    render() {
        return (
            <span>
                {moment(this.props.date, this.props.inputFormat).format(this.props.outputFormat)}
            </span>
        )
    }
}
const {number, string, oneOfType, instanceOf} = PropTypes
DateLabel.propTypes = {
    date: oneOfType([number, string]).isRequired,
    inputFormat: string,
    outputFormat: string
}

DateLabel.defaultProps = {
    inputFormat: 'X',
    outputFormat: 'YYYY-MM-DD HH:mm:ss z'
}

export class AgeLabel extends Component {
    constructor() {
        super()
        this.state = {
            interval: 500,
            now: Date.now()
        }
    }
    componentDidMount() {
        this.timeout = setInterval(() => this.setState({
            now: Date.now()
        }), this.state.interval)
    }
    componentWillUnmount() {
        clearInterval(this.timeout)
    }
    render() {
        const now = moment(this.state.now)
        const then = moment(this.props.date, this.props.inputFormat)
        return (
            <span>
                {moment.duration(now.diff(then)).asDays() < 5 ? moment.duration(now.diff(then)).humanize() : then.format(this.props.outputFormat)}
            </span>
        )
    }
}

AgeLabel.propTypes = {
    date: oneOfType([number, string, instanceOf(Date)]).isRequired,
    inputFormat: string,
    outputFormat: string
}

AgeLabel.defaultProps = {
    inputFormat: 'X',
    outputFormat: 'YYYY-MM-DD HH:mm:ss z'
}

export class AddressLabel extends Component {
    render() {
        return (
            <span title={this.props.address} className={commonStyles.addressLabel}>
                {this.props.name || this.props.address && this.props.address.slice(0, this.props.visibleLength) || '(unknown)'}
            </span>
        )
    }
}

AddressLabel.propTypes = {
    address: string,
    visibleLength: number,
    name: string
}

AddressLabel.defaultProps = {
    visibleLength: Infinity
}
