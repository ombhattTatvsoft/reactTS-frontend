import { createTheme } from '@mui/material/styles';

const baseTheme = createTheme({
  palette: {
    primary: {
      main: "#7c3aed",
      light: "#9333ea",
      dark: "#6d28d9",
      contrastText: "#ffffff",
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
  },

  shape: {
    borderRadius: 4,
  },

  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7c3aed',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
          },
        },
        notchedOutline: {
          borderColor: '#e5e7eb',
        },
      },
    },
    // MuiInputAdornment: {
    //   styleOverrides: {
    //     root: {
    //       '& .MuiIconButton-root': {
    //         color: '#3b82f6',
    //         '&:hover': {
    //           backgroundColor: '#eff6ff',
    //           borderRadius: '50%',
    //         },
    //       },
    //     },
    //   },
    // },
  },
});

const theme = createTheme(baseTheme, {
  components: {
    MuiPickersOutlinedInput:{
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: '#7c3aed',
          },
          '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {

          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;