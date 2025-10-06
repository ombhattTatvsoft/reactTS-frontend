import theme from "./app/theme";
import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "@mui/material";

const App = () => {
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </>
  );
};
export default App;
