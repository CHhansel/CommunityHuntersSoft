import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice/index'
import { modulesSlice } from './modulesSlice/index'
import { propertiesSlice } from './propertiesSlice/index'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    modules: modulesSlice.reducer,
    properties: propertiesSlice.reducer
  },
})