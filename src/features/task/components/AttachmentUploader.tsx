import React, { useState, useEffect } from "react";
import { useField, useFormikContext } from "formik";
import { Upload, X, FileIcon } from "lucide-react";
import type { AttachmentItem } from "../taskSlice";

interface AttachmentUploaderProps {
  name?: string;
  label?: string;
  accept?: string;
  maxFiles?: number;
  deletedFieldName?: string;
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
  const formik = useFormikContext();
  const [field, , helpers] = useField<AttachmentItem[]>({ name });
  const [localFiles, setLocalFiles] = useState<AttachmentItem[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const isInsideFormik = Boolean(formik);
  const files = isInsideFormik ? field.value || [] : localFiles;

  // Sync local state for non-Formik usage
  useEffect(() => {
    if (!isInsideFormik && value) setLocalFiles(value);
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

  const fileListToArray = (fl: FileList | File[]) => {
    if (!fl) return [];
    if (fl instanceof FileList) return Array.from(fl);
    return Array.from(fl as File[]);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList | File[] } }
  ) => {
    if (!e.target.files || (Array.isArray(e.target.files) && e.target.files.length === 0)) return;
    const selectedFiles = fileListToArray(e.target.files);
    const allowedCount = Math.max(0, maxFiles - files.length);
    const toAdd = selectedFiles.slice(0, allowedCount);
    const merged = [...files, ...toAdd];
    writeFiles(merged);
  };

  const handleRemove = (index: number) => {
    const removed = files[index];
    const updated = files.filter((_, i) => i !== index);

    // If removed item is an existing (server) attachment object, track its filename
    if (isInsideFormik && removed && typeof removed !== "object") {
      // shouldn't happen; defensive
    }

    if (isInsideFormik) {
      // detect server-attachment vs File
      const isServerAttachment =
        removed &&
        typeof removed === "object" &&
        // check for common keys: filename or fileName and url/originalName
        (("fileName" in removed) ||
          ("filename" in removed) ||
          ("url" in removed) ||
          ("originalName" in removed) ||
          ("fileName" in removed));

      if (isServerAttachment) {
        // extract filename — try several keys
        const filename = removed.filename || removed.fileName || removed.fileName || removed.fileName;
        if (filename) {
          const currentDeleted: string[] = (formik.values?.[deletedFieldName] as string[]) || [];
          formik.setFieldValue(deletedFieldName, [...currentDeleted, filename]);
        }
      }
      helpers.setValue(updated);
      onChange?.(updated);
    } else {
      setLocalFiles(updated);
      onChange?.(updated);
    }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  };

  return (
    <div className="space-y-3 mb-3">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>

      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl px-6 py-4 transition-all duration-200 cursor-pointer ${
          dragActive ? "border-purple-500 bg-purple-50/50" : "border-gray-300 hover:border-purple-400 hover:bg-gray-50/50"
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
        <label htmlFor={`file-input-${name}`} className="flex flex-col items-center justify-center cursor-pointer">
          <div className={`p-3 rounded-full mb-3 transition-all ${dragActive ? "bg-purple-100" : "bg-gray-100 hover:bg-purple-100"}`}>
            <Upload className={`w-6 h-6 ${dragActive ? "text-purple-600" : "text-gray-600"}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">{dragActive ? "Drop files here" : "Click to upload or drag and drop"}</span>
          <p className="text-xs text-gray-400 mt-2">Supported: images, PDF, docx. Max files: {maxFiles}</p>
        </label>
      </div>

      {/* Files list */}
      {files && files.length > 0 && (
        <div className="space-x-2 space-y-2 flex flex-wrap">
          {files.map((file, idx) => {
            const isFile = file instanceof File;
            // try to read display name/size
            const displayName = isFile ? file.name : (file as any).originalName || (file as any).name || (file as any).filename || (file as any).fileName || "attachment";
            const size = isFile ? file.size : (file as any).size || 0;
            const url = !isFile && (file as any).url ? (file as any).url : undefined;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:bg-gray-50"
              >
                <FileIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />

                <div>
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-purple-600 hover:underline">
                      {displayName}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-700">{displayName}</p>
                  )}
                  <p className="text-xs text-gray-500">{formatFileSize(size)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="flex-shrink-0 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;
