import { useField, useFormikContext, type FormikValues } from "formik";
import type { FormField } from "../../utils/FormFieldGenerator";
import FormInput from "./FormInput";
import FormCheckBox from './FormCheckBox';
import FormButton from "./FormButton";
import FormSelect from "./FormSelect";
import FormDatePicker from "./FormDatePicker";
import FormTextArea from "./FormTextArea";

interface FieldRendererProps {
  field: FormField;
  loading?: boolean
}
const FieldRenderer : React.FC<FieldRendererProps> = ({field, loading}) => {
  const [formikField, meta] = useField(field.name as string);
  const { values } = useFormikContext<FormikValues>();

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

    case "select":
      return <FormSelect {...commonProps} {...field} />;

    case "checkbox":
      return (
        <FormCheckBox
          {...field}
          checked={Boolean(formikField.value)}
          onChange={formikField.onChange}
        />
      );

    case "datepicker":
      return <FormDatePicker {...commonProps} {...field} formikValues={values}/>;

    case "textarea":
      return <FormTextArea {...commonProps} {...field} />;

    case "button":
    case "submit":
    case "reset":
      return <FormButton {...field} loading = {loading} />;

    default:
      return null;
  }
}

export default FieldRenderer  