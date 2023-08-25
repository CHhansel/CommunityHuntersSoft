import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gpiAPI from '../api/db-connection';

// Función para obtener propiedades
async function getPropertiesByUserId({ id, page, itemsPerPage,token }) {
    console.log("esto llega",id,token);
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
      });
  },
});

export default propertiesSlice.reducer;
