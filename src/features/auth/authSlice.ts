import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { LoginPayload, SignUpPayload } from "./authSchema";
import authApi from "./authApi";
import { removeUserData, setUserData } from "../../utils/manageUserData";
import type { ApiResponse } from "../../common/api/baseApi";

interface AuthState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}
export interface user{
  id : string;
  email: string;
  role : string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthLoading: true,
};


// Async thunk for login
export const loginUser = createAsyncThunk<ApiResponse<{user : user}>,LoginPayload>(
  "auth/loginUser",
  async (
    payload,
    { rejectWithValue }
  ) => {
    try {
      return await authApi.login(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Async thunk for sign up
export const SignupUser = createAsyncThunk<ApiResponse<{user : user}>,SignUpPayload>(
  "auth/SignupUser",
  async (
    payload,
    { rejectWithValue }
  ) => {
    try {
      return await authApi.signup(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk<ApiResponse<null>>(
  "auth/logout",
  async () => {
    return await authApi.logout();
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setAuthloading: (state, action) => {
      state.isAuthLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled,(state,action)=>{
        removeUserData();
        state.isAuthenticated = false;
        toast.success(action.payload.message);
      })
      .addMatcher(isAnyOf(SignupUser.fulfilled, loginUser.fulfilled), (state,action)=>{
        state.isAuthenticated = true;
        setUserData(action.payload.data!.user);
        toast.success(action.payload.message);
      })
      .addMatcher(isAnyOf(SignupUser.rejected, loginUser.rejected), (_,action)=>{
        toast.error(action.payload as string);
      })
  },
});

export const { setAuthenticated,setAuthloading } = authSlice.actions;
export default authSlice.reducer;
