"use client";

import dynamic from "next/dynamic";
import { useRegisterView } from "../utils/useRecentlyViewed";
import { JotTwoFile } from "../file/file-utils";

const Document = dynamic(() => import("./Document").then((m) => m.Document), {
  ssr: false,
});

export function DocumentLoader({
  userFiles,
  file,
  localId,
}: {
  userFiles: JotTwoFile[];
  file: JotTwoFile;
  localId: string;
}) {
  useRegisterView(file);

  return <Document userFiles={userFiles} file={file} localId={localId} />;
}
