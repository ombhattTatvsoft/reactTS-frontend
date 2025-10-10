export const AUTH_ENDPOINTS = {
    LOGIN : '/auth/login',
    SIGNUP : '/auth/signup',
    LOGOUT : '/auth/logout',
    GOOGLE_LOGIN : 'http://localhost:4000/api/auth/google',
    UPDATE_PASSWORD:'/auth/change-password',
    UPDATE_PROFILE:'/auth/update-profile'
}

export const Project_ENDPOINTS = {
    ADD_Project : '/project/createProject',
    GET_PROJECTS: '/project/getProjects',
    EDIT_Project : '/project/editProject',
    DELETE_Project : '/project/deleteProject',
}

export const NOTIFICATION_ENDPOINTS = {
    GET_NOTIFICATIONS : 'notifications',
    MARK_ALL_READ : 'notifications/mark-read',
}