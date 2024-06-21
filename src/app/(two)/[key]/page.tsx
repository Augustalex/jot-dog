import React from "react";
import { createFile, getOrCreateFile } from "../../files/file-actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DocumentLoader } from "../../../jot-two/document/DocumentLoader";

type Props = {
  params: { key: string };
  searchParams?: {};
};

export default async function DocumentPage({ params }: Props) {
  const key = params.key;

  if (key === "new") {
    const file = await createFile();
    return redirect(`/${file.key}`);
  }

  if (key.includes(".")) {
    const preDot = key.split(".")[0];
    return redirect(`/${preDot}`);
  }

  const localId = cookies().get("local-id")?.value;
  if (!localId) throw new Error("No local id");

  const file = await getOrCreateFile(key);

  return <DocumentLoader file={file} localId={localId} />;
}
