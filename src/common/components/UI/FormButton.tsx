import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import type { ButtonField } from '../../utils/FormFieldGenerator';

interface ButtonProps extends ButtonField{
  loading?: boolean;
}

const FormButton: React.FC<ButtonProps> = ({
  loading = false,
  ...muiProps
}) => (
  <Button
    disabled={muiProps.disabled || loading} {...muiProps}
    className={`fancy-bg ${muiProps.className}`}
    sx={{
      color: 'white',
      borderRadius: 2,
      textTransform: 'none',
      transition: 'all 0.25s ease-in-out',
      boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.4)',
      '&.Mui-disabled': {
        opacity: 0.6,
        boxShadow: 'none',
        color: 'white',
      },
      ...muiProps.sx,
    }}
  >
    {loading ? <CircularProgress size={28} sx={{color:"white"}} /> : muiProps.label}
  </Button>
);

export default FormButton;