import { SIDEBAR_WIDTH, useSideBarState } from "./SideBarState";
import React, { ReactNode } from "react";
import {
  TRANSITION_DURATION,
  TRANSITION_EASE,
  TRANSITION_TRANSFORM,
} from "../document/animation";
import { UserBubble } from "../user/UserBubble";

export function DesktopSideBarWrapper({ children }: { children: ReactNode }) {
  const sideBarIsOpen = useSideBarState((state) => state.isOpen);

  return (
    <div
      className={`w-max-[90vw] fixed min-h-svh transform-gpu border-r-[1px] border-gray-200 bg-white p-4 shadow-lg sm:w-[40vw] ${TRANSITION_TRANSFORM} ${TRANSITION_DURATION} ${TRANSITION_EASE}`}
      style={{
        width: SIDEBAR_WIDTH,
        transform: sideBarIsOpen ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <div className="flex flex-col">
        <div className="mb-6 flex justify-between">
          <UserBubble />
        </div>
        {children}
      </div>
    </div>
  );
}
