import { getUserData } from "../../../utils/manageUserData";

const Dashboard = () => {
const user = getUserData();
  return (
    <main className="flex items-center justify-center max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold fancy-text">
        Welcome to TaskApp, {user.name}
      </h1>
    </main>
  );
};

export default Dashboard;
