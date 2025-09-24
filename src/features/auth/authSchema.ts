import * as Yup from "yup";
import { SCHEMA } from './../../constants/SchemaValidation';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(SCHEMA.EMAIL_VALID)
    .max(50, SCHEMA.EMAIL_MAX)
    .required(SCHEMA.EMAIL_REQ),
  password: Yup.string()
    .min(6, SCHEMA.PASSWORD_MIN)
    .max(50, SCHEMA.PASSWORD_MAX)
    .required(SCHEMA.PASSWORD_REQ),
  remember: Yup.boolean().default(false),
});

export type LoginPayload = Yup.InferType<typeof loginSchema>;