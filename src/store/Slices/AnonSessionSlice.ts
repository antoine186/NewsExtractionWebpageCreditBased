import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AnonSessionState {
    anonSession: object
}

const initialState: AnonSessionState = {
    anonSession: {},
}

export const AnonSessionSlice = createSlice({
  name: 'anonSession',
  initialState,
  reducers: {
    setAnonSession: (state, value) => {
      state.anonSession = value
    },
    clearAnonSession: (state) => {
      state.anonSession = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setAnonSession, clearAnonSession } = AnonSessionSlice.actions

export default AnonSessionSlice.reducer
