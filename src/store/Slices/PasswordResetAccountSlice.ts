import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface PasswordResetAccountState {
    passwordResetAccountState: any
}

const initialState: PasswordResetAccountState = {
    passwordResetAccountState: {},
}

export const PasswordResetAccountSlice = createSlice({
  name: 'passwordResetAccountState',
  initialState,
  reducers: {
    setPasswordResetAccountState: (state, value) => {
      state.passwordResetAccountState = value
    },
    clearPasswordResetAccountState: (state) => {
      state.passwordResetAccountState = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setPasswordResetAccountState, clearPasswordResetAccountState } = PasswordResetAccountSlice.actions

export default PasswordResetAccountSlice.reducer