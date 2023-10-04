import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { signup, signin } from "../services/Authservice";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


export const register = createAsyncThunk(
    "auth/register",
    async (employee, thunkAPI) => {
        const { rejectWithValue } = thunkAPI;
        try {
            const res = await signup(employee);
            return res.data
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    });


export const login = createAsyncThunk(
    "auth/login",
    async (employee, thunkAPI) => {
        try {
            const res = await signin(employee);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue();
        }
    });


export const logout = createAsyncThunk("auth/logout", () => {
    localStorage.removeItem("CC_Token");
    
});


export const authSlice = createSlice({
    name: "auth",
    initialState: {
        employee: null,
        isLoading: false,
        isSuccess: false,
        isError: false,
        errorMessage: "",
        isLoggedIn: false,
    },
    reducers: {
        // Reducer comes here
        reset: (state) => {
            state.isLoading = false
            state.employee=null
            state.isSuccess = false
            state.isError = false
            state.errorMessage = ""
            state.isLoggedIn = false
        }
    },
    extraReducers: (builder) => {
        //get articles
        builder
            //insertion user
            .addCase(register.pending, (state, action) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.employee = action.payload;
                state.isLoading = false;
                state.status = null;
                state.isSuccess = true
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true
                state.status = action.payload;
                state.employee = null
            })
            .addCase(login.pending, (state, action) => {
                state.isLoading = true;
                state.status = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.isSuccess = true;
                console.log(action.payload);
                state.employee = action.payload.employee;
                localStorage.setItem("CC_Token", action.payload.token);
                localStorage.setItem("refresh_token", action.payload.refreshToken);
                console.log(localStorage.getItem("CC_Token"))
                MySwal.fire({
                    icon: 'success',
                    title: 'Connection was successful',
                })
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.employee = null;
                MySwal.fire({
                    icon: 'error',
                    title: 'Connection was refused',
                })
            })
             .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.employee = null;
            })  
           
           

    }
}
)
export const { reset } = authSlice.actions

export default authSlice.reducer; 