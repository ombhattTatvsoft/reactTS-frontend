// authApi.ts
import baseApi, { type ApiResponse } from "../../common/api/baseApi";
import { AUTH_ENDPOINTS } from "../../constants/endPoint";
import type { ChangePasswordPayload, LoginPayload, SignUpPayload } from "./authSchema";
import type { user } from "./authSlice";

const authApi = {
  login: (data: LoginPayload): Promise<ApiResponse<{ user: user }>> =>
    baseApi.post<LoginPayload, { user: user }>({ endpoint: AUTH_ENDPOINTS.LOGIN, data }).then(res => res.data),
  signup: (data: SignUpPayload): Promise<ApiResponse<{ user: user }>> =>
    baseApi.post<SignUpPayload, { user: user }>({ endpoint: AUTH_ENDPOINTS.SIGNUP, data }).then(res => res.data),
  logout: (): Promise<ApiResponse<null>> =>
    baseApi.post<null, null>({ endpoint: AUTH_ENDPOINTS.LOGOUT }).then(res => res.data),
  updatePassword: (data: ChangePasswordPayload): Promise<ApiResponse> =>
    baseApi.put<ChangePasswordPayload, unknown>({ endpoint: AUTH_ENDPOINTS.UPDATE_PASSWORD, data }).then(res => res.data),
  updateProfile: (formData: FormData): Promise<ApiResponse<{ user: user }>> =>
    baseApi.put<FormData, { user: user }>({ 
      endpoint: AUTH_ENDPOINTS.UPDATE_PROFILE, 
      data: formData,
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    }).then(res => res.data),
};

export default authApi;
