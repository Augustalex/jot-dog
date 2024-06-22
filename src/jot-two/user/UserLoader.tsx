import { ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

export function UserLoader({ children }: { children: ReactNode }) {
  const { isLoaded } = useUser();
  if (!isLoaded) return null;

  return <>{children}</>;
}
