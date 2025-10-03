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
    sx={{
      background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)',
      borderRadius: 2,
      boxShadow: '0 4px 14px 0 rgba(124, 58, 237, 0.39)',
      '&:hover': {
        background: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%)',
        boxShadow: '0 6px 20px 0 rgba(124, 58, 237, 0.5)',
      },
      ...muiProps.sx
    }}
  >
    {loading ? <CircularProgress size={28} sx={{color:"white"}} /> : muiProps.label}
  </Button>
);

export default FormButton;