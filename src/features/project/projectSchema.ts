import * as Yup from "yup";
import { SCHEMA } from "../../constants/SchemaValidation";
import { startOfToday } from "date-fns";

export const createProjectSchema = Yup.object().shape({
  _id: Yup.string(),
  name: Yup.string().trim().max(30, SCHEMA.PROJECT_MAX).required(SCHEMA.NAME_REQ),
  description: Yup.string().max(200, SCHEMA.DESC_MAX).default(""),
  startDate: Yup.date().min(startOfToday(), SCHEMA.STARTDATE_VALID).required(SCHEMA.STARTDATE_REQ),
  endDate: Yup.date().min(Yup.ref("startDate"), SCHEMA.ENDDATE_VALID).required(SCHEMA.ENDDATE_REQ),
  status: Yup.string().oneOf(["pending", "in-progress", "completed"]).required(SCHEMA.STATUS_REQ),
  members: Yup.array()
  .of(
    Yup.object().shape({
      email: Yup.string()
        .email(SCHEMA.EMAIL_VALID)
        .max(50, SCHEMA.EMAIL_MAX)
        .required(SCHEMA.EMAIL_REQ)
        .test(
          "unique-email",
          "This email is already used",
          function (value) {
            if (!value) return true;
            const members : { email : string }[] = this.options?.context?.members || this.parent?.members || [];
            const emailLower = value.trim().toLowerCase();
            const duplicateCount = members.filter((m) => m.email?.trim().toLowerCase() === emailLower).length;
            return duplicateCount <= 1;
          }
        ),
      role: Yup.string()
        .oneOf(["manager", "developer", "tester"])
        .default("developer"),
    })
  )
  .default([]),
});

export type ProjectPayload = Yup.InferType<typeof createProjectSchema>;
