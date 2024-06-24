import React, { ReactNode } from "react";
import { LocalUser } from "../local-user/LocalUserContext";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import * as RadixAvatar from "@radix-ui/react-avatar";

export const PresenceAvatar = ({
  user,
  isLocalUser,
}: {
  user: LocalUser;
  isLocalUser: boolean;
}) => {
  return (
    <AvatarTooltip user={user}>
      <UserAvatar user={user} isLocalUser={isLocalUser} />
    </AvatarTooltip>
  );
};

function AvatarTooltip({
  user,
  children,
}: {
  user: LocalUser;
  children: ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className="z-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-md"
            sideOffset={5}
          >
            {user.name}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}

export function UserAvatar({
  user,
  isLocalUser,
}: {
  user: LocalUser;
  isLocalUser: boolean;
}) {
  return (
    <RadixAvatar.Root
      className={`flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full ${isLocalUser ? "border-2 border-indigo-500" : ""} `}
    >
      {user.avatar && (
        <RadixAvatar.Image
          className="h-full w-full object-cover"
          src={user.avatar}
          alt={user.name}
        />
      )}
      <RadixAvatar.Fallback
        className="flex h-full w-full items-center justify-center text-sm font-bold text-white"
        style={{
          backgroundColor: user.primaryColor,
        }}
        delayMs={100}
      >
        {(user.name[0].toUpperCase() ?? "U") +
          (user.name[1].toUpperCase() ?? "U")}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}

// export function GuestAvatar({
//   user,
//   isLocalUser,
// }: {
//   user: LocalUser;
//   isLocalUser: boolean;
// }) {
//   return (
//     <div
//       className={`w-[32px] h-[32px] rounded-full border-2 overflow-hidden ${
//         isLocalUser ? "border-indigo-500" : ""
//       }`}
//       style={{
//         ...(!isLocalUser && { borderColor: user.tertiaryColor }),
//         backgroundColor: user.primaryColor,
//       }}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 -2.93 32.537 32.537"
//         width="100%"
//         height="100%"
//       >
//         <g transform="translate(-481.391 -197.473)" fill={user.tertiaryColor}>
//           <path d="M512.928,224.152a.991.991,0,0,1-.676-.264,21.817,21.817,0,0,0-29.2-.349,1,1,0,1,1-1.322-1.5,23.814,23.814,0,0,1,31.875.377,1,1,0,0,1-.677,1.736Z" />
//           <path d="M498.191,199.473a7.949,7.949,0,1,1-7.949,7.95,7.959,7.959,0,0,1,7.949-7.95m0-2a9.949,9.949,0,1,0,9.95,9.95,9.949,9.949,0,0,0-9.95-9.95Z" />
//         </g>
//       </svg>
//     </div>
//   );
// }
