import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMaintenanceCostChart,fetchMaintenanceActivityChart,fetchMaintenanceCostChartFiltered,fetchMaintenanceActivityChartFiltered } from "../services/AnalyticsService";

export const getMaintenanceCostChart = createAsyncThunk(
    "maintenance_cost_chart/getMaintenanceCostChart",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchMaintenanceCostChart();
        
        // Log the response data
        console.log(res.data);
  
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const getMaintenanceCostChartFiltered = createAsyncThunk(
    "maintenance_cost_chart/getMaintenanceCostChartFiltered",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchMaintenanceCostChartFiltered();
       
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );


  export const getMaintenanceActivityChartFiltered = createAsyncThunk(
    "maintenance_activity_chart/getMaintenanceActivityChartFiltered",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchMaintenanceActivityChartFiltered();
        return res.data;
        
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

  export const getMaintenanceActivityChart = createAsyncThunk(
    "maintenance_activity_chart/getMaintenanceActivityChart",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;
      try {
        const res = await fetchMaintenanceActivityChart();
 
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
 
  export const AnalyticsSlice = createSlice({
    name: "maintenance_cost_chart",
    initialState: {
      maintenanceCostCharts: [],
      maintenanceActivityCharts: [],
      maintenanceCostChartsFiltered:[],
      maintenanceActivityChartsFiltered:[],
      isLoading: false,
      success: null,
      error: null,
    },
    extraReducers: (builder) => {
       
        builder 
        //get maintenance cost chart
          .addCase(getMaintenanceCostChart.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getMaintenanceCostChart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.maintenanceCostCharts = action.payload;
          })
          .addCase(getMaintenanceCostChart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //get maintenance cost chart filter
          .addCase(getMaintenanceCostChartFiltered.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getMaintenanceCostChartFiltered.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.maintenanceCostChartsFiltered = action.payload;
          })
          .addCase(getMaintenanceCostChartFiltered.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //get maintenance activity chart
          .addCase(getMaintenanceActivityChart.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getMaintenanceActivityChart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.maintenanceActivityCharts = action.payload;
          })
          .addCase(getMaintenanceActivityChart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
          //get maintenance activity chart filter
          .addCase(getMaintenanceActivityChartFiltered.pending, (state, action) => {
            state.isLoading = true;
            state.error = null;
          })
          .addCase(getMaintenanceActivityChartFiltered.fulfilled, (state, action) => {
            state.isLoading = false;
            state.error = null;
            state.maintenanceActivityChartsFiltered = action.payload;
          })
          .addCase(getMaintenanceActivityChartFiltered.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            console.log("impossible de se connecter au serveur");
          })
         
      },
    });
    export default AnalyticsSlice.reducer;
