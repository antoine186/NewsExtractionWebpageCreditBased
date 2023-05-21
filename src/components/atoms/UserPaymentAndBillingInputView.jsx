import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import styles from '../../utils/style_guide/AccountDetailsInputPageStyle'
import CardInput from './CardInput'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { stripePublicKey } from '../../utils/stripe_configuration/StripeConfig'

class UserPaymentAndBillingInputView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      stripePromise: loadStripe(stripePublicKey)
    }
  }

  render () {
    return (
        <View style={styles.subcontainer}>
            <Text style={styles.titleText}>
                Payment Details
            </Text>
            <br></br>
            <br></br>
            <View style={styles.stripeCardElement}>
                <Elements stripe={this.state.stripePromise}>
                    <CardInput />
                </Elements>
            </View>
        </View>
    )
  }
}

export default UserPaymentAndBillingInputView
