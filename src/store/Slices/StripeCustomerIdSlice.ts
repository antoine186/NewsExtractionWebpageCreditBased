import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface StripeCustomerIdState {
    stripeCustomerId: object
}

const initialState: StripeCustomerIdState = {
    stripeCustomerId: {},
}

export const StripeCustomerIdSlice = createSlice({
  name: 'stripeCustomerId',
  initialState,
  reducers: {
    setStripeCustomerId: (state, value) => {
      state.stripeCustomerId = value
    },
    clearStripeCustomerId: (state) => {
      state.stripeCustomerId = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setStripeCustomerId, clearStripeCustomerId } = StripeCustomerIdSlice.actions

export default StripeCustomerIdSlice.reducer
