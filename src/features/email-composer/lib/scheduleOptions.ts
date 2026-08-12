import { tz, tzName } from "@date-fns/tz";
import {
  addDays,
  format,
  isAfter,
  nextMonday,
  set,
  startOfDay,
} from "date-fns";

export interface ScheduleOption {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly at: Date;
}

const LATER_TODAY_HOUR = 16;
const MORNING_HOUR = 8;
const AFTERNOON_HOUR = 13;

export const resolveBrowserTimeZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone;

const atHour = (day: Date, hour: number, timeZone: string): Date =>
  new Date(
    set(
      startOfDay(day, { in: tz(timeZone) }),
      { hours: hour },
      { in: tz(timeZone) },
    ).getTime(),
  );

export const formatScheduleStamp = (date: Date, timeZone: string): string =>
  `${format(date, "EEE d MMM, HH:mm", { in: tz(timeZone) })} ${tzName(timeZone, date, "short")}`;

export const buildScheduleOptions = (
  now: Date,
  timeZone: string,
): readonly ScheduleOption[] => {
  const tomorrow = addDays(now, 1);

  const candidates: readonly { id: string; label: string; at: Date }[] = [
    {
      id: "later-today",
      label: "Later today",
      at: atHour(now, LATER_TODAY_HOUR, timeZone),
    },
    {
      id: "tomorrow-morning",
      label: "Tomorrow morning",
      at: atHour(tomorrow, MORNING_HOUR, timeZone),
    },
    {
      id: "tomorrow-afternoon",
      label: "Tomorrow afternoon",
      at: atHour(tomorrow, AFTERNOON_HOUR, timeZone),
    },
    {
      id: "monday-morning",
      label: "Monday morning",
      at: atHour(nextMonday(now), MORNING_HOUR, timeZone),
    },
  ];

  return candidates
    .filter((candidate) => isAfter(candidate.at, now))
    .map((candidate) => ({
      ...candidate,
      detail: formatScheduleStamp(candidate.at, timeZone),
    }));
};

export const toLocalInputValue = (date: Date, timeZone: string): string =>
  format(date, "yyyy-MM-dd'T'HH:mm", { in: tz(timeZone) });

export const fromLocalInputValue = (
  value: string,
  timeZone: string,
): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, year, month, day, hours, minutes] = match;
  const candidate = set(
    startOfDay(new Date(), { in: tz(timeZone) }),
    {
      year: Number(year),
      month: Number(month) - 1,
      date: Number(day),
      hours: Number(hours),
      minutes: Number(minutes),
    },
    { in: tz(timeZone) },
  );

  return Number.isNaN(candidate.getTime()) ? null : new Date(candidate);
};
