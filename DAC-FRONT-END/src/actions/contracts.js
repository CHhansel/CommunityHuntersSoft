import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DAC_API from '../api/db-connection';

// Función para obtener contratos por ID de usuario
async function getContractsByUserId({ id, page, itemsPerPage, token }) {
    const response = await DAC_API.get(`/contract/get-contracts`, {
      params: { id, page, itemsPerPage },
      headers: { 'Authorization': token }
    });
    return response.data;
}

export const fetchContracts = createAsyncThunk(
  'contracts/fetchContracts',
  async (params, { rejectWithValue }) => {
    try {
      const data = await getContractsByUserId(params);
      return data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Función para crear un contrato
async function createContract(data, token) {
  const response = await DAC_API.post('/contract/create-contract', data, {
    headers: { 'Authorization': token, 'Content-Type': 'application/json' }
  });
  return response.data;
}

export const createContractAction = createAsyncThunk(
  'contracts/createContract',
  async (params, { rejectWithValue }) => {
    try {
      const data = await createContract(params.data, params.token);
      return data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Función para actualizar un contrato
async function updateContract(data, token) {
  const response = await DAC_API.put('/contract/update-contract', data, {
    headers: { 'Authorization': token, 'Content-Type': 'application/json' }
  });
  return response.data;
}

export const updateContractAction = createAsyncThunk(
  'contracts/updateContract',
  async (params, { rejectWithValue }) => {
    try {
      const data = await updateContract(params.data, params.token);
      return data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Función para eliminar un contrato
async function deleteContract(contractId, token) {
  const response = await DAC_API.delete(`/contract/delete-contract/${contractId}`, {
    headers: { 'Authorization': token }
  });
  return response.data;
}

export const deleteContractAction = createAsyncThunk(
  'contracts/deleteContract',
  async (params, { rejectWithValue }) => {
    try {
      const data = await deleteContract(params.contractId, params.token);
      return data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

// Slice para contracts
export const contractsSlice = createSlice({
  name: 'contracts',
  initialState: {
    contracts: [],
    totalContracts: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contracts = action.payload.contracts;
        state.totalContracts = action.payload.totalContracts;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createContractAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createContractAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contracts.push(action.payload);
      })
      .addCase(createContractAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateContractAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateContractAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.contracts.findIndex(contract => contract.Id === action.payload.Id);
        if (index !== -1) {
          state.contracts[index] = action.payload;
        }
      })
      .addCase(updateContractAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteContractAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteContractAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.contracts.findIndex(contract => contract.Id === action.payload.Id);
        if (index !== -1) {
          state.contracts.splice(index, 1);
        }
      })
      .addCase(deleteContractAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contractsSlice.reducer;
