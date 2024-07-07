export enum FileType {
  YDoc = ":ydoc:",
  Link = ":link:",
}

export interface JotTwoFile {
  name: string;
  key: string;
  fileType: FileType;
}

export interface DocFile extends JotTwoFile {
  fileType: FileType.YDoc;
}

export interface LinkFile extends JotTwoFile {
  fileType: FileType.Link;
  url: string;
}

export function isLinkFile(file: JotTwoFile): file is LinkFile {
  return file.fileType === FileType.Link;
}
