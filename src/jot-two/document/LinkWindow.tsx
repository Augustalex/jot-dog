import { FullscreenIcon } from "../icons/FullscreenIcon";
import { useFileContext } from "../file/FileContext";
import { DocumentTitle } from "./DocumentTitle";
import { Features } from "../../features";
import { DocumentActions } from "./DocumentActions";
import { PresenceRow } from "../presence/PresenceRow";
import { useState } from "react";
import { CloseIcon } from "../icons/CloseIcon";
import { useSideBarState } from "../side-bar/SideBarState";

export function LinkWindow() {
  const { file } = useFileContext();
  const closeSideBar = useSideBarState((state) => state.close);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className={`flex w-full flex-grow flex-col p-4`}>
      <DocumentTitle />
      <div className="my-4 flex items-center justify-between gap-4 border-b-[1px] border-gray-200 pb-4">
        <div className="flex gap-4">
          {Features.document_actions && <DocumentActions />}
          <PresenceRow />
        </div>
        <div className="flex">
          <FullscreenButton onClick={toggleFullscreen} />
        </div>
      </div>
      <div
        className={
          isFullscreen
            ? "fixed left-0 top-0 z-20 flex h-svh w-svw flex-col items-stretch p-4"
            : "flex flex-grow"
        }
      >
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute right-1 top-1 scale-75 rounded-lg bg-indigo-100 p-0.5 text-zinc-900 transition-transform duration-100 ease-in-out hover:scale-100 hover:bg-indigo-50"
          >
            <CloseIcon width="28px" height="28px" />
          </button>
        )}
        <iframe
          className={`flex-grow rounded-lg border-2 border-gray-200`}
          src={file.name}
        />
      </div>
    </div>
  );

  function toggleFullscreen() {
    closeSideBar();
    setIsFullscreen((fullscreen) => !fullscreen);
  }
}

function FullscreenButton({ onClick }: { onClick(): void }) {
  return (
    <button
      onClick={onClick}
      className="text-zing-400 scale-90 transition-transform duration-100 ease-in-out hover:scale-100"
    >
      <FullscreenIcon width="32px" height="32px" />
    </button>
  );
}
