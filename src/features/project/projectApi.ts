import baseApi, { type ApiResponse } from "../../common/api/baseApi";
import { Project_ENDPOINTS } from "../../constants/endPoint";
import { type ProjectPayload } from "./projectSchema";

const projectApi = {
  createProject: (data: ProjectPayload) : Promise<ApiResponse> =>
    baseApi.post<ProjectPayload,unknown>({ endpoint: Project_ENDPOINTS.ADD_Project, data }).then(res => res.data),
};

export default projectApi;
