import { describe, expect, it } from "vitest";
import {
  buildScheduleOptions,
  formatScheduleStamp,
  fromLocalInputValue,
  toLocalInputValue,
} from "./scheduleOptions";

const LONDON = "Europe/London";
const TOKYO = "Asia/Tokyo";

describe("buildScheduleOptions", () => {
  it("offers tomorrow and Monday from a weekday morning", () => {
    const now = new Date("2026-08-10T08:00:00Z");

    const ids = buildScheduleOptions(now, LONDON).map((option) => option.id);

    expect(ids).toEqual([
      "later-today",
      "tomorrow-morning",
      "tomorrow-afternoon",
      "monday-morning",
    ]);
  });

  it("drops options that have already passed", () => {
    const now = new Date("2026-08-10T20:00:00Z");

    const ids = buildScheduleOptions(now, LONDON).map((option) => option.id);

    expect(ids).not.toContain("later-today");
    expect(ids).toContain("tomorrow-morning");
  });

  it("never returns a time in the past", () => {
    const now = new Date("2026-08-10T12:34:00Z");

    for (const option of buildScheduleOptions(now, LONDON)) {
      expect(option.at.getTime()).toBeGreaterThan(now.getTime());
    }
  });

  it("resolves 08:00 in the workspace zone, not the runner's", () => {
    const now = new Date("2026-08-10T08:00:00Z");

    const tokyoMorning = buildScheduleOptions(now, TOKYO).find(
      (option) => option.id === "tomorrow-morning",
    );

    expect(tokyoMorning?.at.toISOString()).toBe("2026-08-10T23:00:00.000Z");
  });

  it("labels every option with an absolute stamp carrying the zone", () => {
    const now = new Date("2026-08-10T08:00:00Z");

    for (const option of buildScheduleOptions(now, LONDON)) {
      expect(option.detail).toMatch(/\d{2}:\d{2}/);
      expect(option.detail.length).toBeGreaterThan("Tue 11 Aug, 08:00".length);
    }
  });
});

describe("formatScheduleStamp", () => {
  it("renders the time in the given zone", () => {
    const at = new Date("2026-08-10T23:00:00Z");

    expect(formatScheduleStamp(at, TOKYO)).toContain("08:00");
    expect(formatScheduleStamp(at, LONDON)).toContain("00:00");
  });
});

describe("datetime-local round trip", () => {
  it("reads a value back as the same instant in the workspace zone", () => {
    const at = new Date("2026-08-10T23:00:00Z");
    const value = toLocalInputValue(at, TOKYO);

    expect(value).toBe("2026-08-11T08:00");
    expect(fromLocalInputValue(value, TOKYO)?.toISOString()).toBe(
      at.toISOString(),
    );
  });

  it("rejects a malformed value", () => {
    expect(fromLocalInputValue("not-a-date", LONDON)).toBeNull();
  });
});
