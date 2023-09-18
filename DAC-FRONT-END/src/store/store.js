import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './authSlice/index'
import { modulesSlice } from './modulesSlice/index'
import { propertiesSlice } from '../actions/properties'
import { customersSlice } from '../actions/customer'
import { contractsSlice } from '../actions/contracts'
import { rolesSlice } from '../actions/roles'
import { employeesSlice } from '../actions/employee'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    modules: modulesSlice.reducer,
    properties: propertiesSlice.reducer,
    customers: customersSlice.reducer,
    contracts: contractsSlice.reducer,
    roles: rolesSlice.reducer,
    employees: employeesSlice.reducer
  },
})