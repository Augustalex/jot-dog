import { useFileContext } from "../file/FileContext";
import { IBM_Plex_Mono } from "next/font/google";
import { getAddress } from "../utils/getAddress";
import { EditDocument } from "../editor/document-settings/EditDocument";
import { EditLinkFile } from "../link-file/EditLinkFile";
import { FileType, isLinkFile, JotTwoFile } from "../file/file-utils";
import { ReactNode, useState } from "react";

const URL_MAX_LENGTH = 50;

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
export function DocumentTitle() {
  const { file } = useFileContext();
  const [status, setStatus] = useState<"ready" | "copied">("ready");

  const title = (
    file.fileType === FileType.Link ? getAddress(file.key) : file.name
  )
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <div className={ibmPlexMono.className}>
      <div className="flex flex-col items-start gap-2">
        <WrapWithEditor file={file}>
          <button className="-ml-2 rounded-lg p-2 outline-gray-200 hover:outline">
            <h1 className="spacing text-left text-5xl font-semibold tracking-tight text-zinc-900">
              {title}
            </h1>
          </button>
        </WrapWithEditor>
        {isLinkFile(file) &&
          (status === "ready" ? (
            <button
              className="relative left-0.5 -ml-1 rounded-lg p-1 outline-gray-200 hover:outline"
              onClick={() => copyLink(file.url)}
            >
              <h2 className="text-left text-xl tracking-tight text-zinc-900">
                {truncateUrl(file.url)}
              </h2>
            </button>
          ) : (
            <button
              className={`relative left-0.5 -ml-1 rounded-lg bg-green-100 p-1 outline-gray-200 hover:bg-green-100 hover:outline`}
            >
              <h2 className="text-left text-xl tracking-tight text-transparent">
                {truncateUrl(file.url)}
                <span className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-left text-xl tracking-tight text-zinc-900">
                  Copied link!
                </span>
              </h2>
            </button>
          ))}
      </div>
    </div>
  );

  function truncateUrl(url: string) {
    if (url.length > URL_MAX_LENGTH) {
      return url.slice(0, URL_MAX_LENGTH) + "...";
    }
    return url;
  }

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    setStatus("copied");
    setTimeout(() => setStatus("ready"), 3000);
  }
}

function WrapWithEditor({
  file,
  children,
}: {
  file: JotTwoFile;
  children: ReactNode;
}) {
  if (isLinkFile(file)) {
    return <EditLinkFile linkFile={file}>{children}</EditLinkFile>;
  } else {
    return <EditDocument>{children}</EditDocument>;
  }
}
