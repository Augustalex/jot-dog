import React from "react";
import NotesEntry from "../components/NotesEntry";
import { getOrCreateFile } from "../db/files";
import { cookies } from "next/headers";
import { getFile } from "../db/file";
import { redirect } from "next/navigation";

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
  const content = await getFile(file);

  return <NotesEntry file={file} content={content} localId={localId} />;
}
