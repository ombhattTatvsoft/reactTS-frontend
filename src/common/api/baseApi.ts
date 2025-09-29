import axios, { HttpStatusCode } from "axios";
import { removeUserData } from "../../utils/manageUserData";
import { setAuthenticated } from "../../features/auth/authSlice";

const baseUrl = "http://localhost:4000/api";

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

interface RequestParams<T = unknown> {
  endpoint: string;
  params?: Record<string, unknown>;
  data?: T;
}

const api = axios.create({
  baseURL: baseUrl,
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
  get: async <R>({ endpoint, params }: RequestParams) =>
    await api.get<ApiResponse<R>>(endpoint, { params }),
  post: async <T,R>({ endpoint, data }: RequestParams<T>) =>
    await api.post<ApiResponse<R>>(endpoint, data),
  put: async <T,R>({ endpoint, data }: RequestParams<T>) =>
    await api.put<ApiResponse<R>>(endpoint, data),
  delete: async <R>({ endpoint, params }: RequestParams) =>
    await api.delete<ApiResponse<R>>(endpoint, { params }),
};

export default baseApi;
