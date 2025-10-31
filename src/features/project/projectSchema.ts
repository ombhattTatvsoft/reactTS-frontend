import * as Yup from "yup";
import { SCHEMA } from "../../constants/SchemaValidation";
import { startOfToday } from "date-fns";

export const ProjectSchema = (isUpdate = false) => {
  const today = startOfToday();

  return Yup.object().shape({
    _id: Yup.string(),
    name: Yup.string()
      .trim()
      .max(30, SCHEMA.PROJECT_MAX)
      .required(SCHEMA.NAME_REQ),
    description: Yup.string()
      .max(500, SCHEMA.DESC_MAX)
      .default(""),
    startDate: Yup.date()
      .required(SCHEMA.STARTDATE_REQ)
      .test("start-date", SCHEMA.STARTDATE_VALID, function (value) {
        if (isUpdate) return true;
        return value ? value >= today : false;
      }),
    endDate: Yup.date()
      .required(SCHEMA.ENDDATE_REQ)
      .test("end-date", SCHEMA.ENDDATE_VALID, function (value) {
        const { startDate } = this.parent;
        if (!startDate || !value) return true;
        return value >= startDate;
      }),
    status: Yup.string()
      .oneOf(["pending", "in-progress", "completed"])
      .required(SCHEMA.STATUS_REQ),
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
                const members: { email: string }[] =
                  this.options?.context?.members || this.parent?.members || [];
                const emailLower = value.trim().toLowerCase();
                const duplicateCount = members.filter(
                  (m) => m.email?.trim().toLowerCase() === emailLower
                ).length;
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
};

export type ProjectPayload = Yup.InferType<ReturnType<typeof ProjectSchema>>;
