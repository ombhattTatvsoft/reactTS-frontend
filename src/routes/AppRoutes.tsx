import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../features/auth/pages/Login";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";
import SignUp from "../features/auth/pages/SignUp";
import Dashboard from "../features/dashboard/pages/Dashboard";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../app/store";
import { useEffect } from "react";
import baseApi from "../common/api/baseApi";
import { setAuthenticated, setAuthloading, setUser, type user } from "../features/auth/authSlice";
import { removeUserData, setUserData } from "../utils/manageUserData";
import Project from "../features/project/pages/Project";
import ProfilePage from "../features/profile/pages/ProfilePage";
import TaskPage from "../features/task/pages/TaskPage";
import TaskDetailPage from "../features/task/pages/TaskDetailPage";

function AppRoutes() {

    const dispatch = useDispatch<AppDispatch>();
    
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const result = await baseApi.get<{user : user}>({ endpoint: "/auth/me" }).then(res => res.data);
          const user = result.data!.user;
          setUserData(user);
          dispatch(setUser(user));
          dispatch(setAuthenticated(true));
        } catch {
          removeUserData();
          dispatch(setAuthenticated(false));
        } finally{
          dispatch(setAuthloading(false));
        }
      };
      checkAuth();
    }, [dispatch]);

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="/projects/:projectId/tasks" element={<TaskPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
