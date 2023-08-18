import styles from "./lock.module.css";
import React, { useRef, useState } from "react";
import { NoteFile } from "../../utils/file-utils";
import { IBM_Plex_Mono } from "next/font/google";
import Image from "next/image";
import lockIcon from "../../../lock.svg";
import hiddenIcon from "../../../hidden.svg";
import shownIcon from "../../../shown.svg";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

interface HistoryModalProps {
  file: NoteFile;
  close(): void;
}

export function LockModal({ file, close }: HistoryModalProps) {
  const modalRoot = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [status, setStatus] = useState<
    "none" | "in-progress" | "failed" | "success"
  >("none");

  const disableInput = status === "success" || status === "in-progress";

  return (
    <div
      className={`${styles.historyOverlay} ${ibmPlexMono.className}`}
      onClick={onOverlayClick}
    >
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
        <h2 className={styles.modalHeader}>Take your note private</h2>
        <label>
          <span>Password</span>
          <div className={styles.passwordInputRow}>
            <input
              type="text"
              name="username"
              value={file.key}
              readOnly
              hidden
            />
            <input
              type={passwordVisible ? "text" : "password"}
              autoComplete="new-password"
              name="password"
              onChange={(e) => {
                setPassword(e.target?.value ?? "");
              }}
              autoFocus
              disabled={disableInput}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await lockNote();
                }
              }}
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
          onClick={lockNote}
          disabled={password.length === 0 || disableInput}
        >
          <Image src={lockIcon.src} alt="Lock" width={42} height={42} />
          <span>Lock /{file.key} with password</span>
        </button>
      </div>
    </div>
  );

  async function lockNote() {
    const response = await fetch("/auth/lock", {
      method: "POST",
      body: JSON.stringify({
        fileKey: file.key,
        password,
      }),
    });
    const data = await response.json();
    if (data.status === "success") {
      setStatus("success");
      window.location.reload();
    } else {
      setStatus("failed");
      console.error("Failed to lock note");
    }
  }

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  function onOverlayClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    if (target !== modalRoot.current && !modalRoot.current?.contains(target)) {
      close();
    }
  }
}
