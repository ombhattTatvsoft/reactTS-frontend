import { Link, useLocation } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import type { AppDispatch } from "../../app/store";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tasks", path: "/tasks" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-white backdrop-blur-xl shadow-lg shadow-purple-500/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              TaskApp
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-t-md font-medium transition-all duration-300 transform hover:scale-105 ${
                  isActive(item.path)
                    ? "border-b-2 border-purple-600 text-purple-600 bg-purple-50/80 backdrop-blur-sm"
                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 backdrop-blur-sm"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => dispatch(logout())}
              className="px-4 py-2 font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
