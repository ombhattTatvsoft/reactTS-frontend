import type { ButtonProps } from "@mui/material";

type SelectOption = { value: string | number; label: string };

interface BaseField {
  name: string;
  label: string;
  className?: string;
  containerClassName?: string;
  disabled?: boolean;
}

export interface InputField extends BaseField {
  type: "text" | "email" | "password" | "number";
  isPassword?: boolean;
}

interface SelectField extends BaseField {
  type: "select";
  options: SelectOption[];
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
}

interface LinkField extends BaseField {
  type: "link";
  to: string;
}

export interface ButtonField extends BaseField,Omit<ButtonProps,"name"> {
  type: "button" | "submit" | "reset";
  onClick?: () => void;
}

interface DatePickerField extends BaseField {
  type: "datepicker";
  minDate?: Date;
  maxDate?: Date;
}
interface ReactNodeField extends BaseField {
  type: "ReactNode";
  component: React.ReactNode;
}

export type FormField =
  | InputField
  | SelectField
  | CheckboxField
  | LinkField
  | ButtonField
  | DatePickerField
  | ReactNodeField

  export const createInputField = (props: Omit<InputField, "type"> & { type?: InputField["type"] }): InputField => ({
    type: props.isPassword ? "password" : props.type ?? "text",
    ...props,
  });
  
  export const createSelectDropdown = (props: Omit<SelectField, "type">): SelectField => ({
    type: "select",
    ...props,
  });
  
  export const createCheckBox = (props: Omit<CheckboxField, "type">): CheckboxField => ({
    type: "checkbox",
    ...props,
  });
  
  export const createLink = (props: Omit<LinkField, "type">): LinkField => ({
    type: "link",
    ...props,
  });
  
  export const createButton = (props: Omit<ButtonField, "type"> & { type?: ButtonField["type"] }): ButtonField => ({
    type: props.type ?? "button",
    ...props,
  });
  
  export const createDatePicker = (props: Omit<DatePickerField, "type">): DatePickerField => ({
    type: "datepicker",
    ...props,
  });
  
  export const createReactNode = (node: React.ReactNode): ReactNodeField => ({
    name:"ReactNode",
    label:"ReactNode",
    type: "ReactNode",
    component: node,
  });