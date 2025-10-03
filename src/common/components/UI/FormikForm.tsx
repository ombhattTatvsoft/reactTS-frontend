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
      onSubmit={async (values) => {
        await saveAction(values);
      }}
    >
      {({isSubmitting}) => {
        return <Form className="flex flex-wrap -mx-2">
        {fields.map((field, index) => (
          <div key={index} className={field.containerclassname}>
            <FieldRenderer field={field} loading={isSubmitting}/>
          </div>
        ))}
      </Form>
      }}
    </Formik>
  );
}

export default FormikForm