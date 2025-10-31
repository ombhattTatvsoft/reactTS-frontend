import { Outlet } from "react-router-dom";
import Navbar from "../common/components/layout/Navbar";
import Footer from "../common/components/layout/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="p-6 mb-14">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
