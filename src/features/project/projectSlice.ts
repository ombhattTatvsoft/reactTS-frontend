import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../common/api/baseApi";
import type { ProjectPayload } from "./projectSchema";
import projectApi from "./projectApi";
import type { user } from "../auth/authSlice";

export type projectRole = "manager" | "developer" | "tester" | "owner";

interface projectState extends ProjectsResponse,ProjectMembersResponse {
  loading: boolean;
}

const initialState: projectState = {
  loading: false,
  projects: {
    myProjects: [],
    assignedProjects: [],
  },
  allMembers : {
    members: [],
    pendingMembers: [],
  }
};

export interface ProjectMember {
  _id: string;
  user: user;
  role: projectRole;
  joinedAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "in-progress" | "completed";
  owner: user;
  members: ProjectMember[];
  pendingMembers: { _id:string, email: string; role: Exclude<projectRole,"owner"> }[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProjectsResponse {
  projects: {
    myProjects: Project[];
    assignedProjects: Project[];
  };
}

export interface ProjectMembersResponse {
  allMembers: {
    members: Project['members'];
    pendingMembers: Project['pendingMembers'];
  };
}

export const createProject = createAsyncThunk<ApiResponse, ProjectPayload>(
  "project/createProject",
  async (payload, { rejectWithValue }) => {
    try {
      return await projectApi.createProject(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const editProject = createAsyncThunk<ApiResponse, ProjectPayload>(
  "project/editProject",
  async (payload, { rejectWithValue }) => {
    try {
      return await projectApi.editProject(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteProject = createAsyncThunk<ApiResponse,string>(
  "project/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      return await projectApi.deleteProject(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getProjectMembers = createAsyncThunk<ApiResponse<ProjectMembersResponse>,string>(
  "project/getProjectMembers",
  async (id, { rejectWithValue }) => {
    try {
      return await projectApi.getProjectMembers(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getProjects = createAsyncThunk<ApiResponse<ProjectsResponse>>(
  "project/getProjects",
  async (_, { rejectWithValue }) => {
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data!.projects;
      })
      .addCase(getProjectMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.allMembers = action.payload.data!.allMembers;
      })
      .addMatcher(
        isAnyOf(createProject.fulfilled, editProject.fulfilled,deleteProject.fulfilled),
        (state, action) => {
          state.loading = false;
          toast.success(action.payload.message);
        }
      )
      .addMatcher(
        isAnyOf(createProject.pending, getProjects.pending,editProject.pending,deleteProject.pending,getProjectMembers.pending,),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        isAnyOf(createProject.rejected, getProjects.rejected,editProject.rejected,deleteProject.rejected,getProjectMembers.rejected),
        (state, action) => {
          state.loading = false;
          toast.error(action.payload as string);
        }
      );
  },
});

export default projectSlice.reducer;
