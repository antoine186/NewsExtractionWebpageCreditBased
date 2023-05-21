import React, { Component } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { stripePublicKey, basicSubscriptionPriceId } from '../utils/stripe_configuration/StripeConfig'
import { TouchableOpacity, Text, View, Image, TextInput } from 'react-native'
import styles from '../utils/style_guide/AccountDetailsInputPageStyle'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import CheckoutForm from '../components/atoms/CheckoutForm'
import TopBar from '../components/molecules/TopBar'
import { basicSubscriptionPricePerMonth } from '../utils/essential_numbers_strings/PaymentNumbersStrings'
import { api, getSubscriptionStatus, getSubscriptionId, subscriptionCreate, retrieveSubscriptionDetails, getStripeCustomerId } from '../utils/backend_configuration/BackendConfig'
import { setAccountData } from '../store/Slices/AccountDataSlice'
import { setstripeSubscription, clearstripeSubscription } from '../store/Slices/StripeSubscriptionSlice'
import { setValidSubscription } from '../store/Slices/ValidSubscriptionSlice'
// import { setupintentCreation } from '../utils/backend_configuration/BackendConfig'
// import { getStripeCustomerId } from '../utils/backend_configuration/BackendConfig'
// import { setSetupIntentState } from '../store/Slices/SetupIntentSlice'
// import { clearSetupIntentState } from '../store/Slices/SetupIntentSlice'
import { deleteSubscription } from '../utils/backend_configuration/BackendConfig'
import { setStripeCustomerId, clearStripeCustomerId } from '../store/Slices/StripeCustomerIdSlice'
import { setAmendPayment, clearAmendPayment } from '../store/Slices/AmendPaymentSlice'
import { clearSubscriptionStoredState } from '../store/Slices/SubscriptionStoredSlice'

class PaymentPage extends Component {
  constructor (props) {
    super(props)

    if (this.props.stripeSubscription.stripeSubscription.payload !== undefined) {
      console.log('Clearing subscription on payment page start')
      this.props.clearstripeSubscription()
    }

    /*
    if (this.props.setupIntentState.setupIntentState !== undefined) {
      if (this.props.setupIntentState.setupIntentState.payload !== undefined) {
        console.log('Clearing setup intent on payment page start')
        this.props.clearSetupIntentState()
      }
    } */

    this.props.clearStripeCustomerId()
    this.props.clearSubscriptionStoredState()

    this.props.clearAmendPayment()

    const stripePromise = loadStripe(stripePublicKey)

    this.state = {
      stripePromise,
      subscriptionCreationFailed: false
    }

    if (this.props.accountData.accountData.payload !== undefined) {
      api.post(getStripeCustomerId, {
        username: this.props.accountData.accountData.payload.emailAddress
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          this.props.setStripeCustomerId(response.data.responsePayload)
        }
      }
      )

      api.post(retrieveSubscriptionDetails, {
        username: this.props.accountData.accountData.payload.emailAddress
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Found existing subscription')
          this.props.setstripeSubscription(response.data.responsePayload)
          this.props.setValidSubscription(true)

          api.post(getSubscriptionStatus, {
            stripeSubscriptionId: response.data.responsePayload.stripe_subscription_id
          }, {
            withCredentials: true
          }
          ).then(response => {
            if (response.data.operation_success) {
              console.log(response.data.responsePayload.stripe_subscription_status)
              if (response.data.responsePayload.stripe_subscription_status === 'active' ||
                response.data.responsePayload.stripe_subscription_status === 'trialing') {
                console.log('In payment amendment mode')

                // this.props.setValidSubscription(true)
                this.props.setAmendPayment()
              } else {
                console.log('Subscription cancelled or expired. Creating a new subscription.')

                api.post(getStripeCustomerId, {
                  username: this.props.accountData.accountData.payload.emailAddress
                }, {
                  withCredentials: true
                }
                ).then(response => {
                  if (response.data.operation_success) {
                    this.props.setStripeCustomerId(response.data.responsePayload)
                    this.props.setValidSubscription(false)
                    this.createMissingSubscription()
                  }
                }
                )
              }
            } else { /* empty */ }
          }
          )
        } else {
          console.log('No existing subscription')

          api.post(getStripeCustomerId, {
            username: this.props.accountData.accountData.payload.emailAddress
          }, {
            withCredentials: true
          }
          ).then(response => {
            if (response.data.operation_success) {
              this.props.setStripeCustomerId(response.data.responsePayload)
              this.props.setValidSubscription(false)
              this.createMissingSubscription()
            }
          }
          )
        }
      }
      )
    }
  }

  createMissingSubscription () {
    if (this.props.stripeCustomerId.stripeCustomerId.payload !== undefined) {
      api.post(subscriptionCreate, {
        priceId: basicSubscriptionPriceId,
        stripeCustomerId: this.props.stripeCustomerId.stripeCustomerId.payload.stripe_customer_id,
        emailAddress: this.props.accountData.accountData.payload.emailAddress
      }, {
        withCredentials: true
      }
      ).then(response => {
        if (response.data.operation_success) {
          console.log('Created subscription')
          this.props.setstripeSubscription(response.data.responsePayload)
        } else {
          console.log('Subscription creation failed')
          console.log(response.data.error_message)
          this.setState({ subscriptionCreationFailed: true })
        }
      }
      )
    } else {
      console.log('Forced updated the page')
      this.forceUpdate()
    }
  }

  cancelExistingSubscription () {
    api.post(deleteSubscription, {
      username: this.props.accountData.accountData.payload.emailAddress,
      stripeSubscriptionId: this.props.stripeSubscription.stripeSubscription.payload.stripe_subscription_id
    }, {
      withCredentials: true
    }
    ).then(response => {
      if (response.data.operation_success) {
        console.log('Deleted existing subscription. Creating a new subscription')
        api.post(getStripeCustomerId, {
          username: this.props.accountData.accountData.payload.emailAddress
        }, {
          withCredentials: true
        }
        ).then(response => {
          if (response.data.operation_success) {
            console.log('Subscription deleted successfully')
            this.props.setStripeCustomerId(response.data.responsePayload)
            this.props.setValidSubscription(false)
            this.props.clearAmendPayment()
            this.createMissingSubscription()
          }
        }
        )
      } else {
        console.log('Subscription deletion failed')
        console.log(response.data.error_message)
      }
    }
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <TopBar settingsEnabled={this.props.userSession.validated} />
        <View style={styles.container}>
          <Helmet>
            <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1.0" />
          </Helmet>
          <Text style={styles.titleText}>
            Your Payment Details - {basicSubscriptionPricePerMonth} USD/Month Subscription
          </Text>
          {(this.props.userSession.validated && !this.props.validSubscription.validSubscription.payload) &&
            <Text style={styles.titleText2}>
              You don't have an active subscription.
              Please add your payment details to get a {basicSubscriptionPricePerMonth} USD per month subscription
            </Text>
          }
          {(this.props.userSession.validated && this.props.validSubscription.validSubscription.payload) &&
            <Text style={styles.titleText2}>
              You have an active subscription.
              You can cancel your subscription here to create a new one.
            </Text>
          }
          {!this.state.subscriptionCreationFailed && !this.props.validSubscription.validSubscription.payload && !this.props.amendPaymentState.amendPaymentState && this.props.stripeSubscription.stripeSubscription.payload !== undefined &&
            <View style={styles.stripeCardElement}>
              <br></br>
              <br></br>
              <br></br>
              <Elements
                stripe={this.state.stripePromise}
                options={{ clientSecret: this.props.stripeSubscription.stripeSubscription.payload.client_secret }}
                key={this.props.stripeSubscription.stripeSubscription.payload.client_secret}
              >
                <CheckoutForm amendPaymentMethod={false} />
              </Elements>
            </View>
          }
          {/*! this.state.subscriptionCreationFailed && this.props.validSubscription.validSubscription.payload && this.props.amendPaymentState.amendPaymentState && this.props.stripeSubscription.stripeSubscription.payload !== undefined && this.props.setupIntentState.setupIntentState.payload !== undefined &&
            <View style={styles.stripeCardElement}>
              <Elements
                stripe={this.state.stripePromise}
                options={{
                  setup_future_usage: 'off_session',
                  mode: 'setup',
                  currency: 'usd'
                }}
                key={this.props.setupIntentState.setupIntentState.payload.client_secret}
              >
                <CheckoutForm amendPaymentMethod={true} clientSecret={this.props.setupIntentState.setupIntentState.payload.client_secret} />
              </Elements>
            </View>
          */}
          {this.props.amendPaymentState.amendPaymentState &&
            <TouchableOpacity style={styles.button} onPress={this.cancelExistingSubscription.bind(this)}>
              <Text>Cancel Subscription</Text>
            </TouchableOpacity>
          }
          {this.state.subscriptionCreationFailed &&
            <Text style={styles.errorText}>
              There was a processing error whilst creating your subscription.
              Please refresh your page or try again in a few moments.
            </Text>
          }
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    stripeSubscription: state.stripeSubscription,
    userSession: state.userSession,
    accountData: state.accountData,
    stripeCustomerId: state.stripeCustomerId,
    validSubscription: state.validSubscription,
    amendPaymentState: state.amendPaymentState
    // setupIntentState: state.setupIntentState
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAccountData: (value) => dispatch(setAccountData(value)),
    setstripeSubscription: (value) => dispatch(setstripeSubscription(value)),
    setValidSubscription: (value) => dispatch(setValidSubscription(value)),
    setAmendPayment: () => dispatch(setAmendPayment()),
    clearstripeSubscription: () => dispatch(clearstripeSubscription()),
    clearAmendPayment: () => dispatch(clearAmendPayment()),
    setStripeCustomerId: (value) => dispatch(setStripeCustomerId(value)),
    clearStripeCustomerId: () => dispatch(clearStripeCustomerId()),
    // setSetupIntentState: (value) => dispatch(setSetupIntentState(value)),
    // clearSetupIntentState: () => dispatch(clearSetupIntentState())
    clearSubscriptionStoredState: () => dispatch(clearSubscriptionStoredState())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage)
