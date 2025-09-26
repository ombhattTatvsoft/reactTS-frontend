import React from 'react';
import { Button } from '@mui/material';
import { type ReactNode } from 'react';

interface OAuthButtonProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  className?: string;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({ label, icon, onClick, className = '' }) => (
  <Button
    onClick={onClick}
    startIcon={icon}
    variant="outlined"
    fullWidth
    className={className}
  >
    {label}
  </Button>
);

export default OAuthButton;