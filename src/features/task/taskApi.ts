import baseApi, { type ApiResponse } from "../../common/api/baseApi";
import { TASK_ENDPOINTS } from "../../constants/endPoint";
import type { Task, TasksResponse, updateTaskStatusPayload } from "./taskSlice";

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
  updateTaskStatus: (
    data: updateTaskStatusPayload
  ): Promise<ApiResponse<{ task: Task }>> =>
    baseApi
      .put<updateTaskStatusPayload, { task: Task }>({
        endpoint: TASK_ENDPOINTS.UPDATE_TASK_STATUS,
        data,
      })
      .then((res) => res.data),
};

export default taskApi;
