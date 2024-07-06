export function getUsername(user: {
  username: string | null;
  fullName: string | null;
  primaryEmailAddress: string | null;
  id: string;
}) {
  return (
    user.username ??
    getUsernameFromFullName(user.fullName) ??
    getUsernameFromEmail(user.primaryEmailAddress) ??
    user.id
  );
}

function getUsernameFromFullName(fullName: string | null): string | null {
  if (!fullName) return null;

  return fullName.split(" ").join("-");
}

function getUsernameFromEmail(email: string | null): string | null {
  if (!email) return null;

  return email.split("@")[0] ?? null;
}
