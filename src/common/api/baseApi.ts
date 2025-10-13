import axios, { HttpStatusCode, type AxiosRequestConfig } from "axios";
import { removeUserData } from "../../utils/manageUserData";
import { setAuthenticated } from "../../features/auth/authSlice";

export const backendUrl = "http://localhost:4000/api";

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
    if (error.status === HttpStatusCode.Unauthorized) {
      removeUserData();
      setAuthenticated(false);
    }
    const err = error.response.data.details
      ? error.response.data.details[0]
      : error.response.data.error;
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
