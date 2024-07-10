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
  const name = user.name ?? user.username ?? "UU";

  return (
    <RadixAvatar.Root
      className={`flex h-[32px] w-[32px] items-center justify-center overflow-hidden rounded-full ${isLocalUser ? "border-2 border-indigo-500" : ""} `}
    >
      {user.avatar && (
        <RadixAvatar.Image
          className="h-full w-full object-cover"
          src={user.avatar}
          alt={name}
        />
      )}
      <RadixAvatar.Fallback
        className="flex h-full w-full items-center justify-center text-sm font-bold text-white"
        style={{
          backgroundColor: user.primaryColor,
        }}
        delayMs={100}
      >
        {name[0].toUpperCase() + name[1].toUpperCase()}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
