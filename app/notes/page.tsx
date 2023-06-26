import React from "react";
import NotesEntry from "./components/NotesEntry";
import { createFile } from "./db/files";

export default async function Notes() {
  const newFile = await createFile();

  return <NotesEntry selectedFile={newFile} />;
}
