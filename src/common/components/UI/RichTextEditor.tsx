import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "@mui-tiptap/rte";
import { Box } from "@mui/material";

const MUITiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // Link.configure({ openOnClick: false }),
      // Placeholder.configure({ placeholder: "Add a comment..." }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <Box sx={{ "& .ProseMirror": { minHeight: "100px", p: 1, border: "1px solid", borderColor: "grey.300", borderRadius: 1 } }}>
      <RichTextEditor
        editor={editor}
        controls={[["bold", "italic", "underline"], ["bulletList", "orderedList"], ["link"]]}
      />
    </Box>
  );
};

export default MUITiptapEditor;