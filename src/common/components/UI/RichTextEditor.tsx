import React, { useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Undo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Autoformat,
  TextTransformation,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Alignment,
  Subscript,
  Superscript,
  List,
  ListProperties,
  TodoList,
  SimpleUploadAdapter,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageResize,
  ImageBlock,
  ImageInline,
  ImageUpload,
  ImageInsertViaUrl,
  AutoImage,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  Mention,
  Heading,
  Link,
  BlockQuote,
  Indent,
  IndentBlock,
  MediaEmbed,
  Plugin,  // Add this import for base Plugin class
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { backendUrl } from "../../api/baseApi";
import type { Task } from "../../../features/task/taskSlice";

class MentionUserIdPlugin extends Plugin {
  static get pluginName() {
    return "MentionUserId";
  }

  init() {
    const { editor } = this;
    const schema = editor.model.schema;
    const conversion = editor.conversion;

    schema.extend("$text", { allowAttributes: "mention" });

    conversion.for("downcast").attributeToElement({
      model: "mention",
      view: (modelAttributeValue: any, { writer }) => {
        if (!modelAttributeValue) return;
        return writer.createAttributeElement("span", {
          class: "mention",
          "data-mention": modelAttributeValue.id,
          "data-user-id": modelAttributeValue.userId || "",
        });
      },
      converterPriority: "high",
    });

    conversion.for("upcast").elementToAttribute({
      view: {
        name: "span",
        classes: "mention",
      },
      model: {
        key: "mention",
        value: (viewElement: any) => ({
          id: viewElement.getAttribute("data-mention"),
          userId: viewElement.getAttribute("data-user-id") || null,
        }),
      },
      converterPriority: "high",
    });
  }
}

// Inject custom mention styling
const mentionStyles = `
  .ck-editor__editable .mention {
    background-color: #e0f2fe;
    color: #1e40af;
    padding: 1px 4px;
    border-radius: 4px;
    font-weight: 500;
  }
`;

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  className?: string;
  uploadUrl?: string;
  mentions?: Task["projectMembers"];
};

const RichTextEditor: React.FC<Props> = ({
  value = "",
  onChange,
  placeholder,
  disabled = false,
  label,
  error,
  className = "",
  uploadUrl = backendUrl + "/task/comment/image",
  mentions,
}) => {
  const { editorConfig } = useMemo(() => {
    const mentionFeed =
      mentions?.map((member) => ({
        id: `@${member.user.name}`, // Used for data-mention
        userId: member.user._id, // Used for data-user-id
        name: member.user.name,
        avatar: member.user.avatar,
        role: member.role,
      })) || [];
    return {
      editorConfig: {
        licenseKey: "GPL",
        placeholder: placeholder || "Write something...",

        plugins: [
          Essentials,
          Paragraph,
          Undo,
          Bold,
          Italic,
          Underline,
          Strikethrough,
          Autoformat,
          TextTransformation,
          FontBackgroundColor,
          SimpleUploadAdapter,
          FontColor,
          FontFamily,
          FontSize,
          Alignment,
          Subscript,
          Superscript,
          List,
          ListProperties,
          TodoList,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          ImageBlock,
          ImageInline,
          ImageUpload,
          ImageInsertViaUrl,
          AutoImage,
          Table,
          TableToolbar,
          TableProperties,
          TableCellProperties,
          Mention,
          Heading,
          Link,
          BlockQuote,
          Indent,
          IndentBlock,
          MediaEmbed,
          MentionUserIdPlugin,  // Add the custom plugin here
        ],

        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "subscript",
            "superscript",
            "|",
            "alignment",
            "|",
            "link",
            "blockQuote",
            "mediaEmbed",
            "|",
            "insertTable",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "|",
            "outdent",
            "indent",
            "|",
            "insertImage",
          ],
          shouldNotGroupWhenFull: false,
        },

        fontFamily: {
          supportAllValues: true,
        },

        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 22, 30],
          supportAllValues: true,
        },

        image: {
          toolbar: [
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
            "|",
            "toggleImageCaption",
            "imageTextAlternative",
            "|",
            "resizeImage",
          ],
          resizeEnabled: true,
          resizeOptions: [
            { name: "resizeImage:original", value: null, label: "Original" },
            { name: "resizeImage:50", value: "50", label: "50%" },
            { name: "resizeImage:75", value: "75", label: "75%" },
          ],
        },

        table: {
          contentToolbar: [
            "tableColumn",
            "tableRow",
            "mergeTableCells",
            "tableProperties",
            "tableCellProperties",
          ],
        },

        link: {
          decorators: {
            openInNewTab: {
              mode: "manual",
              label: "Open in new tab",
              defaultValue: true,
              attributes: {
                target: "_blank",
                rel: "noopener noreferrer",
              },
            },
          },
        },

        mediaEmbed: {
          output: "iframe",
          previewsInData: true,
        },

        mention: {
          feeds: [
            {
              marker: "@",
              feed: mentionFeed,
              minimumCharacters: 0,
              itemRenderer: (item: {
                id: string;
                userId: string | number;
                name: string;
                avatar?: string;
              }) => {
                const el = document.createElement("div");
                el.className =
                  "flex items-center gap-2 p-2 hover:bg-gray-100 rounded";

                const avatarUrl = item.avatar
                  ? `${backendUrl}${item.avatar.startsWith("/") ? "" : "/"}${
                      item.avatar
                    }`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      item.name
                    )}&background=6366f1&color=fff`;

                el.innerHTML = `
                  <img
                    src="${avatarUrl}"
                    class="rounded-full object-cover shrink-0"
                    alt="${item.name}"
                    style="aspect-ratio: 1/1; width: 24px; height: 24px;"
                  />
                  <span class="text-sm font-medium text-gray-800 truncate">${item.name}</span>
                `;

                return el;
              },
              // Attach custom data to mention attribute
              createMention: (item: { id: string; userId: string | number }) => ({
                id: item.id,
                userId: String(item.userId),
              }),
            },
          ],
        },

        simpleUpload: {
          uploadUrl,
          withCredentials: true,
        },
      },
    };
  }, [mentions, placeholder, uploadUrl]);

  return (
    <>
      <style>{mentionStyles}</style>
      <div className={className}>
        {label && (
          <label
            className={`font-medium text-sm mb-1 block ${
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
            config={editorConfig as any}
            onChange={(_event, editor) => {
              const data = editor.getData();
              onChange?.(data);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default RichTextEditor;