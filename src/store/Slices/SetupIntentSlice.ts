import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SetupIntentState {
    setupIntentState: any
}

const initialState: SetupIntentState = {
    setupIntentState: {},
}

export const SetupIntentSlice = createSlice({
  name: 'setupIntentState',
  initialState,
  reducers: {
    setSetupIntentState: (state, value) => {
      state.setupIntentState = value
    },
    clearSetupIntentState: (state) => {
      state.setupIntentState = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSetupIntentState, clearSetupIntentState } = SetupIntentSlice.actions

export default SetupIntentSlice.reducer