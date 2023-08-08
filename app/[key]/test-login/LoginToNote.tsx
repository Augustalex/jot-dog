"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function LoginToNote({ fileKey }: { fileKey: string }) {
  const passwordValue = useRef<string>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (passwordValue.current) return;

    const password = prompt("Password: ");
    if (!password) {
      window.location.reload();
      return;
    } else {
      passwordValue.current = password;
    }

    (async () => {
      console.log("Login with: ", fileKey, password);
      const response = await fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          fileKey,
          password,
        }),
      });
      const data = await response.json();
      console.log("DATA", data);
      if (data.status === "success") {
        console.log("Successfully logged in: ", fileKey, password);
        router.push(`/${fileKey}`);
      } else {
        console.log("Failed to login: ", fileKey, password);
        window.location.reload();
      }
    })();
  }, [fileKey, router]);

  return <div>Locking...</div>;
}
