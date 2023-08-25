import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Acción asíncrona para obtener las propiedades
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async ({ id, page, itemsPerPage }) => {
    const response = await axios.get(`/api/get-properties/?id=${id}&page=${page}&itemsPerPage=${itemsPerPage}`);
    return response.data;
  }
);

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState: {
    properties: [],
    totalProperties: 0,
    status: 'idle',
    error: null
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
  }
});

export default propertiesSlice.reducer;
