import { FileBar } from "./FileBar";
import { UserBubble } from "../user/UserBubble";

export function TabBar() {
  return (
    <div
      className="
        flex
        p-2
        justify-between
    "
    >
      <FileBar />
      <UserBubble />
    </div>
  );
}
