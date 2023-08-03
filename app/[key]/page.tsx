import React from "react";
import NotesEntry from "../notes/components/NotesEntry";
import { createFile, getOrCreateFile } from "../notes/db/files";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fileClient } from "../notes/db/fileClient";

export default async function Notes({
  params,
}: {
  params: {
    key: string;
  };
}) {
  const localId = cookies().get("local-id")?.value;
  if (!localId) redirect(`/guest?redirect-to=/${params.key}`);

  if (params.key === "new") {
    const file = await createFile();
    return redirect(`/${file.key}`);
  } else {
    const file = await getOrCreateFile(params.key);
    const content = await fileClient.getBinaryFile(file);
    return (
      <NotesEntry
        file={file}
        content={content as Uint8Array}
        localId={localId}
      />
    );
  }
}