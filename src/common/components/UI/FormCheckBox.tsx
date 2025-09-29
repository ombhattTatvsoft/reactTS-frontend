import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
} from "@mui/material";
import type { CheckboxField } from "../../utils/FormFieldGenerator";

interface CheckBoxProps extends CheckboxField {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  name,
  label,
  checked,
  onChange,
  error,
  disabled = false,
}) => (
  <div>
    <FormControlLabel
      control={
        <Checkbox
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
        />
      }
      label={
        <Typography variant="body2" sx={{ color: "#4b5563" }}>
          {label}
        </Typography>
      }
    />
    {error && <FormHelperText error>{error}</FormHelperText>}
  </div>
);

export default CheckBox;
