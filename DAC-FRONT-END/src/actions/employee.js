import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import gpiAPI from "../api/db-connection"; // Asegúrate de que esta ruta sea la correcta para tu configuración


async function updateEmployeeAPI(employeeData, token) {
  const response = await gpiAPI.patch(`/employees/update-employee`, employeeData, {
    headers: { 'Authorization': token, 'Content-Type': 'application/json' }
  });
  return response.data;
}

// Función para obtener empleados por user_id
async function getEmployeesByUserId({ id, page, itemsPerPage, token }) {
  const response = await gpiAPI.get(`/employees/get-employees`, {
    params: { id, page, itemsPerPage },
    headers: { Authorization: token },
  });
  return response.data;
}
// Función para crear un empleado
async function createEmployeeAPI(employeeData, token) {
  const response = await gpiAPI.post(`/employees/create-employee`, employeeData,{
    headers: { 'Authorization': token,  'Content-Type': 'application/json' }
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
// Acción asíncrona para crear un empleado
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (params, { rejectWithValue }) => {
    try {
      console.log("params es ", params);
      const data = await createEmployeeAPI(params.data, params.token);
      return data;
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/updateEmployee",
  async (params, { rejectWithValue }) => {
    try {
      const data = await updateEmployeeAPI(params.data, params.token);
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
      })
      .addCase(createEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.employees.push(action.payload).employee;
        // Aquí puedes agregar lógica adicional si necesitas actualizar el estado después de crear un empleado
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateEmployee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Encuentra el índice del empleado que se actualizó
        const index = state.employees.findIndex(emp => emp.employee_user_id === action.payload.employee.id);
        console.log("T ",index);
        if (index !== -1) {
          // Reemplaza el empleado antiguo con el empleado actualizado
          state.employees[index] = action.payload.employee;
        }
        // Aquí puedes agregar lógica adicional si necesitas actualizar el estado después de actualizar un empleado
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default employeesSlice.reducer;
