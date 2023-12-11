import React from "react";
import { createFile, getOrCreateFile } from "../../files/file-actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Metadata } from "next";
import Board from "../../../features/board/Board";
import { fileClient } from "../../files/file-client";

type Props = {
  params: { key: string };
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

export default async function BoardPage({ params }: Props) {
  const key = params.key;

  if (key === "new") {
    const file = await createFile();
    return redirect(`/${file.key}/board`);
  }

  if (key.includes(".")) {
    const preDot = key.split(".")[0];
    redirect(`/${preDot}`);
    return;
  }

  const localId = cookies().get("local-id")?.value ?? "anonymous";

  const file = await getOrCreateFile(key);
  const content = await fileClient.getBinaryFile(file);
  console.log("content", content);

  return <Board localId={localId} content={content} />;
}
