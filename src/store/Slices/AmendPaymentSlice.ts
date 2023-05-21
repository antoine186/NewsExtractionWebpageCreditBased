import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AmendPaymentState {
    amendPaymentState: boolean
}

const initialState: AmendPaymentState = {
    amendPaymentState: false,
}

export const AmendPaymentSlice = createSlice({
  name: 'amendPaymentState',
  initialState,
  reducers: {
    setAmendPayment: (state) => {
      state.amendPaymentState = true
    },
    clearAmendPayment: (state) => {
      state.amendPaymentState = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAmendPayment, clearAmendPayment } = AmendPaymentSlice.actions

export default AmendPaymentSlice.reducer