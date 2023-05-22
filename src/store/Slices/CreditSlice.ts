import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CreditDataState {
    creditData: number
}

const initialState: CreditDataState = {
    creditData: 0,
}

export const CreditSlice = createSlice({
  name: 'creditData',
  initialState,
  reducers: {
    setCreditData: (state, value) => {
      state.creditData = state.creditData + 1
    },
    clearCreditDataSimple: (state) => {
      state.creditData = state.creditData - 0.2
    },
    clearCreditDataLarge: (state) => {
        state.creditData = state.creditData - 0.6
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCreditData, clearCreditDataSimple, clearCreditDataLarge } = CreditSlice.actions

export default CreditSlice.reducer
