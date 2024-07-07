import { createContext, ReactNode, useContext, useState } from "react";
import * as Y from "yjs";
import { JotTwoFile } from "./file-utils";

const FileContext = createContext<{
  file: JotTwoFile;
  userFiles: JotTwoFile[];
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
  userFiles,
  children,
}: {
  file: JotTwoFile;
  userFiles: JotTwoFile[];
  children: ReactNode;
}) {
  const [doc] = useState(new Y.Doc());

  return (
    <FileContext.Provider value={{ userFiles, file, doc }}>
      {children}
    </FileContext.Provider>
  );
}
