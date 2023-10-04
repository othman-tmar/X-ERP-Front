import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addEmployee, deleteEmployee, editEmployee, fetchEmployeeById, fetchEmployees } from "../services/EmployeeService";

export const getEmployees = createAsyncThunk(
    "employee/getEmployees",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchEmployees();
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const createEmployee = createAsyncThunk(
    "employee/createEmployee",
    async (employee, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await addEmployee(employee);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const delEmployee = createAsyncThunk(
    "employee/delEmployee",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        await deleteEmployee(id);
        return id;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const updateEmployee = createAsyncThunk(
    "employee/updateEmployee",
    async (employee, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await editEmployee(employee);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const findEmployeeByID = createAsyncThunk(
    "employee/findEmployeeByID",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchEmployeeById(id);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const EmployeeSlice = createSlice({
    name: "employee",
    initialState: {
      employees: [],
      employee: {},
      isLoading: false,
      success: null,
      error: null,
    },
    extraReducers: (builder) => {
        //get Employees
        builder
          .addCase(getEmployees.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getEmployees.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.employees = action.payload;
          })
          .addCase(getEmployees.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //insertion sEmployee
          .addCase(createEmployee.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(createEmployee.fulfilled, (state, action) => {
            state.employees=[action.payload.employee, ...state.employees];
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          .addCase(createEmployee.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = null;
          })
          //Modification sEmployee
          .addCase(updateEmployee.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(updateEmployee.fulfilled, (state, action) => {
            state.employees = state.employees.map((item) =>
              item._id === action.payload._id ? action.payload : item
            );
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          //Delete sEmployee
          .addCase(delEmployee.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(delEmployee.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.employees = state.employees.filter(
              (item) => item._id !== action.payload
            );
          })
          .addCase(delEmployee.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          //Fetch sEmployee
          .addCase(findEmployeeByID.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(findEmployeeByID.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.employee = action.payload;
          });
      },
    });
    export default EmployeeSlice.reducer;
