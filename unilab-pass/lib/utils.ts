// Split full name
export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const len = parts.length;
  let lastName = "";
  let firstName = "";

  if (parts.length == 1) {
    firstName = parts[0];
  } else {
    firstName = parts[len - 1];
    lastName = parts.slice(0, -1).join(" ").trim();
  }

  return {
    firstName,
    lastName,
  };
}

// Get full name
export function getFullName({
  lastName = "",
  firstName = "",
}: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) {
  return `${lastName ? `${lastName} ` : ""}${firstName}`;
}

// Truncate Text
export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};
