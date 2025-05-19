import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Face } from "react-native-vision-camera-face-detector";
import { Dimensions } from "react-native";

dayjs.extend(utc);
dayjs.extend(timezone);

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

// Get value from object
export const pick = <T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> =>
  Object.fromEntries(keys.map((key) => [key, obj[key]])) as Pick<T, K>;

// Check number char
export function isNumberCharList(str: string): boolean {
  return /^\d+$/.test(str);
}

// Combine date and hour
export const combineDate = (
  date: Date | undefined,
  hour: string | undefined = ""
) => {
  if (!date) return;
  return dayjs(date)
    .utc()
    .tz("Asia/Ho_Chi_Minh")
    .hour(Number(hour.split(":")[0]))
    .minute(Number(hour.split(":")[1]))
    .second(0)
    .millisecond(0)
    .format("YYYY-MM-DDTHH:mm:ss");
};

// Check if face view is frontal
export const checkFaceViewIsFrontal = (face: Face) => {
  const { width, height } = Dimensions.get("window");
  const { yawAngle, pitchAngle, rollAngle, bounds } = face;

  const isFacingFront =
    Math.abs(yawAngle) < 8 &&
    Math.abs(pitchAngle) < 8 &&
    Math.abs(rollAngle) < 8;

  const screenCenterX = width / 2;
  const screenCenterY = height / 2;
  const faceCenterX = bounds.x / 2 + bounds.width / 2;
  const faceCenterY = bounds.y + bounds.height * 0.6;
  const isCentered =
    Math.abs(faceCenterX - screenCenterX) < 45 &&
    Math.abs(faceCenterY - screenCenterY) < 65;
  const minFaceWidth = width * 0.6;
  const maxFaceWidth = width * 0.95;
  const isProperSize =
    bounds.width >= minFaceWidth && bounds.width <= maxFaceWidth;
  return isFacingFront && isCentered && isProperSize;
};
