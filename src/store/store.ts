import { configureStore } from '@reduxjs/toolkit'
import fipeReducer from './slices/fipeSlice'
import stockReducer from './slices/stockSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    fipe: fipeReducer,
    stock: stockReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
