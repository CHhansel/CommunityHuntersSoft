import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice/index'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer
  },
})