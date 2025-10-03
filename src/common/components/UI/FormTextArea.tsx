import React from "react";
import { TextField, FormHelperText } from "@mui/material";
import type { TextAreaField } from "../../utils/FormFieldGenerator";

interface FormTextAreaProps extends TextAreaField {
  error?: string;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  error,
  rows = 3,
  ...muiProps
}) => {
  return (
    <div className="mb-3">
      <TextField
        {...muiProps}
        error={!!error}
        fullWidth
        multiline
        rows={rows}
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </div>
  );
};

export default FormTextArea;
