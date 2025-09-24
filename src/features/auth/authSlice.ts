import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { LoginPayload } from "./authSchema";
import authApi from "./authApi";
import { removeUserData, setUserData } from "../../utils/manageUserData";
import { GENERAL } from "../../constants/general";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  loading: false,
  isAuthenticated: false,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    payload: LoginPayload,
    { rejectWithValue }
  ) => {
    try {
      return await authApi.login(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      removeUserData();
      state.isAuthenticated = false;
      toast.success(GENERAL.LOGOUT_SUCCESS);
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        setUserData(action.payload.data.user);
        toast.success(GENERAL.LOGIN_SUCCESS);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload as string);
      });
  },
});

export const { logout,setAuthenticated } = authSlice.actions;
export default authSlice.reducer;
