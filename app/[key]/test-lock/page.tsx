import React from "react";
import { getOrCreateFile } from "../../notes/db-server/files";
import { LockNote } from "./LockNote";

type Props = {
  params: { key: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function Notes({ params, searchParams }: Props) {
  const key = params.key;
  const file = await getOrCreateFile(key);

  return <LockNote fileKey={file.key} />;
}
