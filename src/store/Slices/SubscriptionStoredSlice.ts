import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SubscriptionStoredState {
    subscriptionStoredState: boolean
}

const initialState: SubscriptionStoredState = {
    subscriptionStoredState: false,
}

export const SubscriptionStoredSlice = createSlice({
  name: 'subscriptionStoredState',
  initialState,
  reducers: {
    setSubscriptionStoredState: (state) => {
      state.subscriptionStoredState = true
    },
    clearSubscriptionStoredState: (state) => {
      state.subscriptionStoredState = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSubscriptionStoredState, clearSubscriptionStoredState } = SubscriptionStoredSlice.actions

export default SubscriptionStoredSlice.reducer