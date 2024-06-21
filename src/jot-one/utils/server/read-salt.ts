export function readSalt() {
  const salt = process.env.SALT;
  if (!salt) throw new Error("Server configuration error 1");
  return salt.replaceAll("\\", "");
}
