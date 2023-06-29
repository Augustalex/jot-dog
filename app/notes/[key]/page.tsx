import React from "react";
import NotesEntry from "../components/NotesEntry";
import { getOrCreateFile } from "../db/files";
import { cookies } from "next/headers";
import { getFile } from "../db/file";

export default async function Notes({
  params,
  searchParams,
}: {
  params: {
    key: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const file = await getOrCreateFile(params.key);
  const content = await getFile(file);

  const customName = searchParams["name"]?.toString() ?? null;

  return (
    <NotesEntry
      file={file}
      content={content}
      customName={customName}
      localId={cookies().get("local-id")?.value}
    />
  );
}
