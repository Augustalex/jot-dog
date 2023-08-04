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
  const key = params.key;
  if (key.includes(".")) {
    const preDot = key.split(".")[0];
    redirect(`/${preDot}`);
    return;
  }

  const localId = cookies().get("local-id")?.value;
  if (!localId) redirect(`/guest?redirect-to=/notes/${key}`);

  const file = await getOrCreateFile(key);
  const content = await fileClient.getBinaryFile(file);
  return (
    <NotesEntry file={file} content={content as Uint8Array} localId={localId} />
  );
}
