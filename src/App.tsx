import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import baseApi from "./common/api/baseApi";
import { removeUserData, setUserData } from "./utils/manageUserData";
import { setAuthenticated, type user } from "./features/auth/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./app/store";
import { createTheme, ThemeProvider } from "@mui/material";

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await baseApi.get<{user : user}>({ endpoint: "/auth/me" }).then(res => res.data);
        const user = result.data!.user;
        setUserData(user);
        dispatch(setAuthenticated(true));
      } catch {
        removeUserData();
        dispatch(setAuthenticated(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  // Custom theme matching TaskApp branding
  const theme = createTheme({
    palette: {
      primary: {
        main: '#7c3aed',
        light: '#9333ea',
        dark: '#6d28d9',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#7c3aed',
              },
            },
          },
        },
      },
    },
  });

  return (
    <>
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
    </>
  );
};
export default App;
