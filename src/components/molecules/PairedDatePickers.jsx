import React from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import CappedDatePicker from '../atoms/CappedDatePicker'
import DateFormatter from '../../utils/DateFormatter'

class PairedDatePickers extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      minDate: this.props.minDate,
      posteriorMinDate: this.props.posteriorMinDate
    }
  }

  onChange (event) {
    const selectedDate = new Date(event.target.value)
    this.setState({ posteriorMinDate: DateFormatter(selectedDate) })
  }

  render () {
    return (
        <View>
            <Text>
              From:
            </Text>
            <CappedDatePicker minDate={this.state.minDate} onChange={this.onChange.bind(this)} />
            <label htmlFor="to_date" className="col-form-label">
              To:
            </label>
            <CappedDatePicker minDate={this.state.posteriorMinDate} />
        </View>
    )
  }
}

PairedDatePickers.propTypes = {
  minDate: PropTypes.string,
  posteriorMinDate: PropTypes.string
}

PairedDatePickers.defaultProps = {
  minDate: '2006-01-01',
  posteriorMinDate: '2006-01-01'
}

export default PairedDatePickers
