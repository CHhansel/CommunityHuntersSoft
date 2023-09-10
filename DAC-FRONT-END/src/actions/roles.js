import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gpiAPI from '../api/db-connection';

// Función para obtener roles por user_id
async function getRolesByUserId({ id, page, itemsPerPage, token }) {
  const response = await gpiAPI.get(`/role/get-roles`, {
    params: { id, page, itemsPerPage },
    headers: { 'Authorization': token }
  });
  return response.data;
}

// Acción asíncrona para obtener roles
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getRolesByUserId(params);
      return data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Función para crear un rol
async function createRole(data, token) {
  const response = await gpiAPI.post('/role/create-role', data, {
    headers: { 'Authorization': token, 'Content-Type': 'application/json' }
  });
  return response.data;
}

// Acción asíncrona para crear rol
export const createRoleAction = createAsyncThunk(
  'roles/createRole',
  async (params, { rejectWithValue }) => {
    try {
      const data = await createRole(params.data, params.token);
      return data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Slice
export const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    totalRoles: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.roles = action.payload.roles;
        state.totalRoles = action.payload.totalRoles;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createRoleAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createRoleAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Añade el nuevo rol al array de roles
        state.roles.push(action.payload);
        state.totalRoles++;
      })
      .addCase(createRoleAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default rolesSlice.reducer;
