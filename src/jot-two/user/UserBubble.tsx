import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { UserAvatar } from "../presence/PresenceAvatar";
import { useLocalUserContext } from "../local-user/LocalUserContext";

export function UserBubble() {
  const { localUser } = useLocalUserContext();

  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="redirect">
          <button>
            <UserAvatar user={localUser} isLocalUser={false} />
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
