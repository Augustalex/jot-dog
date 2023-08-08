"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export function LockNote({ fileKey }: { fileKey: string }) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const password = prompt("Password: ");
    if (!password) {
      window.location.reload();
      return;
    }

    (async () => {
      console.log("Locking with: ", fileKey, password);
      const response = await fetch("/auth/lock", {
        method: "POST",
        body: JSON.stringify({
          fileKey,
          password,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        console.log("Successfully locked: ", fileKey, password);
        router.push(`/${fileKey}`);
      } else {
        console.log("Failed locking: ", fileKey, password);
        window.location.reload();
      }
    })();
  }, [fileKey, router]);

  return <div>Locking...</div>;
}
