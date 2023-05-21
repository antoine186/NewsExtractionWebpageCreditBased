import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface StripeSubscriptionState {
    stripeSubscription: object
}

const initialState: StripeSubscriptionState = {
    stripeSubscription: {},
}

export const StripeSubscriptionSlice = createSlice({
  name: 'stripeSubscription',
  initialState,
  reducers: {
    setstripeSubscription: (state, value) => {
      state.stripeSubscription = value
    },
    clearstripeSubscription: (state) => {
      state.stripeSubscription = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setstripeSubscription, clearstripeSubscription } = StripeSubscriptionSlice.actions

export default StripeSubscriptionSlice.reducer
