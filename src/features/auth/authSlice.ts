import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface AuthState {
  user: null | { id : string, email: string, role : string };
  loading: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  isAuthenticated: !!Cookies.get("accessToken"),
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    payload: { email: string; password: string; remember: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        payload,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response && err.response.data) {
        return rejectWithValue(err.response.data.error);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      Cookies.remove("accessToken");
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        toast.success("Login successful!")
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload as string);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
