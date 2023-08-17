import styles from "./login-to-note.module.css";
import React, { useRef, useState } from "react";
import { IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";
import openLock from "../../open_lock.svg";
import hiddenIcon from "../../hidden.svg";
import shownIcon from "../../shown.svg";
import { NoteFile } from "../../notes/utils/file-utils";
import { useRouter } from "next/navigation";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

interface HistoryModalProps {
  file: NoteFile;
}

export function LoginModal({ file }: HistoryModalProps) {
  const router = useRouter();
  const modalRoot = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [status, setStatus] = useState<"none" | "failed" | "success">("none");

  return (
    <div className={`${styles.historyOverlay} ${ibmPlexMono.className}`}>
      <div
        ref={modalRoot}
        className={`${styles.modalRoot} ${
          status === "success"
            ? styles.modalStatusSuccess
            : status === "failed"
            ? styles.modalStatusFailed
            : ""
        }`}
        style={{
          height: "min(300px, 80vh)",
          width: "min(400px, 90vw)",
        }}
      >
        <h2 className={styles.modalHeader}>This note is private.</h2>
        <label>
          <span>Password</span>
          <div className={styles.passwordInputRow}>
            <input
              type={passwordVisible ? "text" : "password"}
              autoComplete="new-password"
              onChange={(e) => {
                setPassword(e.target?.value ?? "");
              }}
              disabled={status === "success"}
            />
            <Image
              className={styles.eyeIcon}
              src={passwordVisible ? hiddenIcon.src : shownIcon.src}
              alt="Lock"
              width={24}
              height={24}
              onClick={togglePasswordVisibility}
            />
          </div>
        </label>
        <button
          className={styles.lockButton}
          title="Lock note"
          onClick={login}
          disabled={password.length === 0 || status === "success"}
        >
          <Image src={openLock.src} alt="Lock" width={42} height={42} />
          <span>Login to /{file.key}</span>
        </button>
      </div>
    </div>
  );

  async function login() {
    const response = await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        fileKey: file.key,
        password,
      }),
    });
    const data = await response.json();

    if (data.status === "success") {
      setStatus("success");
      router.push(`/${file.key}`);
    } else {
      setStatus("failed");
      setPassword("");
    }
  }

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }
}
