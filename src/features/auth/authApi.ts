import baseApi from "../../common/api/baseApi";
import { USER_ENDPOINTS } from "../../constants/endPoint";
import type { LoginPayload } from "./authSchema";

const authApi = {
    login: (data : LoginPayload) => baseApi.post({endpoint: USER_ENDPOINTS.LOGIN, data}),
}

export default authApi;