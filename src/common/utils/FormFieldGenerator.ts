import type { ButtonProps, CheckboxProps, MenuItemProps, SelectProps, TextFieldProps } from "@mui/material";
import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import type { FormikValues } from "formik";

type SelectOption = { value: string | number; label: string; muiProps?: MenuItemProps };

interface BaseField {
  name: string;
  label: string;
  className?: string;
  containerclassname?: string;
  disabled?: boolean;
}

export interface InputField extends BaseField,Omit<TextFieldProps,"label" | "name" | "error">{
  type: "text" | "email" | "password" | "number";
  isPassword?: boolean;
}

export interface SelectField extends BaseField,Omit<SelectProps,"name" | "label" | "error"> {
  type: "select";
  options: SelectOption[];
}

export interface CheckboxField extends BaseField,Omit<CheckboxProps,"name">{
  type: "checkbox";
}

export interface ButtonField extends BaseField,Omit<ButtonProps,"name"> {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
}

export interface DatePickerField extends BaseField,Omit<DatePickerProps<true>,"name" | "label" | "value" | "onChange"> {
  type: "datepicker";
  minDatefunc? : (values : FormikValues) => Date;
  maxDatefunc? : (values : FormikValues) => Date;
}

export interface TextAreaField extends BaseField,Omit<TextFieldProps, "label" | "name" | "error"> {
  type: "textarea";
  rows?: number;
  maxRows?: number;
}

interface ReactNodeField extends BaseField {
  type: "ReactNode";
  component: React.ReactNode;
}

export type FormField =
  | InputField
  | SelectField
  | CheckboxField
  | ButtonField
  | DatePickerField
  | TextAreaField
  | ReactNodeField

  export const createInputField = (props: Omit<InputField, "type"> & { type?: InputField["type"] }): InputField => ({
    type: props.isPassword ? "password" : props.type ?? "text",
    containerclassname:"w-full px-2",
    ...props,
  });
  
  export const createSelectDropdown = (props: Omit<SelectField, "type">): SelectField => ({
    type: "select",
    containerclassname:"w-full px-2",
    ...props,
  });
  
  export const createCheckBox = (props: Omit<CheckboxField, "type">): CheckboxField => ({
    type: "checkbox",
    containerclassname:"w-full px-2",
    ...props,
  });
  
  export const createButton = (props: Omit<ButtonField, "type"> & { type?: ButtonField["type"] }): ButtonField => ({
    type: props.type ?? "button",
    containerclassname:"w-full px-2",
    ...props,
  });
  
  export const createDatePicker = (props: Omit<DatePickerField, "type">): DatePickerField => ({
    type: "datepicker",
    containerclassname:"w-full px-2",
    ...props,
  });
  
  export const createTextArea = (props: Omit<TextAreaField, "type">): TextAreaField => ({
    type: "textarea",
    containerclassname:"w-full px-2",
    ...props,
  })

  export const createReactNode = (node: React.ReactNode): ReactNodeField => ({
    name:"ReactNode",
    label:"ReactNode",
    type: "ReactNode",
    containerclassname:"w-full px-2",
    component: node,
  });
