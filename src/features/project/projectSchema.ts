import * as Yup from "yup";
import { SCHEMA } from "../../constants/SchemaValidation";
import { startOfToday } from "date-fns";

export const createProjectSchema = Yup.object().shape({
  name: Yup.string().trim().max(30, SCHEMA.PROJECT_MAX).required(SCHEMA.NAME_REQ),
  description: Yup.string().max(200, SCHEMA.DESC_MAX).default(""),
  startDate: Yup.date().min(startOfToday(), SCHEMA.STARTDATE_VALID).required(SCHEMA.STARTDATE_REQ),
  endDate: Yup.date().min(Yup.ref("startDate"), SCHEMA.ENDDATE_VALID).required(SCHEMA.ENDDATE_REQ),
  status: Yup.string().oneOf(["pending", "in-progress", "completed"]).required(SCHEMA.STATUS_REQ),
  // priority: Yup.string().oneOf(["low", "medium", "high"]).default("medium"),
  members: Yup.array().of(
      Yup.object().shape({
        email: Yup.string().email(SCHEMA.EMAIL_VALID).max(50, SCHEMA.EMAIL_MAX).required(SCHEMA.EMAIL_REQ),
        // user: Yup.string().matches(/^[0-9a-fA-F]{24}$/).required(SCHEMA.MEMBER_REQ),
        role: Yup.string().oneOf(["manager", "developer", "tester"]).default("developer"),
      })
    )
    .default([]),
});


export type ProjectPayload = Yup.InferType<typeof createProjectSchema>;