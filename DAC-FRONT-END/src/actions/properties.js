import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gpiAPI from '../api/db-connection';

// Función para obtener propiedades
async function getPropertiesByUserId({ id, page, itemsPerPage,token }) {
  const response = await gpiAPI.get(`/property/get-properties`, {
    params: { id, page, itemsPerPage },
    headers: { 'Authorization': token }
  });
  return response.data;
}

// Acción asíncrona
export const fetchProperties = createAsyncThunk(
   
  'properties/fetchProperties',
  async (params, { rejectWithValue }) => {

    try {
      const data = await getPropertiesByUserId(params);
      return data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);
// Función para crear una propiedad
async function createProperty(data, token) {
  const response = await gpiAPI.post('/property/create-property', data, {
    headers: { 'Authorization': token,  'Content-Type': 'application/json' }
  });
  return response.data;
}

// Acción asíncrona para crear propiedad
export const createPropertyAction = createAsyncThunk(
  'properties/createProperty',
  async (params, { rejectWithValue }) => {
    try {
      const data = await createProperty(params.data, params.token);
      return data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

async function updateProperty(data, token) {
  const response = await gpiAPI.patch(`/property/update-property`, data, {
    headers: { 'Authorization': token, 'Content-Type': 'application/json' }
  });
  return response.data;
}
export const updatePropertyAction = createAsyncThunk(
  'properties/updateProperty',
  async (params, { rejectWithValue }) => {
    try {
      const data = await updateProperty(params.data, params.token);
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
export const propertiesSlice = createSlice({
  name: 'properties',
  initialState: {
    properties: [],
    totalProperties: 0,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.properties = action.payload.properties;
        state.totalProperties = action.payload.totalProperties;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createPropertyAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPropertyAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Añade la nueva propiedad al array de propiedades
        state.properties.push(action.payload);
      })
      .addCase(createPropertyAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updatePropertyAction.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePropertyAction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Encuentra el índice de la propiedad a actualizar
        const index = state.properties.findIndex(property => property.id === action.payload.id);
        if (index !== -1) {
          // Reemplaza la propiedad en el array por la actualizada
          state.properties[index] = action.payload;
        }
      })
      .addCase(updatePropertyAction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default propertiesSlice.reducer;
