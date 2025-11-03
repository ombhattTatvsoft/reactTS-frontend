import React, { useEffect, useState, useRef } from "react";
import { Upload, X, File, Image, FileText, Paperclip } from "lucide-react";
import type { AttachmentItem } from "../taskSlice";
import { backendUrl } from "../../../common/api/baseApi";

interface AttachmentUploaderProps {
  value?: AttachmentItem[];
  onChange?: (files: AttachmentItem[]) => void;
  onSave?: (payload: { files: File[]; deletedFilenames: string[] }) => void;
  showSaveButton?: boolean;
  currentUserId?: string;
  maxFiles?: number;
  accept?: string;
  maxSizeInMB?: number;
  allowDelete?: boolean;
}

const isServerFile = (
  file: AttachmentItem
): file is Exclude<AttachmentItem, File> =>
  "url" in file && typeof file.url === "string";

const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({
  value = [],
  onChange,
  onSave,
  showSaveButton = false,
  currentUserId,
  maxFiles = 5,
  accept = "*",
  maxSizeInMB = 5,
  allowDelete = false,
}) => {
  const [currentFiles, setCurrentFiles] = useState<AttachmentItem[]>(value);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [deletedFilenames, setDeletedFilenames] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const initialServerRef = useRef<Exclude<AttachmentItem, File>[]>([]);

  useEffect(() => {
    setCurrentFiles(value);
    if (showSaveButton) {
      initialServerRef.current = value.filter(isServerFile);
    }
  }, [value, showSaveButton]);

  const emitChange = (files: AttachmentItem[]) => {
    setCurrentFiles(files);
    onChange?.(files);
  };

  const emitSave = () => {
    onSave?.({ files: filesToUpload, deletedFilenames });
    setDeletedFilenames([]);
    setCurrentFiles([]);
    setFilesToUpload([]);
  };

  const validateFile = (file: File) => {
    const max = maxSizeInMB * 1024 * 1024;
    if (file.size > max) return `File ${file.name} exceeds ${maxSizeInMB} MB`;
    return null;
  };

  const addFiles = (newFiles: File[]) => {
    setError("");

    for (const f of newFiles) {
      const err = validateFile(f);
      if (err) {
        setError(err);
        return;
      }
    }

    const canAdd = Math.max(0, maxFiles - currentFiles.length);
    if (newFiles.length > canAdd) {
      setError(
        `Maximum ${maxFiles} files allowed. You can add ${canAdd} more.`
      );
      return;
    }

    const toAdd = newFiles.slice(0, canAdd);
    const next = [...currentFiles, ...toAdd];
    setFilesToUpload((prev) => [...prev, ...toAdd]);
    emitChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) addFiles(Array.from(files));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) addFiles(dropped);
  };

  const removeAt = (idx: number) => {
    const removed = currentFiles[idx];
    const next = currentFiles.filter((_, i) => i !== idx);
    emitChange(next);

    if (isServerFile(removed)) {
      const name = removed.fileName || removed.originalName || "";
      if (name) setDeletedFilenames((prev) => [...prev, name]);
    } else {
      setFilesToUpload((prev) => prev.filter((f) => f !== removed));
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const sizes = ["B", "KB", "MB", "GB"];
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
      return <Image className="w-6 h-6 text-purple-600" />;
    if (["pdf", "doc", "docx", "txt"].includes(ext))
      return <FileText className="w-6 h-6 text-purple-600" />;
    return <File className="w-6 h-6 text-purple-600" />;
  };

  const canDelete = (file: AttachmentItem) => {
    if (!isServerFile(file)) return true;
    return file.uploadedBy?._id === currentUserId;
  };

  const isDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const inputId = `file-input-${React.useId().replace(/:/g, "-")}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Paperclip size={16} className="text-gray-500" />
          Attachments
        </h3>
        <span className="text-xs text-gray-400">
          {currentFiles.length} files
        </span>
      </div>

      {/* Drag & Drop / Click area */}
      <div
        onDragEnter={isDrag}
        onDragOver={isDrag}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        className={`relative border border-dashed rounded-xl px-6 py-2 cursor-pointer transition-colors ${
          dragActive
            ? "border-purple-500 bg-purple-50/50"
            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
        }`}
      >
        <input
          id={inputId}
          type="file"
          multiple
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          disabled={currentFiles.length >= maxFiles}
        />
        <label
          htmlFor={inputId}
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <div
            className={`p-2 rounded-full mb-1 ${
              dragActive ? "bg-purple-100" : "bg-gray-100"
            }`}
          >
            <Upload
              className={`w-5 h-5 ${
                dragActive ? "text-purple-600" : "text-gray-600"
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {dragActive ? "Drop files here" : "Click to upload or drag & drop"}
          </span>
          <p className="text-xs text-gray-400 mt-1">
            Max {maxFiles} files, {maxSizeInMB} MB each
          </p>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </label>
      </div>

      {/* File list */}
      {currentFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {currentFiles.map((file, idx) => {
            const server = isServerFile(file);
            const name = server
              ? file.originalName || file.fileName
              : file.name;
            const size = server ? file.size : file.size ?? 0;
            const url = server ? backendUrl + file.url : undefined;
            const uploadedBy = server ? file.uploadedBy?.name : undefined;

            return (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
              >
                <div className="shrink-0">{getIcon(name)}</div>
                <div className="min-w-[120px]">
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-purple-600 hover:underline"
                    >
                      {name}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-gray-700">{name}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {formatSize(size)} {uploadedBy && `by ${uploadedBy}`}
                  </p>
                </div>

                {(allowDelete || canDelete(file)) && (
                  <button
                    type="button"
                    onClick={() => removeAt(idx)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showSaveButton && onSave && (
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={emitSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Save Attachments
          </button>
        </div>
      )}
    </div>
  );
};

export default AttachmentUploader;
