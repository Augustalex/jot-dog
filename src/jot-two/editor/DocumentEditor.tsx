"use client";

import "./tiptap.scss";
import { EditorContent } from "@tiptap/react";
import { useDocumentEditorContext } from "./DocumentEditorProvider";

export default function DocumentEditor() {
  const { editor } = useDocumentEditorContext();
  return <EditorContent className="editor__content" editor={editor} />;
}
