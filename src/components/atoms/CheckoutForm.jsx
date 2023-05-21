import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import React, { useState } from 'react'

export default function CheckoutForm (props) {
  const stripe = useStripe()
  const elements = useElements()

  const [message, setMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Entered payment form submit handler')

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsProcessing(true)

    console.log(elements)
    let error

    /* if (props.amendPaymentMethod) {
      console.log('In amendment checkout form')

      elements.submit()
      error = await stripe.confirmSetup({
        elements,
        clientSecret: props.clientSecret,
        confirmParams: {
          // Return URL where the customer should be redirected after the SetupIntent is confirmed.
          return_url: `${window.location.origin}#/completion`
        }
      })
    } else { */
    error = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}#/completion`
      }
    })
    //}

    console.log(error)

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message)
    } else {
      setMessage('An unexpected error occured. Please refresh the page')
    }

    setIsProcessing(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isProcessing || !stripe || !elements} id="submit">
        <span id="button-text">
          {isProcessing ? 'Processing ... ' : 'Pay now'}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  )
}
