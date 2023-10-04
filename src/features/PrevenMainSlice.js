import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addPreventive, deletePreventive, editPreventive, fetchPreventiveById, fetchPreventives,fetchPreventivesByDate } from "../services/PrevenMainService";

export const getPreventives = createAsyncThunk(
    "preventive/getPreventives",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchPreventives();
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const getPreventiveByDate = createAsyncThunk(
    "preventiveFiltered/getPreventiveByDate",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchPreventivesByDate();
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const createPreventive = createAsyncThunk(
    "preventive/createPreventive",
    async (preventive, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await addPreventive(preventive);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const delPreventive = createAsyncThunk(
    "preventive/delPreventive",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        await deletePreventive(id);
        return id;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const updatePreventive = createAsyncThunk(
    "preventive/updatePreventive",
    async (preventive, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await editPreventive(preventive);
        
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const findPreventiveByID = createAsyncThunk(
    "preventive/findPreventiveByID",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchPreventiveById(id);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const PreventiveSlice = createSlice({
    name: "preventive",
    initialState: {
      preventives: [],
      preventive: {},
      preventivesFiltereds: [],
      preventivesFiltered: {},
      isLoading: false,
      success: null,
      error: null,
    },
    extraReducers: (builder) => {
        //get Preventives
        builder
          .addCase(getPreventives.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getPreventives.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.preventives = action.payload;
          })
          .addCase(getPreventives.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
           //get Preventives By DateEnd
          .addCase(getPreventiveByDate.pending, (state, action) => {
    
            state.error = null;
          })
          .addCase(getPreventiveByDate.fulfilled, (state, action) => {
            state.preventivesFiltered = action.payload;
            state.error = null;
          
          })
          .addCase(getPreventiveByDate.rejected, (state, action) => {

            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //insertion sPreventive
          .addCase(createPreventive.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(createPreventive.fulfilled, (state, action) => {
             state.preventives=[action.payload, ...state.preventives];
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          .addCase(createPreventive.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = null;
          })
          //Modification sPreventive
          .addCase(updatePreventive.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          /* .addCase(updatePreventive.fulfilled, (state, action) => {
            state.preventives = state.preventives.map((item) =>
              item._id === action.payload._id ? action.payload : item
            );
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
            console.log(action.payload)
          }) */
          .addCase(updatePreventive.fulfilled, (state, action) => {
            state.preventives = state.preventives.map((item) =>
              item._id === action.payload._id ? action.payload : item
            );
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
            console.log(action.payload)
          })
          
          //Delete sPreventive
          .addCase(delPreventive.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(delPreventive.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.preventives = state.preventives.filter(
              (item) => item._id !== action.payload
            );
          })
          .addCase(delPreventive.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          //Fetch sPreventive
          .addCase(findPreventiveByID.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(findPreventiveByID.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.preventive = action.payload;
          });
      },
    });
    export default PreventiveSlice.reducer;
