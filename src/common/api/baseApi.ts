import axios, { HttpStatusCode, type AxiosRequestConfig } from "axios";
import { removeUserData } from "../../utils/manageUserData";
import { setAuthenticated } from "../../features/auth/authSlice";

export const backendUrl = "http://localhost:4000/api";
const navigateToError = (statusCode: number) => {
  window.location.href = `/error/${statusCode}`;
};

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

interface RequestParams<T = unknown> {
  endpoint: string;
  params?: Record<string, unknown>;
  data?: T;
  config?: AxiosRequestConfig;
}

const api = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === HttpStatusCode.Unauthorized) {
      removeUserData();
      setAuthenticated(false);
    } else if (
      status === HttpStatusCode.Forbidden ||
      status === HttpStatusCode.NotFound ||
      status === HttpStatusCode.InternalServerError
    ) {
      navigateToError(status);
    }
    const err =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong";
    return Promise.reject(err);
  }
);

const baseApi = {
  get: async <R>({ endpoint, params, config }: RequestParams) =>
    await api.get<ApiResponse<R>>(endpoint, { params, ...config }),

  post: async <T, R>({ endpoint, data, config }: RequestParams<T>) =>
    await api.post<ApiResponse<R>>(endpoint, data, config),

  put: async <T, R>({ endpoint, data, config }: RequestParams<T>) =>
    await api.put<ApiResponse<R>>(endpoint, data, config),

  delete: async <R>({ endpoint, params, config }: RequestParams) =>
    await api.delete<ApiResponse<R>>(endpoint, { params, ...config }),
};

export default baseApi;
