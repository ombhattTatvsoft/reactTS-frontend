import baseApi, { type ApiResponse } from "../../common/api/baseApi";
import { Project_ENDPOINTS } from "../../constants/endPoint";
import { type ProjectPayload } from "./projectSchema";
import type { ProjectsResponse } from "./projectSlice";

const projectApi = {
  createProject: (data: ProjectPayload) : Promise<ApiResponse> =>
    baseApi.post<ProjectPayload,unknown>({ endpoint: Project_ENDPOINTS.ADD_Project, data }).then(res => res.data),
  editProject: (data: ProjectPayload) : Promise<ApiResponse> =>
    baseApi.put<ProjectPayload,unknown>({ endpoint: Project_ENDPOINTS.EDIT_Project, data }).then(res => res.data),
  deleteProject: (id: string) : Promise<ApiResponse> =>
    baseApi.delete({ endpoint: Project_ENDPOINTS.DELETE_Project+`/${id}`, }).then(res => res.data),
  getProjects: (): Promise<ApiResponse<ProjectsResponse>> =>
    baseApi.get<ProjectsResponse>({ endpoint: Project_ENDPOINTS.GET_PROJECTS }).then(res => res.data),
};

export default projectApi;
