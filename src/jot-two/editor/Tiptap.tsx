"use client";

import "./tiptap.scss";
import { TiptapCollabProvider } from "@hocuspocus/provider";
import CharacterCount from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";

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
  "Lea Thompson",
  "Cyndi Lauper",
  "Tom Cruise",
  "Madonna",
  "Jerry Hall",
  "Joan Collins",
  "Winona Ryder",
  "Christina Applegate",
  "Alyssa Milano",
  "Molly Ringwald",
  "Ally Sheedy",
  "Debbie Harry",
  "Olivia Newton-John",
  "Elton John",
  "Michael J. Fox",
  "Axl Rose",
  "Emilio Estevez",
  "Ralph Macchio",
  "Rob Lowe",
  "Jennifer Grey",
  "Mickey Rourke",
  "John Cusack",
  "Matthew Broderick",
  "Justine Bateman",
  "Lisa Bonet",
];

const getRandomElement = (list) =>
  list[Math.floor(Math.random() * list.length)];

const getRandomRoom = () => {
  const roomNumbers = [10, 11, 12];

  return getRandomElement(roomNumbers.map((number) => `rooms.${number}`));
};
const getRandomColor = () => getRandomElement(colors);
const getRandomName = () => getRandomElement(names);

const room = getRandomRoom();

const ydoc = new Y.Doc();
const websocketProvider = new TiptapCollabProvider({
  appId: "7j9y6m10",
  name: room,
  document: ydoc,
  url: "http://localhost:1234",
});

const getInitialUser = () => {
  return (
    JSON.parse(localStorage.getItem("currentUser")) || {
      name: getRandomName(),
      color: getRandomColor(),
    }
  );
};

export default function Tiptap() {
  const [status, setStatus] = useState("connecting");
  const [currentUser, setCurrentUser] = useState(getInitialUser);

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
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider: websocketProvider,
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "flex flex-col px-4 py-3 justify-start focus:outline-none outline-none border-none m-auto w-[960px] min-h-[90vh]",
      },
    },
    // content: `
    // <p>
    //   Markdown shortcuts make it easy to format the text while typing.
    // </p>
    // <p>
    //   To test that, start a new line and type <code>#</code> followed by a space to get a heading. Try <code>#</code>, <code>##</code>, <code>###</code>, <code>####</code>, <code>#####</code>, <code>######</code> for different levels.
    // </p>
    // <p>
    //   Those conventions are called input rules in Tiptap. Some of them are enabled by default. Try <code>></code> for blockquotes, <code>*</code>, <code>-</code> or <code>+</code> for bullet lists, or <code>\`foobar\`</code> to highlight code, <code>~~tildes~~</code> to strike text, or <code>==equal signs==</code> to highlight text.
    // </p>
    // <p>
    //   You can overwrite existing input rules or add your own to nodes, marks and extensions.
    // </p>
    // <p>
    //   For example, we added the <code>Typography</code> extension here. Try typing <code>(c)</code> to see how it’s converted to a proper © character. You can also try <code>-></code>, <code>>></code>, <code>1/2</code>, <code>!=</code>, or <code>--</code>.
    // </p>
    // `,
  });

  useEffect(() => {
    // Update status changes
    websocketProvider.on("status", (event) => {
      setStatus(event.status);
    });
  }, []);

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
      <div className="editor__footer">
        <div className={`editor__status editor__status--${status}`}>
          {status === "connected"
            ? `${editor.storage.collaborationCursor.users.length} user${
                editor.storage.collaborationCursor.users.length === 1 ? "" : "s"
              } online in ${room}`
            : "offline"}
        </div>
        <div className="editor__name">
          <button onClick={setName}>{currentUser.name}</button>
        </div>
      </div>
    </div>
  );
}
