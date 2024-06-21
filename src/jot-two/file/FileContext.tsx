import { createContext, ReactNode, useContext, useState } from "react";
import { NoteFile } from "../../jot-one/utils/file-utils";
import * as Y from "yjs";

const FileContext = createContext<{
  file: NoteFile;
  doc: Y.Doc;
} | null>(null);

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFileContext must be used within a FileProvider");
  }

  return context;
}

export function FileProvider({
  file,
  children,
}: {
  file: NoteFile;
  children: ReactNode;
}) {
  const [doc] = useState(new Y.Doc());

  return (
    <FileContext.Provider value={{ file, doc }}>
      {children}
    </FileContext.Provider>
  );
}
