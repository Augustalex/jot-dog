"use client";

import React, {useCallback} from "react";
import styles from "./file-bar.module.css";
import { deleteFile, renameFile } from "../../db/files";
import { Tab } from "../../../design/Tab";
import { IconButton } from "../../../design/IconButton";
import { useRouter } from "next/navigation";
import { FILES_KEY, useFiles } from "../../db/hooks/useFiles";
import { mutate } from "swr";
import { useLocalEditorState } from "../../hooks/useLocalEditorState";
import {NoteFile} from "../../utils/file-utils";

export function FileBar({ selectedFile }: { selectedFile: NoteFile }) {
  return <FileBarUI selectedFile={selectedFile} />;
}

export function FileBarUI({ selectedFile }: { selectedFile: NoteFile }) {
  const {data: files, optimisticCreateFile} = useFiles();
  const router = useRouter();
  const { save, isSaved, fontSize, setFontSize } =
    useLocalEditorState(selectedFile);

  const onClickCreate = useCallback(async () => {
    const newFile = await optimisticCreateFile();
    router.push("/notes/" + newFile.key);
  }, [optimisticCreateFile, router]);

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
      <input
        type="number"
        defaultValue={fontSize}
        onChange={onFontSizeChange}
        className={[styles.fileTab, styles.fileTabNumberInput].join(" ")}
      />
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

  function onFontSizeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    if (isNumeric(newValue)) {
      setFontSize(parseInt(newValue, 10));
    }
  }

  async function onClickRename() {
    const newName = prompt('Rename "' + selectedFile.name + '" to: ');
    if (newName !== null) {
      const newFile = await renameFile(selectedFile, newName);

      const newFiles = files.filter((f) => f.key !== selectedFile.key);
      const oldIndex = files.findIndex((f) => f.key === selectedFile.key);
      newFiles.splice(oldIndex, 0, newFile);

      await mutate(FILES_KEY, newFiles);

      router.push("/notes/" + newFile.key);
    }
  }

  async function onCloseTab(e: React.MouseEvent, file: NoteFile) {
    e.preventDefault();

    await deleteFile(file.key);

    const currentIndex = files.findIndex((f) => f.key === file.key);
    const newFiles = files.filter((f) => f.key !== file.key);

    await mutate(FILES_KEY, newFiles);

    if (selectedFile.key === file.key) {
      if (newFiles[currentIndex]) {
        router.push("/notes/" + newFiles[currentIndex].key);
      } else if (newFiles.length === 0) {
        router.push("/notes/scratch");
      } else if (newFiles.length === 1) {
        router.push("/notes/" + newFiles[0].key);
      } else {
        router.push("/notes/" + newFiles[newFiles.length - 1].key);
      }
    }
  }
}

function isNumeric(str: string) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(Number(str)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
