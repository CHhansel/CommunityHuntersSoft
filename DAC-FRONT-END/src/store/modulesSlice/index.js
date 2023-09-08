import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import gpiAPI from '../../api/db-connection';

async function getAccessibleModules({ id, user_role_id, token }) {
  const response = await gpiAPI.get(`/module/get-access-modules`, {
    params: { id, user_role_id },
    headers: { 'Authorization': token }
  });
  return response.data;
}
export const fetchAccessibleModules = createAsyncThunk(
    'modules/fetchAccessibleModules',
    async (params, { rejectWithValue }) => {
      try {
        const modules = await getAccessibleModules(params);
        
        return modules;
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          return rejectWithValue(error.response.data.error);
        }
        return rejectWithValue(error.message);
      }
    }
  );
  
  
  
export const modulesSlice = createSlice({
  name: 'modules',
  initialState: {
    accessibleModules: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setAccessibleModulesFromLocalStorage: (state, action) => {
      state.accessibleModules = action.payload;
      state.status = 'authenticated';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessibleModules.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccessibleModules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.accessibleModules = action.payload;
      })
      .addCase(fetchAccessibleModules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.log(action.error.message);
      });
  },
});
export const { setAccessibleModulesFromLocalStorage } = modulesSlice.actions;

export default modulesSlice.reducer;

