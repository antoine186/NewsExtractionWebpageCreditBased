import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface SearchTimeoutState {
    searchTimeoutState: any
}

const initialState: SearchTimeoutState = {
    searchTimeoutState: {},
}

export const SearchTimeoutSlice = createSlice({
  name: 'searchTimeoutState',
  initialState,
  reducers: {
    setSearchTimeoutState: (state, value) => {
      state.searchTimeoutState = value
    },
    clearSearchTimeoutState: (state) => {
      state.searchTimeoutState = {}
    }
  },
})

// Action creators are generated for each case reducer function
export const { setSearchTimeoutState, clearSearchTimeoutState } = SearchTimeoutSlice.actions

export default SearchTimeoutSlice.reducer