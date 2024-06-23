import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DocumentLoader } from "../../../../jot-two/document/DocumentLoader";
import {
  getOrCreateUserFile,
  getUserFiles,
} from "../../files/user-file-actions";

type Props = {
  params: { key: string; subkey: string };
  searchParams?: {};
};

export default async function UserDocumentPage({
  params: { key: username, subkey: fileKey },
}: Props) {
  if (fileKey.includes(".")) {
    const preDot = fileKey.split(".")[0];
    return redirect(`/${username}/${preDot}`);
  }

  const localId = cookies().get("local-id")?.value;
  if (!localId) throw new Error("No local id");

  const userFiles = await getUserFiles();
  const file = await getOrCreateUserFile({ username, fileKey });

  return <DocumentLoader userFiles={userFiles} file={file} localId={localId} />;
}
