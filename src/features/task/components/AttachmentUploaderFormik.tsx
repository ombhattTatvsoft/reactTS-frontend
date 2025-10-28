import React from "react";
import { useField, useFormikContext } from "formik";
import type { AttachmentItem } from "../taskSlice";
import AttachmentUploader from "./AttachmentUploader";

interface AttachmentUploaderFormikWrapperProps {
  name: string;
  deletedFieldName?: string;
  maxFiles?: number;
  accept?: string;
  maxSizeInMB?: number;
}

const AttachmentUploaderFormikWrapper: React.FC<
  AttachmentUploaderFormikWrapperProps
> = ({
  name,
  deletedFieldName = "deletedFilenames",
  maxFiles,
  accept,
  maxSizeInMB,
}) => {
  const formik = useFormikContext<Record<string, unknown>>();
  const [field, , helpers] = useField<AttachmentItem[]>(name);

  const isServerAttachment = (
    item: AttachmentItem
  ): item is Exclude<AttachmentItem, File> =>
    "url" in item && typeof item.url === "string";

  const handleChange = (newFiles: AttachmentItem[]) => {
    const oldFiles = field.value ?? [];

    const removedServerFiles = oldFiles.filter(
      (oldFile) =>
        isServerAttachment(oldFile) &&
        !newFiles.some(
          (newFile) =>
            isServerAttachment(newFile) &&
            (newFile.fileName || newFile.originalName) ===
              (oldFile.fileName || oldFile.originalName)
        )
    );

    if (removedServerFiles.length && deletedFieldName) {
      const currentDeleted =
        (formik.values[deletedFieldName] as string[] | undefined) ?? [];
      const removedNames = removedServerFiles
        .filter(isServerAttachment)
        .map((f) => f.fileName || f.originalName || "")
        .filter(Boolean);
      formik.setFieldValue(deletedFieldName, [
        ...currentDeleted,
        ...removedNames,
      ]);
    }

    helpers.setValue(newFiles);

    helpers.setTouched(true);
  };

  return (
      <AttachmentUploader
        value={field.value ?? []}
        onChange={handleChange}
        accept={accept}
        maxFiles={maxFiles}
        maxSizeInMB={maxSizeInMB}
        allowDelete={true}
      />
  );
};

export default AttachmentUploaderFormikWrapper;
