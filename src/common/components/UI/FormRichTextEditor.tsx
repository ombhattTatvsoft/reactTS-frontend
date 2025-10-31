import React from "react";
import { useField } from "formik";
import { FormHelperText } from "@mui/material";
import RichTextEditor from "./RichTextEditor";

interface FormRichTextProps {
  name: string;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
}

const FormRichTextEditor: React.FC<FormRichTextProps> = ({
  name,
  placeholder,
  disabled,
  label,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="mb-3">
      <RichTextEditor
        value={field.value}
        onChange={(val) => helpers.setValue(val)}
        disabled={disabled}
        placeholder={placeholder}
        error={meta.touched && meta.error ? meta.error : undefined}
        label={label}
      />

      {meta.touched && meta.error && (
        <FormHelperText error>{meta.error}</FormHelperText>
      )}
    </div>
  );
};

export default FormRichTextEditor;
