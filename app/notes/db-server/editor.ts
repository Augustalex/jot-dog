"use server";

import { kv } from "@vercel/kv";
import {NoteFile} from "../utils/file-utils";

const CONFIG_STORAGE_KEY = "editor_config";

export interface EditorConfig {
  selectedFile: NoteFile | null;
}

export async function setConfig(config: EditorConfig) {
  await kv.set(CONFIG_STORAGE_KEY, config);
}

export async function getConfig(
  defaultConfig: EditorConfig = { selectedFile: null }
) {
  return (
    (await kv.get<EditorConfig | null>(CONFIG_STORAGE_KEY)) ?? defaultConfig
  );
}
