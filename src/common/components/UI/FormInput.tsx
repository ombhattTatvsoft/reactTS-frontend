import { useState } from 'react';
import { TextField, IconButton, InputAdornment, FormHelperText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { InputField } from '../../utils/FormFieldGenerator';

interface InputProps extends InputField {
  error?: string;
}

const FormInput: React.FC<InputProps> = ({
  type = 'text',
  error,
  isPassword = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  return (
    <div className='mb-3'>
      <TextField
        type={inputType}
        error={!!error}
        fullWidth
        variant="outlined"
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
        {...props}
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  )
}

export default FormInput;
