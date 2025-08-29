"use client";

import { FC } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const TiptapEditor: FC<TiptapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // Her değişiklikte üst component’e HTML gönder
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg p-4 min-h-[150px] border rounded-lg",
      },
    },
    immediatelyRender: false, // <--- Bunu ekleyin
  });

  return (
    <div className="border rounded-lg overflow-hidden">
      <EditorContent editor={editor} className="prose p-4 min-h-[150px]" />
    </div>
  );
};

export default TiptapEditor;
