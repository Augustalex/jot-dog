"use client";

import dynamic from "next/dynamic";
import { NoteFile } from "../../jot-one/utils/file-utils";
import { useRegisterView } from "../utils/useRecentlyViewed";

const Document = dynamic(() => import("./Document").then((m) => m.Document), {
  ssr: false,
});

export function DocumentLoader({
  userFiles,
  file,
  localId,
}: {
  userFiles: NoteFile[];
  file: NoteFile;
  localId: string;
}) {
  useRegisterView(file);

  return <Document userFiles={userFiles} file={file} localId={localId} />;
}
