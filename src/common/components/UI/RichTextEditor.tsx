import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  className?: string;
};

const RichTextEditor: React.FC<Props> = ({
  value = "",
  onChange,
  placeholder,
  disabled = false,
  label,
  error,
  className = "",
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          className={`font-medium text-sm mb-1 block  ${
            error ? "text-red-500" : "text-gray-700"
          }`}
        >
          {label}
        </label>
      )}

      <div
        className={`rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } bg-white focus-within:border-violet-600 hover:border-violet-600 transition-shadow shadow-sm`}
      >
        <CKEditor
          editor={ClassicEditor}
          data={value}
          disabled={disabled}
          config={{
            licenseKey: "GPL",
            placeholder: placeholder || "Write something...",
            image: {
              toolbar: ["imageTextAlternative"],
            },
            mediaEmbed: {
              output: "iframe",
              previewsInData: true,
            },
          }}
          onChange={(_event, editor) => {
            const data = editor.getData();
            onChange?.(data);
          }}
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
