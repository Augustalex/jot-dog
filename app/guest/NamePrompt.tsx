"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdjectiveAnimal } from "./animal-name";

export function NamePrompt({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    if (name) return;

    const newName = getAdjectiveAnimal();
    setName(newName);
    document.cookie = `local-id=${newName}; path=/`;

    router.replace(redirectTo);
  }, [name, redirectTo, router]);

  return null;
}
