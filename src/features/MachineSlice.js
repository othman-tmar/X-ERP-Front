import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addMachine, deleteMachine, editMachine, fetchMachineById, fetchMachines } from "../services/MachineService";

export const getMachines = createAsyncThunk(
    "machine/getMachines",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchMachines();
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const createMachine = createAsyncThunk(
    "machine/createMachine",
    async (machine, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await addMachine(machine);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const delMachine = createAsyncThunk(
    "machine/delMachine",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        await deleteMachine(id);
        return id;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const updateMachine = createAsyncThunk(
    "machine/updateMachine",
    async (machine, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await editMachine(machine);
        return res.data;
        
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const findMachineByID = createAsyncThunk(
    "machine/findMachineByID",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchMachineById(id);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const MachineSlice = createSlice({
    name: "machine",
    initialState: {
      machines: [],
      machine: {},
      isLoading: false,
      success: null,
      error: null,
    },
    extraReducers: (builder) => {
        //get Machines
        builder
          .addCase(getMachines.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getMachines.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.machines = action.payload;
          })
          .addCase(getMachines.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //insertion sMachine
          .addCase(createMachine.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(createMachine.fulfilled, (state, action) => {
            state.machines=[action.payload, ...state.machines];
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          .addCase(createMachine.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = null;
          })
          //Modification sMachine
          .addCase(updateMachine.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(updateMachine.fulfilled, (state, action) => {
            state.machines = state.machines.map((item) =>
              item._id === action.payload._id ? action.payload : item
            );
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          //Delete sMachine
          .addCase(delMachine.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(delMachine.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.machines = state.machines.filter(
              (item) => item._id !== action.payload
            );
          })
          .addCase(delMachine.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          //Fetch sMachine
          .addCase(findMachineByID.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(findMachineByID.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.machine = action.payload;
          });
      },
    });
    export default MachineSlice.reducer;
