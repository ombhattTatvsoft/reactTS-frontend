import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FormHelperText, FormControl } from "@mui/material";
import type { DatePickerField } from "../../utils/FormFieldGenerator";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, parseISO } from "date-fns";
import type { FormikValues } from "formik";

interface DatePickerProps extends DatePickerField {
  value: string | Date | null;
  onChange?: (event: { target: { name: string; value: string | null } }) => void;
  error?: string;
  formikValues?: FormikValues;
}

const FormDatePicker: React.FC<DatePickerProps> = ({
  error,
  value,
  onChange,
  ...muiProps
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="mb-3">
        <FormControl fullWidth>
          <DatePicker
            minDate={
              muiProps.minDatefunc && muiProps.formikValues
                ? (() => {
                    const result = muiProps.minDatefunc(muiProps.formikValues);
                    return typeof result === "string" ? parseISO(result) : result;
                  })()
                : undefined
            }
            maxDate={
              muiProps.maxDatefunc && muiProps.formikValues
                ? (() => {
                    const result = muiProps.maxDatefunc(muiProps.formikValues);
                    return typeof result === "string" ? parseISO(result) : result;
                  })()
                : undefined
            }
            {...muiProps}
            value={
              value
                ? typeof value === "string"
                  ? parseISO(value)
                  : value
                : null
            }
            onChange={(date) => {
              if (onChange) {
                onChange({
                  target: {
                    name: muiProps.name,
                    value: date ? format(date, "yyyy-MM-dd") : null,
                  },
                });
              }
            }}
          />
        </FormControl>
        {error && <FormHelperText error>{error}</FormHelperText>}
      </div>
    </LocalizationProvider>
  );
};

export default FormDatePicker;
