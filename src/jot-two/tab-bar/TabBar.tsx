import { FileBar } from "./FileBar";
import { HomeButton } from "./HomeButton";
import { ToggleSidebar } from "../side-bar/ToggleSidebar";

export function TabBar() {
  return (
    <>
      <ToggleSidebar />
      <HomeButton />
      <FileBar />
    </>
  );
}
