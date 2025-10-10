import React from 'react';
import { Button, type ButtonProps } from '@mui/material';
import { type ReactNode } from 'react';

interface OAuthButtonProps extends ButtonProps {
  label: string;
  icon: ReactNode;
  className?: string;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ label, onClick, icon, className = '',sx, ...props }) => (
  <Button
    onClick={onClick}
    startIcon={icon}
    variant="outlined"
    fullWidth
    className={className}
    sx={[
      {
        borderRadius: 2,
        borderColor: "#e5e7eb",
        transition: 'all 0.25s ease-in-out',
        color: "#4b5563",
        "&:hover": {
          borderColor: "#7c3aed",
          backgroundColor: "#faf5ff",
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]).filter(Boolean),
    ]}
    {...props}
  >
    {label}
  </Button>
);

export default OAuthButton;