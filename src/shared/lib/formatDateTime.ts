import { tz, tzName } from "@date-fns/tz";
import { format } from "date-fns";

const toDate = (value: Date | string): Date =>
  typeof value === "string" ? new Date(value) : value;

export const formatTimestamp = (
  value: Date | string,
  timeZone: string,
): string => {
  const date = toDate(value);

  return `${format(date, "EEE d MMM, HH:mm", { in: tz(timeZone) })} ${tzName(timeZone, date, "short")}`;
};

export const formatDayStamp = (
  value: Date | string,
  timeZone: string,
): string => format(toDate(value), "EEE d MMM", { in: tz(timeZone) });
