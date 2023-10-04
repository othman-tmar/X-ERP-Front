import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCorrective, deleteCorrective, editCorrective, fetchCorrectiveById, fetchCorrectives } from "../services/CorrecMainService";

export const getCorrectives = createAsyncThunk(
    "corrective/getCorrectives",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchCorrectives();
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const createCorrective = createAsyncThunk(
    "corrective/createCorrective",
    async (corrective, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await addCorrective(corrective);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const delCorrective = createAsyncThunk(
    "corrective/delCorrective",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        await deleteCorrective(id);
        return id;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const updateCorrective = createAsyncThunk(
    "corrective/updateCorrective",
    async (corrective, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await editCorrective(corrective);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const findCorrectiveByID = createAsyncThunk(
    "corrective/findCorrectiveByID",
    async (id, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchCorrectiveById(id);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  export const CorrectiveSlice = createSlice({
    name: "corrective",
    initialState: {
      correctives: [],
      corrective: {},
      isLoading: false,
      success: null,
      error: null,
    },
    extraReducers: (builder) => {
        //get Correctives
        builder
          .addCase(getCorrectives.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getCorrectives.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.correctives = action.payload;
          })
          .addCase(getCorrectives.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //insertion sCorrective
          .addCase(createCorrective.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(createCorrective.fulfilled, (state, action) => {
             state.correctives=[action.payload, ...state.correctives];
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          .addCase(createCorrective.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.success = null;
          })
          //Modification sCorrective
          .addCase(updateCorrective.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(updateCorrective.fulfilled, (state, action) => {
            state.correctives = state.correctives.map((item) =>
              item._id === action.payload._id ? action.payload : item
            );
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          //Delete sCorrective
          .addCase(delCorrective.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(delCorrective.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.correctives = state.correctives.filter(
              (item) => item._id !== action.payload
            );
          })
          .addCase(delCorrective.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
          })
          //Fetch sCorrective
          .addCase(findCorrectiveByID.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(findCorrectiveByID.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.corrective = action.payload;
          });
      },
    });
    export default CorrectiveSlice.reducer;
