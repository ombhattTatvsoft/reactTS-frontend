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
  name: Yup.string()
    .matches(/^[A-Za-z]+(?: [A-Za-z]+)*$/, SCHEMA.NAME_VALID)
    .max(50, SCHEMA.NAME_MAX)
    .required(SCHEMA.NAME_REQ),
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

export const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .max(50, SCHEMA.PASSWORD_MAX)
    .required(SCHEMA.PASSWORD_REQ),
  newPassword: Yup.string()
    .max(50, SCHEMA.PASSWORD_MAX)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/,
      SCHEMA.STRONG_PASSWORD
    )
    .required(SCHEMA.PASSWORD_REQ),
  confirmPassword: Yup.string()
    .required(SCHEMA.PASSWORD_REQ)
    .oneOf([Yup.ref("newPassword")], SCHEMA.CONFIRM_PASSWORD_MATCH),
});

export type ChangePasswordPayload = Yup.InferType<typeof ChangePasswordSchema>;
