import React from "react";
import NotesEntry from "../../../jot-one/features/notes-entry/NotesEntry";
import { createFile, getOrCreateFile } from "../files/file-actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fileClient } from "../files/file-client";

import { Metadata } from "next";

type Props = {
  params: { key: string };
  searchParams?: { title: string | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const key = params.key;

  return {
    title: key.slice(0, 1).toUpperCase() + key.slice(1),
    description: "Jot down notes with your team",
    icons: ["pug", "kirby"].includes(key)
      ? ["kirby.webp"]
      : ["crabs", "payments"].includes(key)
        ? ["crab.png"]
        : ["mango", "mangos"].includes(key)
          ? ["mango.png"]
          : ["diego", "hair"].includes(key)
            ? ["diego.png"]
            : ["sad", "cat"].includes(key)
              ? ["sad.png"]
              : undefined,
  };
}

export default async function Notes({ params, searchParams }: Props) {
  const key = params.key;
  const title = searchParams?.title;

  if (key === "new") {
    const file = await createFile();
    return redirect(`/one/${file.key}`);
  }

  if (key.includes(".")) {
    const preDot = key.split(".")[0];
    return redirect(`/one/${preDot}`);
  }

  const localId = cookies().get("local-id")?.value ?? "anonymous";

  const file = await getOrCreateFile(key);
  const content = await fileClient.getBinaryFile(file);
  return (
    <NotesEntry
      file={file}
      content={content as Uint8Array}
      localId={localId}
      gotoTitle={title}
    />
  );
}
