export enum FileType {
  Text = "",
  YDoc = ":ydoc:",
  Link = ":link:",
}

export interface JotTwoFile {
  name: string;
  key: string;
  fileType: FileType;
}
