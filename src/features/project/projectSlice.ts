import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../common/api/baseApi";
import type { ProjectPayload } from "./projectSchema";
import projectApi from "./projectApi";
import type { user } from "../auth/authSlice";

interface projectState {
  loading: boolean;
  projects: Project[];
}

const initialState: projectState = {
  loading: false,
  projects: []
};

export interface ProjectMember {
  user: user;
  role: string;
  joinedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  owner: user;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProjectsResponse {
  projects: Project[];
}


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

export const getProjects = createAsyncThunk<ApiResponse<ProjectsResponse>>(
  "project/getProjects",
  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      return await projectApi.getProjects();
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
      .addCase(getProjects.fulfilled,(state,action)=>{
        state.loading = false;
        state.projects = action.payload.data!.projects;
      })
      .addMatcher(isAnyOf(createProject.pending, getProjects.pending), (state)=>{
        state.loading = true;
      })
      .addMatcher(isAnyOf(createProject.rejected, getProjects.rejected), (state,action)=>{
        state.loading = false;
        toast.error(action.payload as string);
      })
  },
});

export default projectSlice.reducer;
