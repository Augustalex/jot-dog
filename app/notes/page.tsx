import React from "react";
import NotesEntry from "./components/NotesEntry";
import {createFile, getFiles} from "./db/files";

export default async function Notes() {
  const files = await getFiles();
  const file = files.length === 0 ? await createFile() : files[files.length - 1];

  return <NotesEntry selectedFile={file} />;
}
