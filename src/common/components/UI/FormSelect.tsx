import React from "react";
import { Select, MenuItem, FormHelperText, InputLabel, FormControl } from "@mui/material";
import type { SelectField } from "../../utils/FormFieldGenerator";

interface FormSelectProps extends SelectField {
  error?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  error,
  ...muiProps
}) => {
  return (
    <div className="mb-3">
      <FormControl fullWidth variant="outlined" error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select label={label} {...muiProps} name={name}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} {...opt.muiProps}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
    </div>
  );
};

export default FormSelect;


