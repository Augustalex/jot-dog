"use client";

import styles from "./login-to-note.module.css";
import React from "react";
import { LoginModal } from "./LoginModal";
import { NoteFile } from "../../../jot-one/utils/file-utils";

export function LoginToNote({ file }: { file: NoteFile }) {
  return (
    <div className={styles.background}>
      <LoginModal file={file} />
    </div>
  );
}
