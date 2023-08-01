import React from "react";
import NotesEntry from "../components/NotesEntry";
import { getOrCreateFile } from "../db/files";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fileClient } from "../db/fileClient";

export default async function Notes({
  params,
}: {
  params: {
    key: string;
  };
}) {
  const localId = cookies().get("local-id")?.value;
  if (!localId) redirect(`/guest?redirect-to=/notes/${params.key}`);

  const file = await getOrCreateFile(params.key);
  const content = await fileClient.getBinaryFile(file);
  return (
    <NotesEntry file={file} content={content as Uint8Array} localId={localId} />
  );
}
