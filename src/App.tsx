import theme from "./app/theme";
import AppRoutes from "./routes/AppRoutes";
import { createTheme, ThemeProvider } from "@mui/material";

const App = () => {
  // Custom theme matching TaskApp branding
  // const theme = createTheme({
  //   palette: {
  //     primary: {
  //       main: "#7c3aed",
  //       light: "#9333ea",
  //       dark: "#6d28d9",
  //     },
  //   },
  //   components: {
  //     MuiOutlinedInput: {
  //       styleOverrides: {
  //         root: {
  //           "&:hover .MuiOutlinedInput-notchedOutline": {
  //             borderColor: "#7c3aed",
  //           }
  //         },
  //       },
  //     },
  //     MuiSelect: {
  //       styleOverrides: {
  //         outlined: {
  //           "&:hover .MuiOutlinedInput-notchedOutline": {
  //             borderColor: "#7c3aed",
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  // const theme = createTheme({
  //   components: {
  //     MuiOutlinedInput: {
  //       styleOverrides: {
  //         root: {
  //           "&:hover .MuiOutlinedInput-notchedOutline": {
  //             borderColor: "#7c3aed",
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  
  return (
    <>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </>
  );
};
export default App;
