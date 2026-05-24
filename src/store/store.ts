import { configureStore } from '@reduxjs/toolkit'
import fipeReducer from './slices/fipeSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    fipe: fipeReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
