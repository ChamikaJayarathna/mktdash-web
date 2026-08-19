import { describe, expect, it } from "vitest";
import {
  formatSendingWindow,
  formatWeekdays,
  isWindowOrdered,
  sortWeekdays,
  timeZoneOptions,
  toMinutes,
} from "./sendingWindow";

describe("sortWeekdays", () => {
  it("puts days back in week order however they were picked", () => {
    expect(sortWeekdays(["fri", "mon", "wed"])).toEqual(["mon", "wed", "fri"]);
  });
});

describe("toMinutes", () => {
  it("converts a 24-hour time to minutes past midnight", () => {
    expect(toMinutes("00:00")).toBe(0);
    expect(toMinutes("09:30")).toBe(570);
    expect(toMinutes("23:59")).toBe(1439);
  });

  it("rejects malformed or impossible times", () => {
    expect(toMinutes("9:00")).toBeNull();
    expect(toMinutes("24:00")).toBeNull();
    expect(toMinutes("09:60")).toBeNull();
    expect(toMinutes("")).toBeNull();
  });
});

describe("isWindowOrdered", () => {
  it("requires the window to close after it opens", () => {
    expect(isWindowOrdered("09:00", "17:00")).toBe(true);
    expect(isWindowOrdered("17:00", "09:00")).toBe(false);
  });

  it("rejects a zero-length window", () => {
    expect(isWindowOrdered("09:00", "09:00")).toBe(false);
  });

  it("rejects an unparseable bound rather than guessing", () => {
    expect(isWindowOrdered("09:00", "")).toBe(false);
  });
});

describe("formatWeekdays", () => {
  it("names the common patterns rather than listing them", () => {
    expect(formatWeekdays(["mon", "tue", "wed", "thu", "fri"])).toBe("Mon–Fri");
    expect(
      formatWeekdays(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]),
    ).toBe("Every day");
  });

  it("lists an irregular pattern in week order", () => {
    expect(formatWeekdays(["sat", "mon"])).toBe("Mon, Sat");
  });

  it("says so when nothing is selected", () => {
    expect(formatWeekdays([])).toBe("No days selected");
  });
});

describe("formatSendingWindow", () => {
  it("always states the timezone alongside the hours", () => {
    expect(
      formatSendingWindow({
        days: ["mon", "tue", "wed", "thu", "fri"],
        startTime: "09:00",
        endTime: "17:00",
        timeZone: "Europe/London",
      }),
    ).toBe("Mon–Fri · 09:00–17:00 Europe/London");
  });
});

describe("timeZoneOptions", () => {
  it("keeps a zone the backend sent even when it is off the curated list", () => {
    const options = timeZoneOptions("Pacific/Auckland");

    expect(options[0]).toBe("Pacific/Auckland");
    expect(options).toContain("Europe/London");
  });

  it("does not duplicate a zone already on the list", () => {
    const options = timeZoneOptions("Europe/London");

    expect(options.filter((zone) => zone === "Europe/London")).toHaveLength(1);
  });
});
