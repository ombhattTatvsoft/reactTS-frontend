import baseApi, { type ApiResponse } from "../../common/api/baseApi";
import { TASK_ENDPOINTS } from "../../constants/endPoint";
import type {
  addCommentPayload,
  Task,
  TaskActivityResponse,
  TaskResponse,
  TasksResponse,
  updateTaskStatusPayload,
} from "./taskSlice";

const taskApi = {
  createTask: (data: FormData): Promise<ApiResponse> =>
    baseApi
      .post<FormData, unknown>({
        endpoint: TASK_ENDPOINTS.ADD_TASK,
        data,
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      })
      .then((res) => res.data),
  editTask: (data: FormData): Promise<ApiResponse> =>
    baseApi
      .put<FormData, unknown>({
        endpoint: TASK_ENDPOINTS.EDIT_TASK,
        data,
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      })
      .then((res) => res.data),
  deleteTask: (id: string): Promise<ApiResponse> =>
    baseApi
      .delete({ endpoint: TASK_ENDPOINTS.DELETE_TASK + `/${id}` })
      .then((res) => res.data),
  getTasks: (projectId: string): Promise<ApiResponse<TasksResponse>> =>
    baseApi
      .get<TasksResponse>({
        endpoint: TASK_ENDPOINTS.GET_TASKS + `/${projectId}`,
      })
      .then((res) => res.data),
  getTask: (taskId: string): Promise<ApiResponse<TaskResponse>> =>
    baseApi
      .get<TaskResponse>({
        endpoint: TASK_ENDPOINTS.GET_TASK + `/${taskId}`,
      })
      .then((res) => res.data),
  getTaskActivity: (taskId: string): Promise<ApiResponse<TaskActivityResponse>> =>
    baseApi
      .get<TaskActivityResponse>({
        endpoint: TASK_ENDPOINTS.GET_TASKACTIVITY + `/${taskId}`,
      })
      .then((res) => res.data),
  updateTaskStatus: (data: updateTaskStatusPayload): Promise<ApiResponse<{ task: Task }>> =>
    baseApi
      .put<updateTaskStatusPayload, { task: Task }>({
        endpoint: TASK_ENDPOINTS.UPDATE_TASK_STATUS,
        data,
      })
      .then((res) => res.data),
  addComment: (data: addCommentPayload): Promise<ApiResponse> =>
    baseApi
      .put<addCommentPayload, unknown>({
        endpoint: TASK_ENDPOINTS.Add_COMMENT,
        data,
      })
      .then((res) => res.data),
  saveTaskAttachments: (data: FormData): Promise<ApiResponse> =>
    baseApi
      .put<FormData, unknown>({
        endpoint: TASK_ENDPOINTS.SAVE_ATTACHMENTS,
        data,
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      })
      .then((res) => res.data),
};

export default taskApi;
