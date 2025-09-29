import { useState } from 'react';
import { TextField, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { InputField } from '../../utils/FormFieldGenerator';

interface InputProps extends InputField {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const FormInput: React.FC<InputProps> = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  className = '',
  isPassword = false,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  return (
    <div className='mb-3'>
      <TextField 
        className={className}
        disabled={disabled}
        name={name}
        type={inputType}
        label={label}
        value={value}
        onChange={onChange}
        error={!!error}
        fullWidth
        variant="outlined"
        aria-label={label}
        slotProps={{
          input: {
            endAdornment: isPassword? (
              <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
          },
        }}
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  )
}

export default FormInput;
