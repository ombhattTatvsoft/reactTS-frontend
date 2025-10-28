import React, { useState, useEffect } from "react";
import { Upload, X, File, Image, FileText } from "lucide-react";
import type { AttachmentItem } from "../taskSlice";
import { backendUrl } from "../../../common/api/baseApi";
import { Paperclip } from "lucide-react";

interface AttachmentUploaderBaseProps {
  value?: AttachmentItem[];
  onChange?: (files: AttachmentItem[]) => void;
  currentUserId?: string;
  maxFiles?: number;
  accept?: string;
  maxSizeInMB?: number;
  allowDelete? : boolean;
}

const AttachmentUploader: React.FC<AttachmentUploaderBaseProps> = ({
  value,
  onChange,
  currentUserId,
  maxFiles = 5,
  accept = "*",
  maxSizeInMB = 5,
  allowDelete = false,
}) => {
  const [localFiles, setLocalFiles] = useState<AttachmentItem[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputId = `file-input-${React.useId().replace(/:/g, "-")}`;

  const files: AttachmentItem[] = value ?? localFiles;

  useEffect(() => {
    if (value) setLocalFiles(value);
  }, [value]);

  const writeFiles = (next: AttachmentItem[]) => {
    setLocalFiles(next);
    onChange?.(next);
  };

  const fileListToArray = (fl: FileList | File[]) =>
    Array.isArray(fl) ? fl : Array.from(fl);

  const validateFile = (file: File) => {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes)
      return `File ${file.name} exceeds ${maxSizeInMB}MB limit`;
    return null;
  };

  const handleFileChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { files: FileList | File[] } }
  ) => {
    setUploadError("");
    const selectedFiles = e.target.files;
    if (
      !selectedFiles ||
      (Array.isArray(selectedFiles) && selectedFiles.length === 0)
    )
      return;

    const toAdd = fileListToArray(selectedFiles);

    for (const file of toAdd) {
      const error = validateFile(file);
      if (error) {
        setUploadError(error);
        return;
      }
    }

    const allowedCount = Math.max(0, maxFiles - files.length);
    if (toAdd.length > allowedCount) {
      setUploadError(
        `Maximum ${maxFiles} files allowed. You can add ${allowedCount} more.`
      );
      return;
    }

    writeFiles([...files, ...toAdd.slice(0, allowedCount)]);
  };

  const isServerFile = (
    file: AttachmentItem
  ): file is Exclude<AttachmentItem, File> =>
    "url" in file && typeof file.url === "string";

  const handleRemove = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
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

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || ""))
      return <Image className="w-6 h-6 text-purple-600" />;
    if (["pdf", "doc", "docx", "txt"].includes(ext || ""))
      return <FileText className="w-6 h-6 text-purple-600" />;
    return <File className="w-6 h-6 text-purple-600" />;
  };

  const canDelete = (file: AttachmentItem) => {
    if (!isServerFile(file)) return true;
    return file.uploadedBy === currentUserId;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Paperclip size={16} className="text-gray-500" />
          Attachments
        </h3>
        <span className="text-xs text-gray-400">
          {value?.length} files
        </span>
      </div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border border-dashed rounded-xl px-6 py-2 cursor-pointer ${
          dragActive
            ? "border-purple-500 bg-purple-50/50"
            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
        }`}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
          disabled={files.length >= maxFiles}
        />
        <label
          htmlFor={inputId}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div
            className={`p-2 rounded-full mb-1 ${
              dragActive ? "bg-purple-100" : "bg-gray-100 hover:bg-purple-100"
            }`}
          >
            <Upload
              className={`w-5 h-5 ${
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
            Max files: {maxFiles}, Max size: {maxSizeInMB}MB
          </p>
          {uploadError && (
            <p className="text-sm text-red-500 mt-1">{uploadError}</p>
          )}
        </label>
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {files.map((file, idx) => {
            const serverFile = isServerFile(file);
            const displayName = serverFile
              ? file.originalName || file.fileName
              : file.name;
            const size = serverFile ? file.size : file.size ?? 0;
            const url = serverFile ? backendUrl + file.url : undefined;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
              >
                <div className="shrink-0">{getFileIcon(displayName)}</div>
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
                <div className="ml-auto flex items-center gap-1">
                  {(allowDelete || canDelete(file)) && (
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      title="Remove"
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;
