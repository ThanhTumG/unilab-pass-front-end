// Split full name
export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  let lastName = "";
  let middleName = "";
  let firstName = "";

  if (parts.length > 0) {
    lastName = parts[0];
  }

  if (parts.length === 2) {
    firstName = parts[1];
  } else if (parts.length > 2) {
    firstName = parts[parts.length - 1];
    middleName = parts.slice(1, -1).join(" ");
  }

  return {
    firstName,
    middleName,
    lastName,
  };
}

// Get full name
export function getFullName({
  lastName = "",
  middleName = "",
  firstName = "",
}: {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) {
  return `${lastName ? `${lastName} ` : ""}${
    middleName ? `${middleName} ` : ""
  }${firstName}`;
}
