import type { ObjectSchema } from "yup";
import { Form, Formik } from 'formik';
import type { FormField } from "../../utils/FormFieldGenerator";
import FieldRenderer from "./FieldRenderer";

interface FormikFormProps<T extends object> {
  initialValues: T;
  validationSchema: ObjectSchema<T>;
  saveAction: (values: T) => Promise<void> | void;
  fields: FormField[];
}
const FormikForm = <T extends object>({
  initialValues,
  validationSchema,
  saveAction,
  fields,
} : FormikFormProps<T>) => {
  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values,{setSubmitting}) => {
        await saveAction(values);
        setSubmitting(false);
      }}
    >
      {({isSubmitting}) => (
        <Form>
          {fields.map((field, index) => (
            <FieldRenderer key={index} field={field} loading={isSubmitting}/>
          ))}
        </Form>
      )}
    </Formik>
  );
}

export default FormikForm