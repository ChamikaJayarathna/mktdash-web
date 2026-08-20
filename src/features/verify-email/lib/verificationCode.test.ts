import { describe, expect, it } from "vitest";
import {
  VERIFICATION_CODE_LENGTH,
  formatCooldown,
  isCompleteVerificationCode,
  isLikelyEmailAddress,
  sanitiseVerificationCode,
  toVerificationCodeSlots,
} from "./verificationCode";

describe("sanitiseVerificationCode", () => {
  it("keeps digits only and stops at the code length", () => {
    expect(sanitiseVerificationCode("12-34 56 78")).toBe("123456");
    expect(sanitiseVerificationCode("abc")).toBe("");
  });

  it("survives a pasted code that carries surrounding prose", () => {
    expect(sanitiseVerificationCode("Your code is 480 921")).toBe("480921");
  });
});

describe("isCompleteVerificationCode", () => {
  it("is complete only at the full digit count", () => {
    expect(isCompleteVerificationCode("12345")).toBe(false);
    expect(isCompleteVerificationCode("123456")).toBe(true);
    expect(isCompleteVerificationCode("12345a")).toBe(false);
  });
});

describe("toVerificationCodeSlots", () => {
  it("always returns one slot per digit box, padding the tail", () => {
    expect(toVerificationCodeSlots("48")).toEqual(["4", "8", "", "", "", ""]);
    expect(toVerificationCodeSlots("").length).toBe(VERIFICATION_CODE_LENGTH);
  });
});

describe("formatCooldown", () => {
  it("renders a minute-and-second countdown", () => {
    expect(formatCooldown(60)).toBe("1:00");
    expect(formatCooldown(9)).toBe("0:09");
    expect(formatCooldown(-4)).toBe("0:00");
  });
});

describe("isLikelyEmailAddress", () => {
  it("accepts an ordinary work address", () => {
    expect(isLikelyEmailAddress("priya@acme.co")).toBe(true);
  });

  it("rejects addresses that could not have been signed up with", () => {
    expect(isLikelyEmailAddress("")).toBe(false);
    expect(isLikelyEmailAddress("priya@acme")).toBe(false);
    expect(isLikelyEmailAddress("priya acme@co.uk")).toBe(false);
  });
});
