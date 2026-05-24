import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  isLoading: boolean
}

const initialState: UiState = {
  isLoading: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    toggleLoading: (state) => {
      state.isLoading = !state.isLoading
    },
  },
})

export const { setLoading, toggleLoading } = uiSlice.actions
export default uiSlice.reducer
