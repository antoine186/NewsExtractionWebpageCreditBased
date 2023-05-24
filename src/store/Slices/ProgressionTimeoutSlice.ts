import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ProgressionTimeoutState {
    progressionTimeoutState: any
}

const initialState: ProgressionTimeoutState = {
    progressionTimeoutState: {},
}

export const ProgressionTimeoutSlice = createSlice({
  name: 'progressionTimeoutState',
  initialState,
  reducers: {
    setProgressionTimeoutState: (state, value) => {
      state.progressionTimeoutState = value
    },
    clearProgressionTimeoutState: (state) => {
      state.progressionTimeoutState = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setProgressionTimeoutState, clearProgressionTimeoutState } = ProgressionTimeoutSlice.actions

export default ProgressionTimeoutSlice.reducer