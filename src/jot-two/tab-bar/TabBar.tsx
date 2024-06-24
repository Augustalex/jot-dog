import { FileBar } from "./FileBar";
import { HomeButton } from "./HomeButton";
import { ToggleSidebar } from "../side-bar/ToggleSidebar";

export function TabBar() {
  return (
    <>
      <div className="flex gap-2">
        <ToggleSidebar />
        <HomeButton />
        <FileBar />
      </div>
    </>
  );
}
