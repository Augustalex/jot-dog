"use client";

import React from "react";
import styles from "./file-bar.module.css";
import { createFile, deleteFile, NoteFile, renameFile } from "../../db/files";
import { Tab } from "../../../design/Tab";
import { IconButton } from "../../../design/IconButton";
import { useRouter } from "next/navigation";
import { FILES_KEY, useFiles } from "../../db/hooks/useFiles";
import { mutate } from "swr";
import { useLocalEditorState } from "../hooks/useLocalEditorState";

export function FileBar({ selectedFile }: { selectedFile: NoteFile }) {
  return <FileBarUI selectedFile={selectedFile} />;
}

export function FileBarUI({ selectedFile }: { selectedFile: NoteFile }) {
  const files = useFiles().data;
  const router = useRouter();
  const { save, isSaved, increaseFontSize, decreaseFontSize } =
    useLocalEditorState(selectedFile);

  return (
    <div className={styles.bar}>
      <IconButton
        className={[styles.fileTab, styles.fileTabIcon].join(" ")}
        onClick={onClickRename}
      >
        ✎
      </IconButton>
      <IconButton
        className={[
          styles.fileTab,
          styles.fileTabIcon,
          styles.fileTabIconLarge,
          !isSaved ? styles.fileTabDisabled : "",
        ].join(" ")}
        onClick={async () => {
          if (!isSaved) await save();
        }}
      >
        🖪
      </IconButton>
      <IconButton
        className={[
          styles.fileTab,
          styles.fileTabIcon,
          styles.fileTabIconLarge,
        ].join(" ")}
        onClick={decreaseFontSize}
      >
        -
      </IconButton>
      <IconButton
        className={[
          styles.fileTab,
          styles.fileTabIcon,
          styles.fileTabIconLarge,
        ].join(" ")}
        onClick={increaseFontSize}
      >
        +
      </IconButton>
      <div className={styles.fileTabDelimiter} />
      {files.map((file) => (
        <Tab
          key={file.key}
          className={[
            styles.fileTab,
            selectedFile.key === file.key ? styles.fileTabSelected : "",
          ].join(" ")}
          selected={selectedFile.key === file.key}
          href={"/notes/" + file.key}
          onClose={(e) => onCloseTab(e, file)}
        >
          {file.name}
        </Tab>
      ))}
      <IconButton onClick={onClickCreate}>+</IconButton>
    </div>
  );

  async function onClickRename() {
    const newName = prompt('Rename "' + selectedFile.name + '" to: ');
    if (newName !== null) {
      const newFile = await renameFile(selectedFile, newName);

      const newFiles = files.filter((f) => f.key !== selectedFile.key);
      const oldIndex = files.findIndex((f) => f.key === selectedFile.key);
      newFiles.splice(oldIndex, 0, newFile);

      await mutate(FILES_KEY, newFiles);

      await router.push("/notes/" + newFile.key, { shallow: true });
    }
  }

  async function onClickCreate() {
    const newFile = await createFile();
    await mutate(FILES_KEY, [...files, newFile]);
    await router.push("/notes/" + newFile.key, { shallow: true });
  }

  async function onCloseTab(e: React.MouseEvent, file: NoteFile) {
    e.preventDefault();

    await deleteFile(file.key);

    const currentIndex = files.findIndex((f) => f.key === file.key);
    const newFiles = files.filter((f) => f.key !== file.key);

    await mutate(FILES_KEY, newFiles);

    if (selectedFile.key === file.key) {
      if (newFiles[currentIndex]) {
        await router.push("/notes/" + newFiles[currentIndex].key, {
          shallow: true,
        });
      } else if (newFiles.length === 0) {
        await router.push("/notes/scratch", { shallow: true });
      } else if (newFiles.length === 1) {
        await router.push("/notes/" + newFiles[0].key, { shallow: true });
      } else {
        await router.push("/notes/" + newFiles[newFiles.length - 1].key, {
          shallow: true,
        });
      }
    }
  }
}
