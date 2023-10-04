import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {  fetchPlanningNotifications,editPlanningNotification } from "../services/NotificationsServices";

export const getPlanningNotifications = createAsyncThunk(
    "planningNotifications/getPlanningNotifications",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchPlanningNotifications();
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const updatePlanningNotification = createAsyncThunk(
    "planningNotifications/updatePlanningNotifications",
    async (planningNotification, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await editPlanningNotification(planningNotification);
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
 
  export const NotificationSlice = createSlice({
    name: "planningNotifications",
    initialState: {
        planningNotifications: [],
        planningNotification: {},
      isLoading: false,
      success: null,
      error: null,
    },
    extraReducers: (builder) => {
        //get Departments
        builder
          .addCase(getPlanningNotifications.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getPlanningNotifications.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.departments = action.payload;
          })
          .addCase(getPlanningNotifications.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          .addCase(updatePlanningNotification.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
            state.success = null;
          })
          .addCase(updatePlanningNotification.fulfilled, (state, action) => {
            state.planningNotifications= state.planningNotifications.map((item) =>
              item._id === action.payload._id ? action.payload : item
            );
            state.isLoading = false;
            state.error = null;
            state.success = action.payload;
          })
          
      },
    });
    export default NotificationSlice.reducer;
