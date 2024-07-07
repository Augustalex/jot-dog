import slugify from "slugify";

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

export function generateFileDetails(files: JotTwoFile[]) {
  const isoDate = new Date().toISOString();
  const dateString = isoDate.substring(0, isoDate.indexOf("T"));
  const newNameTemplate = `Note ${dateString}`;
  const similarNamesCount = files.filter((f) =>
    f.name.startsWith(newNameTemplate),
  ).length;
  const newName =
    similarNamesCount > 0
      ? `${newNameTemplate} (${similarNamesCount})`
      : newNameTemplate;

  const newKey = slugify(Date.now().toString(), { lower: true });
  const newFile: JotTwoFile = {
    name: newName,
    key: newKey,
    fileType: FileType.YDoc,
  };

  return newFile;
}
