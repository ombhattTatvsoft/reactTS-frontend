import React from "react";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import type { CheckboxField as CheckboxProps } from "../../utils/FormFieldGenerator";

const CheckBox: React.FC<CheckboxProps> = ({
  label,
  disabled = false,
  ...props
}) => (
  <FormControlLabel className="mb-3"
    control={<Checkbox disabled={disabled} {...props} sx={{paddingY:0}}/>}
    label={
      <Typography variant="body2" sx={{ color: "#4b5563" }}>
        {label}
      </Typography>
    }
  />
);

export default CheckBox;
