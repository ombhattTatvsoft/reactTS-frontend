import { useField } from "formik";
import type { FormField } from "../../utils/FormFieldGenerator";
import FormInput from "./FormInput";
import FormCheckBox from './FormCheckBox';
import FormButton from "./FormButton";

interface FieldRendererProps {
  field: FormField;
  loading?: boolean
}
const FieldRenderer : React.FC<FieldRendererProps> = ({field, loading}) => {
  const [formikField, meta] = useField(field.name as string);
  if(field.type === "ReactNode")
    return field.component;
  const error = meta.touched && meta.error ? meta.error : undefined;

  const commonProps = {
    value: formikField.value,
    onChange: formikField.onChange,
    error,
  };

  switch (field.type) {
    case "text":
    case "email":
    case "number":
    case "password":
      return <FormInput {...commonProps} {...field} />;

    // case "select":
    //   return <FormSelect {...commonProps} handleChange={handleChange} />;

    case "checkbox":
      return (
        <FormCheckBox
          {...field}
          checked={Boolean(formikField.value)}
          onChange={formikField.onChange}
        />
      );

    // case "datepicker":
    //   return <FormDatePicker {...commonProps} />;

    // case "textarea":
    //   return <FormTextarea {...commonProps} rows={field.rows} />;

    // case "link":
    //   return <FormLink {...field} children={field.label} />;

    case "button":
    case "submit":
    case "reset":
      return <FormButton {...field} loading = {loading} />;

    default:
      return null;
  }
}

export default FieldRenderer  