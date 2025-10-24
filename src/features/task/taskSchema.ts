import * as Yup from "yup";
import { startOfToday } from "date-fns";
import { SCHEMA } from "../../constants/SchemaValidation";
import type { AttachmentItem } from "./taskSlice";

export const TaskSchema = (isUpdate: boolean) => {
  const today = startOfToday();

  return Yup.object().shape({
    _id: Yup.string(),
    projectId: Yup.string(),
    title: Yup.string().trim().max(30, SCHEMA.TITLE_MAX).required(SCHEMA.TITLE_REQ),
    description: Yup.string().max(200, SCHEMA.DESC_MAX).default(""),
    status: Yup.string().oneOf(["todo", "in-progress", "completed"]).required(SCHEMA.STATUS_REQ),
    priority: Yup.string().oneOf(["low", "medium", "high"]).required(SCHEMA.PRIORITY_REQ),
    assignee: Yup.string().required(SCHEMA.ASSIGNEE_REQ),
    dueDate: Yup.date()
      .required(SCHEMA.DUE_REQ)
      .test("due-date", SCHEMA.DUEDATE_VALID, function (value) {
        if (isUpdate) return true;
        return value ? value >= today : false;
      }),
    tags: Yup.string(),
    attachments: Yup.array().of(
      Yup.mixed<AttachmentItem>().test("fileSize", "File too large", (file) => {
        if (!file) return true;
        if (file instanceof File) {
          return file.size <= 5 * 1024 * 1024; // 5MB
        }
        return true;
      })
    ).default([]),
    deletedFilenames: Yup.array().of(Yup.string()).default([]),
  });
};

export type TaskPayload = Yup.InferType<ReturnType<typeof TaskSchema>>;
