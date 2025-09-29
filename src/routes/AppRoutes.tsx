import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../features/auth/components/Login";
import Dashboard from "../features/dashboard/components/Dashboard";
import MainLayout from "../layout/MainLayout";
import SignUp from "../features/auth/components/SignUp";
import AuthLayout from "../layout/AuthLayout";
import LoginPage from "../features/auth/components/NewLogin";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login2" element={<Login />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
