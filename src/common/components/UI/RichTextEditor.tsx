import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const RichTextEditor: React.FC<Props> = ({
  value = "",
  onChange,
  placeholder,
  disabled = false,
}) => {
  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        disabled={disabled}
        config={{
          licenseKey: 'GPL',
          placeholder: placeholder || "Write something...",
          image: {
            toolbar: ['imageTextAlternative'], // No upload
          },
          mediaEmbed: {
            output: 'iframe',
            previewsInData: true,
          },
        }}
        onChange={(_event, editor) => {
          const data = editor.getData();
          onChange?.(data);
        }}
      />
    </div>
  );
};

export default RichTextEditor;