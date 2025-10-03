import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../common/api/baseApi";
import type { ProjectPayload } from "./projectSchema";
import projectApi from "./projectApi";

interface projectState {
  loading: boolean;
  projects: []
}

const initialState: projectState = {
  loading: false,
  projects: []
};


export const createProject = createAsyncThunk<ApiResponse,ProjectPayload>(
  "project/createProject",
  async (
    payload,
    { rejectWithValue }
  ) => {
    try {
      return await projectApi.createProject(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.fulfilled,(state,action)=>{
        state.loading = false;
        toast.success(action.payload.message);
      })
      .addCase(createProject.pending,(state)=>{
        state.loading = true;
      })
      .addCase(createProject.rejected,(state,action)=>{
        state.loading = false;
        toast.error(action.payload as string);
      })
  },
});

export default projectSlice.reducer;
