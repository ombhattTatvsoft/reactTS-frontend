import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { ChangePasswordPayload, LoginPayload, SignUpPayload } from "./authSchema";
import authApi from "./authApi";
import { removeUserData, setUserData } from "../../utils/manageUserData";
import type { ApiResponse } from "../../common/api/baseApi";

export interface user{
  _id : string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?:string;
}

interface AuthState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user: null | user;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthLoading: true,
  user:null,
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

export const updateUserProfile = createAsyncThunk<
  ApiResponse<{ user: user }>,
  FormData
>(
  "auth/updateUserProfile",
  async (formData, { rejectWithValue }) => {
    try {
      return await authApi.updateProfile(formData);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUserPassword = createAsyncThunk<
  ApiResponse,
  ChangePasswordPayload
>(
  "auth/updateUserPassword",
  async (payload, { rejectWithValue }) => {
    try {
      return await authApi.updatePassword(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
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
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled,(state,action)=>{
        removeUserData();
        state.isAuthenticated = false;
        state.user = null;
        toast.success(action.payload.message);
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isAuthLoading = false;
        const updatedUser = action.payload.data!.user;
        state.user = updatedUser;
        setUserData(updatedUser);
        toast.success(action.payload.message);
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.isAuthLoading = false;
        toast.success(action.payload.message);
      })
      .addMatcher(isAnyOf(SignupUser.fulfilled, loginUser.fulfilled), (state,action)=>{
        state.isAuthenticated = true;
        state.isAuthLoading = false;
        setUserData(action.payload.data!.user);
        toast.success(action.payload.message);
      })
      .addMatcher(isAnyOf(SignupUser.rejected, loginUser.rejected, updateUserProfile.rejected, updateUserPassword.rejected), (state,action)=>{
        state.isAuthLoading = false;
        toast.error(action.payload as string);
      })
      .addMatcher(isAnyOf(SignupUser.pending, loginUser.pending, updateUserProfile.pending, updateUserPassword.pending), (state)=>{
        state.isAuthLoading = true;
      })
  },
});

export const { setAuthenticated,setAuthloading,setUser } = authSlice.actions;
export default authSlice.reducer;
