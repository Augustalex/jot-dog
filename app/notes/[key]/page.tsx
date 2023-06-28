import React from "react";
import NotesEntry from "../components/NotesEntry";
import { getOrCreateFile } from "../db/files";
import { cookies } from "next/headers";
import { getFile } from "../db/file";

const localIdIfNew = `${Math.round(Math.random() * 9999)}-${Math.round(
  Math.random() * 9999
)}`;

export default async function Notes({
  params,
}: {
  params: {
    key: string;
  };
}) {
  const file = await getOrCreateFile(params.key);
  const content = await getFile(file);

  return (
    <NotesEntry
      file={file}
      content={content}
      localId={cookies().get("local-id")?.value ?? localIdIfNew}
    />
  );
}
