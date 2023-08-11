import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gpiAPI from '../../api/connection-api';

// Ejemplo de función de inicio de sesión (deberías reemplazar esto con tu propia lógica)
async function loginAPI({email, password}) {
  // Lógica de llamada a la API
  const { data } = await gpiAPI.post("/auth/login", { email, password });

  return data;
}

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginAPI(credentials);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  status: 'checking',
  user: {},
  errorMessage: undefined,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = 'checking';
      state.user = {};
      state.errorMessage = undefined;
    },
    onLogin: (state, { payload} ) => {
      state.status = 'authenticated';
      state.user = payload;
      state.errorMessage = undefined;
  },
    onLogout: (state, { payload }) => {
      state.status = 'not-authenticated';
      state.user = {};
      state.errorMessage = payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'checking';
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status = 'authenticated';
        state.user = payload;
        state.errorMessage = undefined;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.status = 'not-authenticated';
        state.errorMessage = payload;
      });
  },
});

export const { onChecking, onLogout, clearErrorMessage } = authSlice.actions;

// Selectores
export const selectStatus = (state) => state.auth.status;
export const selectUser = (state) => state.auth.user;
export const selectErrorMessage = (state) => state.auth.errorMessage;
