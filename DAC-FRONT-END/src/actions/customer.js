import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gpiAPI from '../api/db-connection';

// Función para obtener clientes por ID de usuario
async function getCustomersByUserId({ id, page, itemsPerPage, token }) {
    const response = await gpiAPI.get(`/customer/get-customers`, {
      params: { id, page, itemsPerPage },
      headers: { 'Authorization': token }
    });
    return response.data;
  }
  
  export const fetchCustomers = createAsyncThunk(
    'customers/fetchCustomers',
    async (params, { rejectWithValue }) => {
      try {
        const data = await getCustomersByUserId(params);
        return data;
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          return rejectWithValue(error.response.data.error);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  // Función para crear un cliente
  async function createCustomer(data, token) {
    const response = await gpiAPI.post('/customer/create-customer', data, {
      headers: { 'Authorization': token, 'Content-Type': 'application/json' }
    });
    return response.data;
  }
  
  export const createCustomerAction = createAsyncThunk(
    'customers/createCustomer',
    async (params, { rejectWithValue }) => {
      try {
        const data = await createCustomer(params.data, params.token);
        return data;
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          return rejectWithValue(error.response.data.error);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  // Función para actualizar un cliente
  async function updateCustomer(data, token) {
    const response = await gpiAPI.put('/customer/update-customer', data, {
      headers: { 'Authorization': token, 'Content-Type': 'application/json' }
    });
    return response.data;
  }
  
  export const updateCustomerAction = createAsyncThunk(
    'customers/updateCustomer',
    async (params, { rejectWithValue }) => {
      try {
        const data = await updateCustomer(params.data, params.token);
        return data;
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          return rejectWithValue(error.response.data.error);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  // Función para eliminar un cliente
  async function deleteCustomer(customerId, token) {
    const response = await gpiAPI.delete(`/customer/delete-customer/${customerId}`, {
      headers: { 'Authorization': token }
    });
    return response.data;
  }
  
  export const deleteCustomerAction = createAsyncThunk(
    'customers/deleteCustomer',
    async (params, { rejectWithValue }) => {
      try {
        const data = await deleteCustomer(params.customerId, params.token);
        return data;
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          return rejectWithValue(error.response.data.error);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  // Slice para customers
  export const customersSlice = createSlice({
    name: 'customers',
    initialState: {
      customers: [],
      totalCustomers: 0,
      status: 'idle',
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchCustomers.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchCustomers.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.customers = action.payload.customers;
          state.totalCustomers = action.payload.totalCustomers;
        })
        .addCase(fetchCustomers.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(createCustomerAction.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(createCustomerAction.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.customers.push(action.payload);
        })
        .addCase(createCustomerAction.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(updateCustomerAction.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(updateCustomerAction.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const index = state.customers.findIndex(customer => customer.Id === action.payload.Id);
          if (index !== -1) {
            state.customers[index] = action.payload;
          }
        })
        .addCase(updateCustomerAction.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(deleteCustomerAction.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(deleteCustomerAction.fulfilled, (state, action) => {
          state.status = 'succeeded';
          const index = state.customers.findIndex(customer => customer.Id === action.payload.Id);
          if (index !== -1) {
            state.customers.splice(index, 1);
          }
        })
        .addCase(deleteCustomerAction.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        });
    },
  });
  
  export default customersSlice.reducer;
  