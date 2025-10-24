import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { ApiResponse } from "../../common/api/baseApi";
import type { TaskPayload } from "./taskSchema";
import taskApi from "./taskApi";
import { toast } from "react-toastify";
import type { user } from "../auth/authSlice";

export type AttachmentItem = File | { fileName: string; originalName: string; url: string; size: number };

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  assignee: user ;
  dueDate: Date;
  tags: string[];
  createdBy: user | string;
  updatedBy: user | string;
  attachments : AttachmentItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TasksResponse {
    tasks: Task[];
}

interface taskState extends TasksResponse {
  loading: boolean;
}

const initialState: taskState = {
  loading: false,
  tasks: [],
};

// utils to build FormData from TaskPayload
const buildTaskFormData = (payload: TaskPayload): FormData => {
  const formData = new FormData();
  if (payload.projectId) formData.append("projectId", payload.projectId);
  if (payload._id) formData.append("_id", payload._id);
  formData.append("title", payload.title);
  formData.append("description", payload.description || "");
  formData.append("status", payload.status);
  formData.append("priority", payload.priority);
  formData.append("assignee", payload.assignee);
  formData.append("dueDate", payload.dueDate?.toString() || "");
  formData.append("tags", payload.tags || "");

  if (payload.attachments?.length) {
    payload.attachments.forEach((file) => {
      formData.append("attachments", file as File);
    });
  }
  if (payload.deletedFilenames?.length) {
    payload.deletedFilenames.forEach((filename) => {
      formData.append("deletedFilenames[]", filename as string);
    });
  }   
  return formData;
};


export const createTask = createAsyncThunk<ApiResponse, TaskPayload>(
    "task/createTask",
    async (payload, { rejectWithValue }) => {
      try {
        const formData = buildTaskFormData(payload);
        return await taskApi.createTask(formData);
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );

  export const editTask = createAsyncThunk<ApiResponse, TaskPayload>(
    "task/editTask",
    async (payload, { rejectWithValue }) => {
      try {
        const formData = buildTaskFormData(payload);
      return await taskApi.editTask(formData);
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );

  export const deleteTask = createAsyncThunk<ApiResponse,string>(
    "task/deleteTask",
    async (id, { rejectWithValue }) => {
      try {
        return await taskApi.deleteTask(id);
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );

  export const getTasks = createAsyncThunk<ApiResponse<TasksResponse>,string>(
    "task/getTasks",
    async (projectId, { rejectWithValue }) => {
      try {
        return await taskApi.getTasks(projectId);
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );

  export interface updateTaskStatusPayload{
    id : string;
    status : Task['status'];
  }
  export const updateTaskStatus = createAsyncThunk<ApiResponse<{task : Task}>, updateTaskStatusPayload>(
    "task/updateTaskStatus",
    async (data, { rejectWithValue }) => {
      try {
        return await taskApi.updateTaskStatus(data);
      } catch (err) {
        return rejectWithValue(err);
      }
    }
  );

  const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getTasks.fulfilled, (state, action) => {
          state.loading = false;
          state.tasks = action.payload.data!.tasks;
        })
        .addCase( updateTaskStatus.fulfilled, (state, action) => {
          state.loading = false;
          const updatedTask = action.payload.data!.task;
          const index = state.tasks.findIndex((t) => t._id === updatedTask._id);
          if (index !== -1) {
            state.tasks[index] = {
              ...state.tasks[index],
              status: updatedTask.status,
              updatedBy: updatedTask.updatedBy,
              updatedAt: updatedTask.updatedAt,
            };
            toast.success(action.payload.message);
          }
        })
        .addMatcher(
          isAnyOf(createTask.fulfilled, editTask.fulfilled,deleteTask.fulfilled),
          (state, action) => {
            state.loading = false;
            toast.success(action.payload.message);
          }
        )
        .addMatcher(
          isAnyOf(createTask.pending,updateTaskStatus.pending, getTasks.pending,editTask.pending,deleteTask.pending),
          (state) => {
            state.loading = true;
          }
        )
        .addMatcher(
          isAnyOf(createTask.rejected,updateTaskStatus.rejected, getTasks.rejected,editTask.rejected,deleteTask.rejected),
          (state, action) => {
            state.loading = false;
            toast.error(action.payload as string);
          }
        );
    },
  });
  
  export default taskSlice.reducer;