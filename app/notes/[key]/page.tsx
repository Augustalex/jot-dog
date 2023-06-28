import React from "react";
import NotesEntry from "../components/NotesEntry";
import {getFiles, getOrCreateFile} from "../db/files";

export default async function Notes({ params }: { params: { key: string } }) {
  const files = await getFiles();
  const file = await getOrCreateFile(params.key, files);

  return <NotesEntry files={files} selectedFile={file} />;
}
