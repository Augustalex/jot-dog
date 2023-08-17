import React from "react";
import { getOrCreateFile } from "../../notes/db-server/files";
import { LoginToNote } from "./LoginToNote";

type Props = {
  params: { key: string };
};

export default async function Notes({ params }: Props) {
  const key = params.key;
  const file = await getOrCreateFile(key);

  return <LoginToNote file={file} />;
}