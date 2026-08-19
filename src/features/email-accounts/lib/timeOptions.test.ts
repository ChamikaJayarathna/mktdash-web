import { describe, expect, it } from "vitest";
import {
  buildTimeOptions,
  findTimeOption,
  parseTimeQuery,
  to12Hour,
  withCustomTime,
} from "./timeOptions";

describe("buildTimeOptions", () => {
  it("covers a full day on the half hour", () => {
    const options = buildTimeOptions();

    expect(options).toHaveLength(48);
    expect(options[0].id).toBe("00:00");
    expect(options.at(-1)?.id).toBe("23:30");
  });

  it("makes every option findable by its 24-hour and 12-hour form", () => {
    const noon = findTimeOption(buildTimeOptions(), "12:00");

    expect(noon?.search).toContain("12:00");
    expect(noon?.search).toContain("12:00 pm");
  });
});

describe("to12Hour", () => {
  it.each([
    ["00:00", "12:00 AM"],
    ["00:30", "12:30 AM"],
    ["09:00", "9:00 AM"],
    ["12:00", "12:00 PM"],
    ["13:45", "1:45 PM"],
    ["23:59", "11:59 PM"],
  ])("renders %s as %s", (value, expected) => {
    expect(to12Hour(value)).toBe(expected);
  });

  it("passes a malformed value straight through", () => {
    expect(to12Hour("")).toBe("");
    expect(to12Hour("9:5")).toBe("9:5");
  });
});

describe("parseTimeQuery", () => {
  it.each([
    ["9:30", "09:30"],
    ["09:30", "09:30"],
    ["930", "09:30"],
    ["0930", "09:30"],
    ["9.30", "09:30"],
    ["23:59", "23:59"],
    ["  7:15  ", "07:15"],
  ])("reads %s as %s", (query, expected) => {
    expect(parseTimeQuery(query)).toBe(expected);
  });

  it.each(["", "9", "9:5", "24:00", "12:60", "half nine"])(
    "rejects %s",
    (query) => {
      expect(parseTimeQuery(query)).toBeNull();
    },
  );
});

describe("withCustomTime", () => {
  it("keeps an off-step time in chronological order", () => {
    const options = withCustomTime(buildTimeOptions(), "23:59");

    expect(options).toHaveLength(49);
    expect(options.at(-1)?.id).toBe("23:59");
    expect(options.at(-2)?.id).toBe("23:30");
  });

  it("slots a mid-day time between its neighbours", () => {
    const options = withCustomTime(buildTimeOptions(), "09:37");
    const at = options.findIndex((option) => option.id === "09:37");

    expect(options[at - 1].id).toBe("09:30");
    expect(options[at + 1].id).toBe("10:00");
  });

  it("leaves the list untouched for a time already on the step", () => {
    const base = buildTimeOptions();

    expect(withCustomTime(base, "09:30")).toBe(base);
  });

  it("ignores a value that is not a stored time", () => {
    const base = buildTimeOptions();

    expect(withCustomTime(base, "")).toBe(base);
    expect(withCustomTime(base, "9:30")).toBe(base);
  });
});
