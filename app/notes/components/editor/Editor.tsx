"use server";

import React from "react";
import { getFile } from "../../db/file";
import { EditorUI } from "./EditorUI";
import { EditorConfig } from "../../db/editor";
import { getContentKey } from "../../db/hooks/useSelectedContent";
import { ClientSwrConfig } from "../ClientSwrConfig";

export async function Editor({ editorConfig }: { editorConfig: EditorConfig }) {
  const content = await getFile(editorConfig.selectedFile);

  return (
    <ClientSwrConfig
      fallback={{
        [getContentKey(editorConfig.selectedFile.key ?? "scratch")]: content,
      }}
    >
      <EditorUI editorConfig={editorConfig} />
    </ClientSwrConfig>
  );
}
