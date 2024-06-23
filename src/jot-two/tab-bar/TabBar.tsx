import { FileBar } from "./FileBar";
import { UserBubble } from "../user/UserBubble";
import { HomeButton } from "./HomeButton";

export function TabBar() {
  return (
    <div
      className="
        flex
        p-4
        justify-between
        items-center
    "
    >
      <div className="flex gap-2">
        <HomeButton />
        <FileBar />
      </div>
      <UserBubble />
    </div>
  );
}
