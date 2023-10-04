import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addPreventivePlanif, deletePreventivePlanif, editPreventivePlanif, fetchPreventivePlanifById, fetchPreventivePlanifs ,fetchPreventivePlanifsByDate} from "../services/PreventivePlanifService";

export const getPreventivePlanifs = createAsyncThunk(
    "PreventivePlanif/getPreventivePlanifs",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchPreventivePlanifs();
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const getPreventivePlanifsByDate = createAsyncThunk(
    "PreventivePlanif/getPreventivePlanifsByDate",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchPreventivePlanifsByDate();
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const createPreventivePlanif = createAsyncThunk(
    "PreventivePlanif/createPreventivePlanif",
    async (PreventivePlanif, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await addPreventivePlanif(PreventivePlanif);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const delPreventivePlanif = createAsyncThunk(
    "PreventivePlanif/delPreventivePlanif",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        await deletePreventivePlanif(id);
        return id;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const updatePreventivePlanif = createAsyncThunk(
    "PreventivePlanif/updatePreventivePlanif",
    async (PreventivePlanif, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await editPreventivePlanif(PreventivePlanif);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const findPreventivePlanifByID = createAsyncThunk(
    "PreventivePlanif/findPreventivePlanifByID",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchPreventivePlanifById(id);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const PreventivePlanifSlice = createSlice({
    name: "PreventivePlanif",
    initialState: {
      PreventivePlanifs: [],
      PreventivePlanif: {},
      PreventivePlanifsFiltered: [],
      PreventivePlanifFiltered: {},
      isLoading: false,
      success: null,
      error: null,
    },
    extraReducers: (builder) => {
        //get PreventivePlanifs
        builder
          .addCase(getPreventivePlanifs.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getPreventivePlanifs.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.PreventivePlanifs = action.payload;
          })
          .addCase(getPreventivePlanifs.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //get PreventivePlanifs By Date
          .addCase(getPreventivePlanifsByDate.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getPreventivePlanifsByDate.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.PreventivePlanifsFiltered = action.payload;
          })
          .addCase(getPreventivePlanifsByDate.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //insertion sPreventivePlanif
          .addCase(createPreventivePlanif.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(createPreventivePlanif.fulfilled, (state, action) => {
             state.PreventivePlanifs=[action.payload, ...state.PreventivePlanifs];
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          .addCase(createPreventivePlanif.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = null;
          })
          //Modification sPreventivePlanif
          .addCase(updatePreventivePlanif.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(updatePreventivePlanif.fulfilled, (state, action) => {
            state.PreventivePlanifs = state.PreventivePlanifs.map((item) =>
              item._id === action.payload._id ? action.payload : item
            );
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          //Delete sPreventivePlanif
          .addCase(delPreventivePlanif.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(delPreventivePlanif.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.PreventivePlanifs = state.PreventivePlanifs.filter(
              (item) => item._id !== action.payload
            );
          })
          .addCase(delPreventivePlanif.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          //Fetch sPreventivePlanif
          .addCase(findPreventivePlanifByID.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(findPreventivePlanifByID.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.PreventivePlanif = action.payload;
          });
      },
    });
    export default PreventivePlanifSlice.reducer;
