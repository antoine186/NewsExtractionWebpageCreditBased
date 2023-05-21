import React from 'react'
import PropTypes from 'prop-types'
import DateFormatter from '../../utils/DateFormatter'

class CappedDatePicker extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      minDate: this.props.minDate,
      maxDate: this.props.maxDate,
      defaultDate: this.props.defaultDate
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.minDate !== this.props.minDate) {
      this.setState({ minDate: this.props.minDate })
    }
  }

  render () {
    return (
        <input type="date" id="date" min={this.state.minDate} max={this.state.maxDate} onChange={this.props.onChange} defaultValue={this.props.defaultDate}/>
    )
  }
}

CappedDatePicker.propTypes = {
  minDate: PropTypes.string.isRequired,
  maxDate: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  defaultDate: PropTypes.string
}

const relevantDate = new Date()
const today = DateFormatter(relevantDate)

relevantDate.setDate(relevantDate.getDate() - 1)
const yesterday = DateFormatter(relevantDate)

CappedDatePicker.defaultProps = {
  maxDate: yesterday,
  defaultDate: yesterday
}

export default CappedDatePicker
