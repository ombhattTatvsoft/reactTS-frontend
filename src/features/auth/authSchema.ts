import * as Yup from "yup";
import { SCHEMA } from "./../../constants/SchemaValidation";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(SCHEMA.EMAIL_VALID)
    .max(50, SCHEMA.EMAIL_MAX)
    .required(SCHEMA.EMAIL_REQ),
  password: Yup.string()
    .min(8, SCHEMA.PASSWORD_MIN)
    .max(50, SCHEMA.PASSWORD_MAX)
    .required(SCHEMA.PASSWORD_REQ),
  remember: Yup.boolean().default(false),
});

export type LoginPayload = Yup.InferType<typeof loginSchema>;

export const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email(SCHEMA.EMAIL_VALID)
    .max(50, SCHEMA.EMAIL_MAX)
    .required(SCHEMA.EMAIL_REQ),
  password: Yup.string()
    .max(50, SCHEMA.PASSWORD_MAX)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/,
      SCHEMA.STRONG_PASSWORD
    )
    .required(SCHEMA.PASSWORD_REQ),
  confirmpassword: Yup.string()
    .required(SCHEMA.PASSWORD_REQ)
    .oneOf([Yup.ref("password")], SCHEMA.CONFIRM_PASSWORD_MATCH),
});

export type SignUpPayload = Yup.InferType<typeof SignupSchema>;
