import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserSessionState {
  validated: boolean
}

const initialState: UserSessionState = {
  validated: false,
}

export const userSessionSlice = createSlice({
  name: 'userSession',
  initialState,
  reducers: {
    validateUserSession: (state) => {
      state.validated = true
    },
    invalidateUserSession: (state) => {
      state.validated = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { validateUserSession, invalidateUserSession } = userSessionSlice.actions

export default userSessionSlice.reducer
