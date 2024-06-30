import { useSideBarState } from "./SideBarState";
import React, { ReactNode } from "react";
import { UserBubble } from "../user/UserBubble";
import { CloseButton } from "../tab-bar/CloseButton";

export function MobileSideBarWrapper({ children }: { children: ReactNode }) {
  const sideBarIsOpen = useSideBarState((state) => state.open);
  const toggleSideBar = useSideBarState((state) => state.toggle);

  return (
    <div
      className={`fixed left-0 top-0 z-20 min-h-svh w-svw transform-gpu border-r-2 border-gray-200 bg-white p-8 transition-transform duration-200 ease-in-out`}
      style={{
        transform: sideBarIsOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <div className="flex flex-col">
        <div className="mb-6 flex justify-between">
          <UserBubble />
          <CloseButton onClick={toggleSideBar} />
        </div>
        {children}
      </div>
    </div>
  );
}
