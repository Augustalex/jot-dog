import { useFileContext } from "../file/FileContext";
import { IBM_Plex_Mono } from "next/font/google";
import { DocumentSettingsModal } from "../editor/DocumentSettingsModal";
import { FileType } from "../../jot-one/utils/file-utils";
import { getAddress } from "../utils/getAddress";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});
export function DocumentTitle() {
  const { file } = useFileContext();

  const title = (
    file.fileType === FileType.Link ? getAddress(file.key) : file.name
  )
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return (
    <DocumentSettingsModal>
      <div className={ibmPlexMono.className}>
        <button className="-ml-2 rounded-lg p-2 outline-gray-200 hover:outline">
          <h1 className="spacing text-left text-5xl font-semibold tracking-tight text-zinc-900">
            {title}
          </h1>
        </button>
      </div>
    </DocumentSettingsModal>
  );
}
