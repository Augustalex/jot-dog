import React from "react";
import NotesEntry from "../components/NotesEntry";
import { getOrCreateFile } from "../db/files";

export default async function Notes({ params }: { params: { key: string } }) {
  const file = await getOrCreateFile(params.key);

  return <NotesEntry selectedFile={file} />;
}
