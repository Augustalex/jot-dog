import React from "react";
import NotesEntry from "../notes/components/NotesEntry";
import { createFile, getOrCreateFile } from "../notes/db/files";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fileClient } from "../notes/db/fileClient";

import { Metadata } from "next";

type Props = {
  params: { key: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = params.key;

  return {
    title: key,
    description: "Jot down notes with your team",
    icons: key === "pug" || key === "kirby" ? ["kirby.webp"] : undefined,
  };
}

export default async function Notes({ params }: Props) {
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
