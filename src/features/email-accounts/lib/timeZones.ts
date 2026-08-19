export interface TimeZoneOption {
  readonly id: string;
  readonly label: string;
  readonly region: string;
  readonly offsetLabel: string;
  readonly offsetMinutes: number;
  readonly search: string;
}

const formatOffset = (offsetInMinutes: number): string => {
  const sign = offsetInMinutes < 0 ? "-" : "+";
  const absolute = Math.abs(offsetInMinutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const minutes = String(absolute % 60).padStart(2, "0");

  return `GMT${sign}${hours}:${minutes}`;
};

interface RawTimeZone {
  readonly name: string;
  readonly alternativeName: string;
  readonly countryName: string;
  readonly mainCities: readonly string[];
  readonly currentTimeOffsetInMinutes: number;
  readonly group: readonly string[];
}

export const toTimeZoneOption = (zone: RawTimeZone): TimeZoneOption => {
  const city = zone.mainCities[0] ?? zone.name.split("/").pop() ?? zone.name;
  const label = `${city} · ${zone.alternativeName}`;
  const region = zone.countryName;
  const offsetLabel = formatOffset(zone.currentTimeOffsetInMinutes);

  return {
    id: zone.name,
    label,
    region,
    offsetLabel,
    offsetMinutes: zone.currentTimeOffsetInMinutes,
    search: [
      label,
      region,
      offsetLabel,
      zone.name.replace(/[_/]/g, " "),
      ...zone.mainCities,
      ...zone.group,
    ]
      .join(" ")
      .toLowerCase(),
  };
};

export const sortTimeZoneOptions = (
  options: readonly TimeZoneOption[],
): readonly TimeZoneOption[] =>
  [...options].sort(
    (a, b) =>
      a.offsetMinutes - b.offsetMinutes || a.label.localeCompare(b.label),
  );

export const withCurrentZone = (
  options: readonly TimeZoneOption[],
  current: string,
): readonly TimeZoneOption[] => {
  if (!current || options.some((option) => option.id === current)) {
    return options;
  }

  const fallback: TimeZoneOption = {
    id: current,
    label: current.replace(/[_/]/g, " "),
    region: "Stored on this mailbox",
    offsetLabel: "",
    offsetMinutes: 0,
    search: current.toLowerCase(),
  };

  return [fallback, ...options];
};

export const findTimeZoneOption = (
  options: readonly TimeZoneOption[],
  id: string,
): TimeZoneOption | null => options.find((option) => option.id === id) ?? null;
