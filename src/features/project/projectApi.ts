import baseApi, { type ApiResponse } from "../../common/api/baseApi";
import { PROJECT_ENDPOINTS } from "../../constants/endPoint";
import { type ProjectPayload } from "./projectSchema";
import type { ProjectConfigResponse, ProjectResponse, ProjectsResponse, TaskStagesPayload } from "./projectSlice";

const projectApi = {
  createProject: (data: ProjectPayload) : Promise<ApiResponse> =>
    baseApi.post<ProjectPayload,unknown>({ endpoint: PROJECT_ENDPOINTS.ADD_Project, data }).then(res => res.data),
  editProject: (data: ProjectPayload) : Promise<ApiResponse> =>
    baseApi.put<ProjectPayload,unknown>({ endpoint: PROJECT_ENDPOINTS.EDIT_Project, data }).then(res => res.data),
  deleteProject: (id: string) : Promise<ApiResponse> =>
    baseApi.delete({ endpoint: PROJECT_ENDPOINTS.DELETE_Project+`/${id}`, }).then(res => res.data),
  getProjects: (): Promise<ApiResponse<ProjectsResponse>> =>
    baseApi.get<ProjectsResponse>({ endpoint: PROJECT_ENDPOINTS.GET_PROJECTS }).then(res => res.data),
  getProject: (id: string): Promise<ApiResponse<ProjectResponse>> =>
    baseApi.get<ProjectResponse>({ endpoint: PROJECT_ENDPOINTS.GET_PROJECT + `/${id}` }).then(res => res.data),
  getProjectConfig: (id: string): Promise<ApiResponse<ProjectConfigResponse>> =>
    baseApi.get<ProjectConfigResponse>({ endpoint: PROJECT_ENDPOINTS.GET_PROJECTCONFIG + `/${id}` }).then(res => res.data),
  updateTaskStages: (data: TaskStagesPayload) : Promise<ApiResponse<ProjectConfigResponse>> =>
    baseApi.put<TaskStagesPayload,ProjectConfigResponse>({ endpoint: PROJECT_ENDPOINTS.UPDATE_TASKSTAGES, data }).then(res => res.data),
  // getProjectMembers: (id: string): Promise<ApiResponse<ProjectMembersResponse>> =>
  //   baseApi.get<ProjectMembersResponse>({ endpoint: PROJECT_ENDPOINTS.PROJECT_MEMBERS + `/${id}` }).then(res => res.data),
};

export default projectApi;
