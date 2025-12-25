import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ApiResponse } from "../../common/api/baseApi";
import type { TaskPayload } from "./taskSchema";
import taskApi from "./taskApi";
import { toast } from "react-toastify";
import type { user } from "../auth/authSlice";

export type AttachmentItem =
  | File
  | {
      fileName: string;
      originalName: string;
      url: string;
      size: number;
      uploadedBy?: user;
      uploadedAt?: string;
    };

export type CommentItem = {
  _id: string;
  user: user;
  text: string;
  createdAt: string;
};
export interface Task {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  priority: "low" | "medium" | "high";
  assignee: user;
  dueDate: Date;
  tags: string[];
  createdBy: user;
  updatedBy: user;
  attachments: AttachmentItem[];
  createdAt: string;
  updatedAt: string;
  comments: CommentItem[];
  assigneeRole? : string;
  projectMembers? : {user: user, role: string}[];
  __v: number;
}

export interface TaskActivity {
  _id: string;
  taskId: string;
  performedBy: user;
  performedAt: Date;
  action?:{
    field: "title" | "description" | "status" | "priority" | "assignee" | "dueDate" | "attachments";
    oldValue: string | null;
    newValue: string | null;
  }
}
export interface TasksResponse {
  tasks: Task[];
}
export interface TaskResponse {
  task: Task | null;
}
export interface TaskActivityResponse {
  taskActivity: TaskActivity[];
}
interface taskState extends TasksResponse, TaskResponse, TaskActivityResponse {
  loading: boolean;
}

const initialState: taskState = {
  loading: false,
  tasks: [],
  task: null,
  taskActivity: [],
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

export const deleteTask = createAsyncThunk<ApiResponse, string>(
  "task/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      return await taskApi.deleteTask(id);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTasks = createAsyncThunk<ApiResponse<TasksResponse>, string>(
  "task/getTasks",
  async (projectId, { rejectWithValue }) => {
    try {
      return await taskApi.getTasks(projectId);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTask = createAsyncThunk<ApiResponse<TaskResponse>, string>(
  "task/getTask",
  async (taskId, { rejectWithValue }) => {
    try {
      return await taskApi.getTask(taskId);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTaskActivity = createAsyncThunk<ApiResponse<TaskActivityResponse>, string>(
  "task/getTaskActivity",
  async (taskId, { rejectWithValue }) => {
    try {
      return await taskApi.getTaskActivity(taskId);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export interface updateTaskStatusPayload {
  id: string;
  status: Task["status"];
}
export const updateTaskStatus = createAsyncThunk<
  ApiResponse<{ task: Task }>,
  updateTaskStatusPayload
>("task/updateTaskStatus", async (data, { rejectWithValue }) => {
  try {
    return await taskApi.updateTaskStatus(data);
  } catch (err) {
    return rejectWithValue(err);
  }
});

export interface addCommentPayload {
  taskId: string;
  text: string;
}
export const addComment = createAsyncThunk<ApiResponse, addCommentPayload>(
  "task/addComment",
  async (data, { rejectWithValue }) => {
    try {
      return await taskApi.addComment(data);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export interface saveTaskAttachmentsPayload {
  taskId: string;
  files: File[];
  deletedFilenames: string[];
}
export const saveTaskAttachments = createAsyncThunk<
  ApiResponse,
  saveTaskAttachmentsPayload
>("task/saveTaskAttachments", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("taskId", data.taskId);
    if (data.files.length) {
      data.files.forEach((f) => formData.append("attachments", f as File));
    }
    if (data.deletedFilenames.length) {
      data.deletedFilenames.forEach((d) =>
        formData.append("deletedFilenames[]", d as string)
      );
    }
    const res = await taskApi.saveTaskAttachments(formData);
    toast.success(res.message);
    return res;
  } catch (err) {
    return rejectWithValue(err);
  }
});

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    commentReceived: (
      state,
      action: PayloadAction<{ taskId: string; comment: CommentItem }>
    ) => {
      const { taskId, comment } = action.payload;
      if (state.task && state.task._id === taskId) {
        state.task.comments = state.task.comments || [];
        if (!state.task.comments.find((c) => c._id === comment._id)) {
          state.task.comments.push(comment);
        }
      }
    },
    attachmentsUpdatedLocal: (
      state,
      action: PayloadAction<{ taskId: string; attachments: AttachmentItem[] }>
    ) => {
      const { taskId, attachments } = action.payload;
      if (state.task && state.task._id === taskId) {
        state.task.attachments = attachments;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.data!.tasks;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload.data!.task;
      })
      .addCase(getTaskActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.taskActivity = action.payload.data!.taskActivity;
      })
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
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
        isAnyOf(createTask.fulfilled, editTask.fulfilled, deleteTask.fulfilled),
        (state, action) => {
          state.loading = false;
          toast.success(action.payload.message);
        }
      )
      .addMatcher(
        isAnyOf(
          createTask.pending,
          updateTaskStatus.pending,
          getTasks.pending,
          getTask.pending,
          editTask.pending,
          deleteTask.pending,
          getTaskActivity.pending
        ),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          createTask.rejected,
          updateTaskStatus.rejected,
          getTasks.rejected,
          getTask.rejected,
          editTask.rejected,
          deleteTask.rejected,
          getTaskActivity.rejected
        ),
        (state, action) => {
          state.loading = false;
          toast.error(action.payload as string);
        }
      );
  },
});

export const { commentReceived, attachmentsUpdatedLocal } = taskSlice.actions;
export default taskSlice.reducer;
