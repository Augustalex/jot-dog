"use client";

import "./tiptap.scss";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import { useCollaborationProvider } from "./useCollaborationProvider";

const colors = [
  "#958DF1",
  "#F98181",
  "#FBBC88",
  "#FAF594",
  "#70CFF8",
  "#94FADB",
  "#B9F18D",
];

const names = [
  "Bei Hai",
  "Tom Smith",
  "John Doe",
  "Jane Doe",
  "Alice Johnson",
  "Bob Johnson",
  "Charlie Johnson",
  "David Johnson",
  "August Alexandersson",
  "Mikaela Andersson",
  "Elin Andersson",
  "Erik Andersson",
  "Lars Andersson",
  "Karin Andersson",
  "Maria Andersson",
  "Jacob Tailor",
  "John Tailor",
  "Jane Tailor",
  "Richard McMillan",
  "Ruth McMillan",
  "Robert McMillan",
];

const getRandomElement = (list: any) =>
  list[Math.floor(Math.random() * list.length)];

const getRandomColor = () => getRandomElement(colors);
const getRandomName = () => getRandomElement(names);

const getInitialUser = () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser)
    return {
      name: getRandomName(),
      color: getRandomColor(),
    };

  return (
    JSON.parse(currentUser) || {
      name: getRandomName(),
      color: getRandomColor(),
    }
  );
};

export default function Tiptap() {
  const [status, setStatus] = useState("connecting");
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [doc] = useState(new Y.Doc());

  const collaborationProvider = useCollaborationProvider(doc);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Highlight,
      Typography,
      CharacterCount.configure({
        limit: 10000,
      }),
      Collaboration.configure({
        document: doc,
      }),
      CollaborationCursor.configure({
        provider: collaborationProvider,
      }),
    ],
  });

  useEffect(() => {
    // Update status changes
    collaborationProvider.on("status", (event: any) => {
      setStatus(event.status);
    });
  }, [collaborationProvider, editor]);

  // Save current user to localStorage and emit to editor
  useEffect(() => {
    if (editor && currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      editor.chain().focus().updateUser(currentUser).run();
    }
  }, [editor, currentUser]);

  const setName = useCallback(() => {
    const name = (window.prompt("Name") || "").trim().substring(0, 32);

    if (name) {
      return setCurrentUser({ ...currentUser, name });
    }
  }, [currentUser]);

  return (
    <div className="editor">
      <EditorContent className="editor__content" editor={editor} />
      {editor && (
        <div className="editor__footer">
          <div className={`editor__status editor__status--${status}`}>
            {status === "connected"
              ? `${editor.storage.collaborationCursor.users.length} user${
                  editor.storage.collaborationCursor.users.length === 1
                    ? ""
                    : "s"
                } online`
              : "offline"}
          </div>
          <div className="editor__name">
            <button onClick={setName}>{currentUser.name}</button>
          </div>
        </div>
      )}
    </div>
  );
}
