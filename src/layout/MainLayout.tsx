import { Outlet } from "react-router-dom";
import Navbar from "../common/components/Navbar";
import Footer from "../common/components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
