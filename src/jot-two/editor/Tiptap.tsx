"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Tiptap() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <p>
        This is an example of a Medium-like editor. Enter a new line and some buttons will appear.
      </p>
      <p></p>
    `,
  });

  return (
    <>
      <EditorContent editor={editor} />
    </>
  );
}
