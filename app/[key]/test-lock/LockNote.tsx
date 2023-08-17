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
      const response = await fetch("/auth/lock", {
        method: "POST",
        body: JSON.stringify({
          fileKey,
          password,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        router.push(`/${fileKey}`);
      } else {
        window.location.reload();
      }
    })();
  }, [fileKey, router]);

  return <div>Locking...</div>;
}
