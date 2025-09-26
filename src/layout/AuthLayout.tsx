import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
        <div className="space-y-6">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
