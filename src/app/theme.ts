import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Components {
    MuiPickersTextField?: {
      styleOverrides?: {
        root?: React.CSSProperties;
      };
    };
  }
}

const theme = createTheme({
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          padding: '4px',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#1f2937',
          fontSize: '0.875rem',
          fontWeight: 500,
        },
      },
    },
    
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#1f2937',
          fontSize: '1rem',
          // Apply styles that would affect section content
          '& [class*="MuiPickersSectionList-sectionContent"]': {
            padding: '2px 4px',
            '&:focus': {
              backgroundColor: '#eff6ff',
              borderRadius: '4px',
            },
          },
          '& [class*="MuiPickersSectionList-sectionSeparator"]': {
            color: '#6b7280',
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '& .MuiIconButton-root': {
            color: '#3b82f6',
            '&:hover': {
              backgroundColor: '#eff6ff',
              borderRadius: '50%',
            },
          },
        },
      },
    },
    MuiPickersTextField: {
      styleOverrides: {
        root: {
          color: '#1f2937',
          fontSize: '1rem',
        },
      },
    },
  },
});

export default theme;