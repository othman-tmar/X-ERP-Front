import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addDepartment, deleteDepartment, editDepartment, fetchDepartmentById, fetchDepartments } from "../services/DepartmentService";

export const getDepartments = createAsyncThunk(
    "department/getDepartments",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchDepartments();
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const createDepartment = createAsyncThunk(
    "department/createDepartment",
    async (department, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await addDepartment(department);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const delDepartment = createAsyncThunk(
    "department/delDepartment",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        await deleteDepartment(id);
        return id;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const updateDepartment = createAsyncThunk(
    "department/updateDepartment",
    async (department, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await editDepartment(department);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const findDepartmentByID = createAsyncThunk(
    "department/findDepartmentByID",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchDepartmentById(id);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const DepartmentSlice = createSlice({
    name: "department",
    initialState: {
      departments: [],
      department: {},
      isLoading: false,
      success: null,
      error: null,
    },
    extraReducers: (builder) => {
        //get Departments
        builder
          .addCase(getDepartments.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getDepartments.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.departments = action.payload;
          })
          .addCase(getDepartments.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //insertion sDepartment
          .addCase(createDepartment.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(createDepartment.fulfilled, (state, action) => {
            
            state.departments=[action.payload, ...state.departments];
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          .addCase(createDepartment.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = null;
          })
          //Modification sDepartment
          .addCase(updateDepartment.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(updateDepartment.fulfilled, (state, action) => {
            state.departments = state.departments.map((item) =>
              item._id === action.payload._id ? action.payload : item
            );
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          //Delete sDepartment
          .addCase(delDepartment.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(delDepartment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.departments = state.departments.filter(
              (item) => item._id !== action.payload
            );
          })
          .addCase(delDepartment.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          //Fetch sDepartment
          .addCase(findDepartmentByID.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(findDepartmentByID.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.department = action.payload;
          });
      },
    });
    export default DepartmentSlice.reducer;
