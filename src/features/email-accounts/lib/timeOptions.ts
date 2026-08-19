export interface TimeOption {
  readonly id: string;
  readonly label: string;
  readonly caption: string;
  readonly search: string;
}

export const TIME_STEP_MINUTES = 30;

const MINUTES_PER_DAY = 24 * 60;

const STORED_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

const TYPED_TIME_PATTERN = /^([01]?\d|2[0-3])[:.]?([0-5]\d)$/;

export const isValidTime = (value: string): boolean =>
  STORED_TIME_PATTERN.test(value);

export const toMinutes = (value: string): number => {
  const [hours, minutes] = value.split(":");

  return Number(hours) * 60 + Number(minutes);
};

const fromMinutes = (minutes: number): string => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");

  return `${hours}:${String(minutes % 60).padStart(2, "0")}`;
};

export const to12Hour = (value: string): string => {
  if (!isValidTime(value)) {
    return value;
  }

  const [hours, minutes] = value.split(":");
  const hour = Number(hours);
  const suffix = hour < 12 ? "AM" : "PM";

  return `${hour % 12 === 0 ? 12 : hour % 12}:${minutes} ${suffix}`;
};

const buildOption = (id: string): TimeOption => {
  const caption = to12Hour(id);

  return {
    id,
    label: id,
    caption,
    search: `${id} ${caption}`.toLowerCase(),
  };
};

export const buildTimeOptions = (
  stepMinutes: number = TIME_STEP_MINUTES,
): readonly TimeOption[] => {
  const options: TimeOption[] = [];

  for (let minutes = 0; minutes < MINUTES_PER_DAY; minutes += stepMinutes) {
    options.push(buildOption(fromMinutes(minutes)));
  }

  return options;
};

export const parseTimeQuery = (query: string): string | null => {
  const match = TYPED_TIME_PATTERN.exec(query.trim());

  if (!match) {
    return null;
  }

  return `${match[1].padStart(2, "0")}:${match[2]}`;
};

export const withCustomTime = (
  options: readonly TimeOption[],
  time: string,
): readonly TimeOption[] => {
  if (!isValidTime(time) || options.some((option) => option.id === time)) {
    return options;
  }

  const custom = buildOption(time);
  const at = options.findIndex(
    (option) => toMinutes(option.id) > toMinutes(time),
  );

  return at === -1
    ? [...options, custom]
    : [...options.slice(0, at), custom, ...options.slice(at)];
};

export const findTimeOption = (
  options: readonly TimeOption[],
  id: string,
): TimeOption | null => options.find((option) => option.id === id) ?? null;
