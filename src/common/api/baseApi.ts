import axios, { HttpStatusCode } from "axios";
import { removeUserData } from "../../utils/manageUserData";
import { setAuthenticated } from "../../features/auth/authSlice";

const baseUrl = "http://localhost:4000/api";

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
    const err = error.response.data.details ? error.response.data.details[0] : error.response.data.error;
    return Promise.reject(err);
  }
);

type RequestParams = {
  endpoint: string;
  params?: unknown;
  data?: unknown;
};

const baseApi = {
  get: async ({ endpoint, params }: RequestParams) =>
    await api.get(endpoint, { params }),
  post: async ({ endpoint, data }: RequestParams) =>
    await api.post(endpoint, data),
  put: async ({ endpoint, data }: RequestParams) =>
    await api.put(endpoint, data),
  delete: async ({ endpoint, params }: RequestParams) =>
    await api.delete(endpoint, { params }),
};

export default baseApi;
