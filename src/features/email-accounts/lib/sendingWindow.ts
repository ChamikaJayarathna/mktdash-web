import type {
  MailboxSendingWindow,
  Weekday,
} from "../types/emailAccount.types";

export const WEEKDAYS: readonly {
  readonly id: Weekday;
  readonly label: string;
}[] = [
  { id: "mon", label: "Mon" },
  { id: "tue", label: "Tue" },
  { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" },
  { id: "fri", label: "Fri" },
  { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

const WEEKDAY_ORDER: readonly Weekday[] = WEEKDAYS.map((day) => day.id);

export const BUSINESS_DAYS: readonly Weekday[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
];

const COMMON_TIME_ZONES: readonly string[] = [
  "UTC",
  "Europe/London",
  "Europe/Dublin",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Lisbon",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Colombo",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export const timeZoneOptions = (current: string): readonly string[] =>
  COMMON_TIME_ZONES.includes(current)
    ? COMMON_TIME_ZONES
    : [current, ...COMMON_TIME_ZONES];

export const sortWeekdays = (days: readonly Weekday[]): readonly Weekday[] =>
  WEEKDAY_ORDER.filter((day) => days.includes(day));

export const toMinutes = (time: string): number | null => {
  const match = /^(\d{2}):(\d{2})$/.exec(time);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
};

export const isWindowOrdered = (
  startTime: string,
  endTime: string,
): boolean => {
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);

  if (start === null || end === null) {
    return false;
  }

  return end > start;
};

export const formatWeekdays = (days: readonly Weekday[]): string => {
  const ordered = sortWeekdays(days);

  if (ordered.length === 0) {
    return "No days selected";
  }

  if (ordered.length === WEEKDAY_ORDER.length) {
    return "Every day";
  }

  if (
    ordered.length === BUSINESS_DAYS.length &&
    BUSINESS_DAYS.every((day) => ordered.includes(day))
  ) {
    return "Mon–Fri";
  }

  const labelFor = (day: Weekday): string =>
    WEEKDAYS.find((candidate) => candidate.id === day)?.label ?? day;

  return ordered.map(labelFor).join(", ");
};

export const formatSendingWindow = (window: MailboxSendingWindow): string =>
  `${formatWeekdays(window.days)} · ${window.startTime}–${window.endTime} ${window.timeZone}`;
