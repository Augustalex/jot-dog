import { CloseButton } from "./CloseButton";
import { useFileContext } from "../file/FileContext";
import { useRouter } from "next/navigation";
import { useOpenFiles } from "../utils/useOpenFiles";

export function FileBar() {
  const { file } = useFileContext();
  const { openFiles, isReady, closeFile } = useOpenFiles();
  const router = useRouter();

  if (!isReady) return null;

  const sortedFiles = openFiles.toSorted((a, b) =>
    a.firstOpenedTime.localeCompare(b.firstOpenedTime),
  );

  return (
    <>
      {sortedFiles.map((openFile) => {
        const selected = file.key === openFile.file.key;

        return (
          <a
            key={openFile.file.key}
            href={`/${openFile.file.key}`}
            className={`floating-shadow flex min-w-[96px] shrink-0 items-center justify-between whitespace-nowrap rounded-lg p-2 text-zinc-900 ${selected ? "bg-indigo-100 text-blue-950" : "bg-white"} ${selected ? "" : "cursor-pointer hover:bg-indigo-50"} `}
          >
            <div className="text-sm">{openFile.file.name}</div>
            <CloseButton
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                closeFile(openFile.file);

                if (selected) {
                  const anotherOpenFile = sortedFiles
                    .slice()
                    .reverse()
                    .find((recent) => recent.file.key !== file.key);
                  if (anotherOpenFile) {
                    router.push(`/${anotherOpenFile.file.key}`);
                  } else {
                    router.push(`/`);
                  }
                }
              }}
            />
          </a>
        );
      })}
    </>
  );
}
