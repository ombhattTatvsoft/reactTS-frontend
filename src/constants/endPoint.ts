import { backendUrl } from "../common/api/baseApi"

export const AUTH_ENDPOINTS = {
    LOGIN : '/auth/login',
    SIGNUP : '/auth/signup',
    LOGOUT : '/auth/logout',
    GOOGLE_LOGIN : backendUrl+'/auth/google',
    UPDATE_PASSWORD:'/auth/change-password',
    UPDATE_PROFILE:'/auth/update-profile'
}

export const PROJECT_ENDPOINTS = {
    ADD_Project : '/project/createProject',
    GET_PROJECTS: '/project/getProjects',
    GET_PROJECT: '/project/getProject',
    EDIT_Project : '/project/editProject',
    DELETE_Project : '/project/deleteProject',
    PROJECT_MEMBERS : '/project/getProjectMembers',
    GET_PROJECTCONFIG: '/project/getProjectConfig',
    UPDATE_TASKSTAGES: '/project/projectConfig/updateTaskStages',
}

export const NOTIFICATION_ENDPOINTS = {
    GET_NOTIFICATIONS : 'notifications',
    MARK_ALL_READ : 'notifications/mark-read',
}

export const TASK_ENDPOINTS = {
    ADD_TASK : '/task/createTask',
    EDIT_TASK : '/task/editTask',
    DELETE_TASK : '/task/deleteTask',
    GET_TASKS: "/task/getTasks",
    GET_TASK: "/task/getTask",
    GET_TASKACTIVITY: "/task/getTaskActivity",
    UPDATE_TASK_STATUS: "/task/updateTaskStatus",
    Add_COMMENT:"/task/addComment",
    SAVE_ATTACHMENTS:"/task/saveAttachments",
}