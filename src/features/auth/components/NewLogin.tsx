import { useState } from 'react';
import { 
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// Main Login Component
const LoginPage = () => {

  return (
          <form>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                mb: 2,
                background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
                  boxShadow: '0 6px 20px 0 rgba(124, 58, 237, 0.5)',
                },
              }}
            >
              LOGIN
            </Button>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: '#9ca3af', px: 2 }}>
                Or continue with
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              sx={{
                py: 1.5,
                mb: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: 2,
                borderColor: '#e5e7eb',
                color: '#4b5563',
                '&:hover': {
                  borderColor: '#7c3aed',
                  backgroundColor: '#faf5ff',
                },
              }}
            >
              <Box
                component="img"
                src="https://www.google.com/favicon.ico"
                alt="Google"
                sx={{ width: 20, height: 20, mr: 2 }}
              />
              GOOGLE
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Don't have an account?{' '}
                <Link
                  href="#"
                  underline="hover"
                  sx={{
                    color: '#7c3aed',
                    fontWeight: 600,
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
  );
};

export default LoginPage;