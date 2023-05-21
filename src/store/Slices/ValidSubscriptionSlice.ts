import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ValidSubscriptionState {
    validSubscription: object
}

const initialState: ValidSubscriptionState = {
    validSubscription: {},
}

export const ValidSubscriptionSlice = createSlice({
  name: 'validSubscription',
  initialState,
  reducers: {
    setValidSubscription: (state, value) => {
      state.validSubscription = value
    },
    clearValidSubscription: (state) => {
      state.validSubscription = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setValidSubscription, clearValidSubscription } = ValidSubscriptionSlice.actions

export default ValidSubscriptionSlice.reducer