import { api, stripeCustomerCreate, deleteAccount } from '../backend_configuration/BackendConfig'

function StripeCustomerCreate (accountCreationData, setStripeCustomerId, goToPaymentGrabber, errorCreateStripeCustomerGrabber) {
  api.post(stripeCustomerCreate, {
    accountCreationData
  }, {
    withCredentials: true
  }
  ).then(response => {
    if (response.data.operation_success) {
      setStripeCustomerId(response.data.responsePayload)
      goToPaymentGrabber(true)
    } else {
      console.log('Failed to create the stripe customer id')
      errorCreateStripeCustomerGrabber(true)
      api.post(deleteAccount, {
        accountCreationData
      }, {
        withCredentials: true
      }
      )
    }
  }
  )
}

export default StripeCustomerCreate
