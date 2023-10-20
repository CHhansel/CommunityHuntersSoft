import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DAC_API from '../../api/db-connection';


// Función para solicitar la recuperación de contraseña
async function requestPasswordRecoveryAPI(email) {
  const { data } = await DAC_API.post("/user/recovery-password", { email });
  return data;
}
// Función para restablecer la contraseña
async function resetPasswordAPI({ token, newPassword }) {
  const { data } = await DAC_API.post("/user/reset-password", { token, newPassword });
  return data;
}
// Ejemplo de función de inicio de sesión (deberías reemplazar esto con tu propia lógica)
async function loginAPI({username, password}) {
  // Lógica de llamada a la API
  const { data } = await DAC_API.post("/user/login", { username, password });
  return data;
}
export const requestPasswordRecovery = createAsyncThunk(
  'auth/requestPasswordRecovery',
  async (email, { rejectWithValue }) => {
    try {
      const response = await requestPasswordRecoveryAPI(email);
      return response;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await resetPasswordAPI(data);
      return response;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const user = await loginAPI(credentials);
      return user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Devuelve el mensaje de error como parte del valor rechazado
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  status: 'idle',
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
    setUserFromLocalStorage: (state, action) => {
      state.user = action.payload;
      state.status = 'authenticated';
    },
    // eslint-disable-next-line no-unused-vars
    resetAuthState: (state) => {
      return initialState; // Esto resetea el estado al valor inicial
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
      })
      .addCase(requestPasswordRecovery.pending, (state) => {
        state.status = 'checking';
      })
      .addCase(requestPasswordRecovery.fulfilled, (state) => {
        state.status = 'recovery-email-sent';
      })
      .addCase(requestPasswordRecovery.rejected, (state, { payload }) => {
        state.status = 'recovery-failed';
        state.errorMessage = payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.status = 'resetting';
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'password-reset-success';
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.status = 'password-reset-failed';
        state.errorMessage = payload;
      });
  },
});

export const { resetAuthState, onChecking, onLogout, clearErrorMessage,setUserFromLocalStorage } = authSlice.actions;

// Selectores
export const selectStatus = (state) => state.auth.status;
export const selectUser = (state) => state.auth.user;
export const selectErrorMessage = (state) => state.auth.errorMessage;