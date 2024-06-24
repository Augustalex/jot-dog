import { FileBar } from "./FileBar";
import { UserBubble } from "../user/UserBubble";
import { HomeButton } from "./HomeButton";
import { ToggleSidebar } from "../side-bar/ToggleSidebar";
import { useSideBarState } from "../side-bar/SideBarState";

export function TabBar() {
  const toggleSideBar = useSideBarState((state) => state.toggle);

  return (
    <>
      <div className="flex gap-2">
        <ToggleSidebar onClick={toggleSideBar} />
        <HomeButton />
        <FileBar />
      </div>
      <UserBubble />
    </>
  );
}
