import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../app/store";
import Loader from "../common/components/UI/Loader";

const ProtectedRoute: React.FC = () => {
  const {isAuthenticated,isAuthLoading} = useSelector((state: RootState) => state.auth);

  const location = useLocation();
  if (isAuthLoading) return <Loader/>;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
