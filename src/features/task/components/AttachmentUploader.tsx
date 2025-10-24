import React, { useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
import { Upload, X, FileIcon } from "lucide-react";
import type { AttachmentItem } from "../taskSlice";
import { backendUrl } from "../../../common/api/baseApi";

interface AttachmentUploaderProps {
  name?: string;
  deletedFieldName?: string;
  label?: string;
  accept?: string;
  maxFiles?: number;
  value?: AttachmentItem[];
  onChange?: (files: AttachmentItem[]) => void;
}

const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  name = "attachments",
  deletedFieldName = "deletedFilenames",
  label = "Attachments",
  accept = "*",
  maxFiles = 5,
  value,
  onChange,
}) => {
  const formik = useFormikContext<Record<string, unknown> | undefined>();
  const isInsideFormik = !!(formik && formik.values);

  const [field, meta, helpers] = useField<AttachmentItem[]>({ name });
  const [localFiles, setLocalFiles] = useState<AttachmentItem[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const files: AttachmentItem[] = isInsideFormik
    ? field.value ?? []
    : localFiles;

  useEffect(() => {
    if (!isInsideFormik && value) {
      setLocalFiles(value);
    }
  }, [value, isInsideFormik]);

  const writeFiles = (next: AttachmentItem[]) => {
    if (isInsideFormik) {
      helpers.setValue(next);
      onChange?.(next);
    } else {
      setLocalFiles(next);
      onChange?.(next);
    }
  };

  const fileListToArray = (fl: FileList | File[]): File[] => {
    return Array.isArray(fl) ? fl : Array.from(fl);
  };

  const handleFileChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { files: FileList | File[] } }
  ) => {
    const selectedFiles = e.target.files;
    if (
      !selectedFiles ||
      (Array.isArray(selectedFiles) && selectedFiles.length === 0)
    )
      return;

    const toAdd = fileListToArray(selectedFiles);
    const allowedCount = Math.max(0, maxFiles - files.length);
    const merged = [...files, ...toAdd.slice(0, allowedCount)];
    writeFiles(merged);
  };

  const handleRemove = (index: number) => {
    const removed = files[index];
    const updated = files.filter((_, i) => i !== index);

    if (isInsideFormik && removed && !(removed instanceof File)) {
      const filename = removed.fileName || removed.originalName || "";

      if (filename) {
        const currentDeleted =
          (formik?.values?.[deletedFieldName] as string[] | undefined) ?? [];
        formik?.setFieldValue(deletedFieldName, [...currentDeleted, filename]);
      }
    }

    writeFiles(updated);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files || []);
    if (droppedFiles.length)
      handleFileChange({ target: { files: droppedFiles } });
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes <= 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };
  return (
    <div className="space-y-3 mb-3">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl px-6 py-4 transition-all duration-200 cursor-pointer ${
          dragActive
            ? "border-purple-500 bg-purple-50/50"
            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50/50"
        }`}
      >
        <input
          type="file"
          id={`file-input-${name}`}
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor={`file-input-${name}`}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div
            className={`p-3 rounded-full mb-3 transition-all ${
              dragActive ? "bg-purple-100" : "bg-gray-100 hover:bg-purple-100"
            }`}
          >
            <Upload
              className={`w-6 h-6 ${
                dragActive ? "text-purple-600" : "text-gray-600"
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {dragActive
              ? "Drop files here"
              : "Click to upload or drag and drop"}
          </span>
          <p className="text-xs text-gray-400 mt-2">
            Supported: images, PDF, DOCX. Max files: {maxFiles}
          </p>
        </label>
      </div>

      {/* Files list */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, idx) => {
            const isLocal = file instanceof File;
            const displayName = isLocal
              ? file.name
              : file.originalName || file.fileName || "attachment";
            const size = isLocal ? file.size : file.size ?? 0;
            const url =
              !isLocal && file.url ? backendUrl + file.url : undefined;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:bg-gray-50"
              >
                <FileIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                <div className="min-w-[120px]">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-purple-600 hover:underline"
                    >
                      {displayName}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-700">
                      {displayName}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formatFileSize(size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="ml-auto flex-shrink-0 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500 mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default AttachmentUploader;
