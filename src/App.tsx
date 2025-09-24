import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import baseApi from "./common/api/baseApi";
import { removeUserData, setUserData } from "./utils/manageUserData";
import { setAuthenticated } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./app/store";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await baseApi.get({ endpoint: "/auth/me" });
        const user = result.data.user;
        console.log(user);
        setUserData(user);
        dispatch(setAuthenticated(true));
      } catch {
        removeUserData();
        dispatch(setAuthenticated(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
    </>
  );
};
export default App;
