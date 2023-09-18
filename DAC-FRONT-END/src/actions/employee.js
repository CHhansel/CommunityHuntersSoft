import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import gpiAPI from "../api/db-connection"; // Asegúrate de que esta ruta sea la correcta para tu configuración

// Función para obtener empleados por user_id
async function getEmployeesByUserId({ id, page, itemsPerPage, token }) {
  const response = await gpiAPI.get(`/employees/get-employees`, {
    params: { id, page, itemsPerPage },
    headers: { Authorization: token },
  });
  return response.data;
}

// Acción asíncrona para obtener empleados
export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",
  async (params, { rejectWithValue }) => {
    try {
      const data = await getEmployeesByUserId(params);
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
export const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    employees: [],
    totalEmployees: 0,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees = action.payload.employees;
        state.totalEmployees = action.payload.totalEmployees;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default employeesSlice.reducer;
