import { useSideBarState } from "./SideBarState";
import { useFileContext } from "../file/FileContext";
import { UserBubble } from "../user/UserBubble";
import {
  TRANSITION_DURATION,
  TRANSITION_EASE,
  TRANSITION_TRANSFORM,
} from "../document/animation";
import { useRecentlyViewed } from "../utils/useRecentlyViewed";

export function SideBar() {
  const { userFiles } = useFileContext();
  const { recentlyViewed } = useRecentlyViewed();
  const sideBarIsOpen = useSideBarState((state) => state.open);

  const recentlyViewedOthersFiles = recentlyViewed.filter(
    ({ file }) =>
      userFiles.findIndex((userFile) => userFile.key === file.key) === -1,
  );

  return (
    <div
      className={`w-max-[90vw] fixed min-h-svh transform-gpu border-r-[1px] border-gray-200 bg-white p-4 shadow-lg sm:w-[40vw] md:w-[240px] ${TRANSITION_TRANSFORM} ${TRANSITION_DURATION} ${TRANSITION_EASE}`}
      style={{
        transform: sideBarIsOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between">
          <UserBubble />
        </div>
        <div>
          <h3 className="text-lg text-gray-800">My files</h3>
          <div className="w-full">
            {userFiles.map((file) => {
              return (
                <a
                  key={file.key}
                  href={`/${file.key}`}
                  className="my-2 flex transform-gpu cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span>{file.name}</span>
                </a>
              );
            })}
          </div>
        </div>
        {recentlyViewedOthersFiles.length > 0 && (
          <div className="mt-2">
            <h3 className="text-lg text-gray-800">Viewed files</h3>
            <div className="w-full">
              {recentlyViewedOthersFiles.map(({ file }) => {
                return (
                  <a
                    key={file.key}
                    href={`/${file.key}`}
                    className="my-2 flex transform-gpu cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span>{file.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
