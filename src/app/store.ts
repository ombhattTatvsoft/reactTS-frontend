import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/project/projectSlice";
import taskReducer from "../features/task/taskSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project: projectReducer,
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
