import styles from "./bottom-bar.module.css";
import downloadIcon from "../../app/images/download.svg";
import Image from "next/image";
import * as Y from "yjs";
import { getDocumentText } from "../../utils/getDocumentText";
import { NoteFile } from "../../utils/file-utils";

export function DownloadButton({
  file,
  yDoc,
}: {
  file: NoteFile;
  yDoc: Y.Doc | null;
}) {
  if (!yDoc) return <UnloadedDownloadButton />;
  return <LoadedDownloadButton file={file} yDoc={yDoc} />;
}

function LoadedDownloadButton({ file, yDoc }: { file: NoteFile; yDoc: Y.Doc }) {
  const textContent = getDocumentText(yDoc);
  const blob = new Blob([textContent], { type: "text/plain" });

  return (
    <a
      className={styles.bottomBarButton}
      href={URL.createObjectURL(blob)}
      download={`${file.key}.txt`}
      title="Download copy"
    >
      <Icon />
    </a>
  );
}

function UnloadedDownloadButton() {
  return (
    <a className={styles.bottomBarButton} title="Download copy" href="#">
      <Icon />
    </a>
  );
}

function Icon() {
  return (
    <Image
      src={downloadIcon.src}
      alt="Board"
      width={42}
      height={42}
      style={{ transform: "scale(.86) translate(0, -2px)" }}
    />
  );
}
