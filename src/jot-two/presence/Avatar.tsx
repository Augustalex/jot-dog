import React from "react";
import { LocalUser } from "../local-user/LocalUserContext";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

export const Avatar = ({ user }: { user: LocalUser }) => {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`w-[32px] h-[32px] rounded-full border-2 overflow-hidden`}
            style={{
              borderColor: user.tertiaryColor,
              backgroundColor: user.primaryColor,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -2.93 32.537 32.537"
              width="100%"
              height="100%"
            >
              <g
                transform="translate(-481.391 -197.473)"
                fill={user.tertiaryColor}
              >
                <path d="M512.928,224.152a.991.991,0,0,1-.676-.264,21.817,21.817,0,0,0-29.2-.349,1,1,0,1,1-1.322-1.5,23.814,23.814,0,0,1,31.875.377,1,1,0,0,1-.677,1.736Z" />
                <path d="M498.191,199.473a7.949,7.949,0,1,1-7.949,7.95,7.959,7.959,0,0,1,7.949-7.95m0-2a9.949,9.949,0,1,0,9.95,9.95,9.949,9.949,0,0,0-9.95-9.95Z" />
              </g>
            </svg>
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="bg-white text-gray-800 text-sm rounded-lg py-2 px-3 border border-gray-200 shadow-md"
            sideOffset={5}
          >
            {user.name}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
};
