import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { AppDispatch } from "../../../app/store";
import { useDispatch } from "react-redux";
import AppLogo from "../../../assets/icons/AppLogo";
import { logout } from "../../../features/auth/authSlice";
import CommonModal from "../UI/Modal";
import NotificationsDropdown from "../UI/NotificationDropdown";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Profile", path: "/profile" },
  ];

  const handleMobileNavClick = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    setLogoutModalOpen(false);
  };

  return (
    <nav className="sticky top-0 bg-white backdrop-blur-xl shadow-lg shadow-purple-500/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 transition-all duration-300 hover:scale-105"
          >
            <AppLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
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

            <NotificationsDropdown />

            {/* Logout */}
            <button
              onClick={() => setLogoutModalOpen(true)}
              className="px-4 py-2 font-bold text-gray-700 hover:text-purple-600 transition-colors duration-300"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-100">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleMobileNavClick}
              className={`block px-4 py-3 rounded-sm font-medium transition-all duration-300 ${
                isActive(item.path)
                  ? "bg-purple-50 text-purple-600 border-l-4 border-purple-600"
                  : "text-gray-700"
              }`}
            >
              {item.name}
            </Link>
          ))}

          <NotificationsDropdown />

          <button
            onClick={() => setLogoutModalOpen(true)}
            className="w-full text-left px-4 py-3 rounded-md font-bold text-gray-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      <CommonModal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title="Logout"
        width="sm"
      >
        <div className="p-2">
          <p className="text-gray-600 mb-4">Are you sure you want to logout?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setLogoutModalOpen(false)}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </CommonModal>
    </nav>
  );
};

export default Navbar;
