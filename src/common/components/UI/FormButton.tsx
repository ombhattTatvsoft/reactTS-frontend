import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import type { ButtonField } from '../../utils/FormFieldGenerator';

interface ButtonProps extends ButtonField{
  loading?: boolean;
}

const FormButton: React.FC<ButtonProps> = ({
  label,
  loading = false,
  ...muiProps
}) => (
  <Button
    disabled={muiProps.disabled || loading} {...muiProps}
  >
    {loading ? <CircularProgress size={24} /> : label}
  </Button>
);

export default FormButton;