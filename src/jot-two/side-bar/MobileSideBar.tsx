import { useSideBarState } from "./SideBarState";
import { useFileContext } from "../file/FileContext";
import { UserBubble } from "../user/UserBubble";
import { CloseButton } from "../tab-bar/CloseButton";

export function MobileSideBar() {
  const { userFiles } = useFileContext();
  const sideBarIsOpen = useSideBarState((state) => state.open);
  const toggleSideBar = useSideBarState((state) => state.toggle);

  return (
    <div
      className={`fixed left-0 top-0 z-10 min-h-svh w-svw transform-gpu border-r-2 border-gray-200 bg-white p-4 transition-transform duration-200 ease-in-out`}
      style={{
        transform: sideBarIsOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <div className="flex flex-col">
        <div className="mb-4 flex justify-between">
          <UserBubble />
          <CloseButton onClick={toggleSideBar} />
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
      </div>
    </div>
  );
}
