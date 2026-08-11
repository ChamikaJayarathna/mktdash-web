import { describe, expect, it } from "vitest";
import {
  dedupeRecipients,
  isValidEmail,
  parseRecipientInput,
  recipientInitials,
} from "./parseRecipients";

describe("parseRecipientInput", () => {
  it("reads a bare address", () => {
    const { recipients, invalid } = parseRecipientInput("marcus@northwind.co");

    expect(invalid).toEqual([]);
    expect(recipients).toHaveLength(1);
    expect(recipients[0]).toMatchObject({
      email: "marcus@northwind.co",
      name: null,
    });
  });

  it("reads the display-name form and keeps the name", () => {
    const { recipients } = parseRecipientInput(
      '"Marcus Lee" <Marcus@Northwind.co>',
    );

    expect(recipients[0]).toMatchObject({
      email: "marcus@northwind.co",
      name: "Marcus Lee",
    });
  });

  it("splits a pasted list across commas, semicolons and newlines", () => {
    const { recipients, invalid } = parseRecipientInput(
      "a@x.com, b@x.com; Cara <c@x.com>\nd@x.com",
    );

    expect(invalid).toEqual([]);
    expect(recipients.map((recipient) => recipient.email)).toEqual([
      "a@x.com",
      "b@x.com",
      "c@x.com",
      "d@x.com",
    ]);
  });

  it("splits space-separated bare addresses but not inside angle brackets", () => {
    const { recipients } = parseRecipientInput("a@x.com b@x.com");

    expect(recipients).toHaveLength(2);

    const { recipients: withName } = parseRecipientInput(
      "Ada Lovelace <a@x.com>",
    );

    expect(withName).toHaveLength(1);
    expect(withName[0].name).toBe("Ada Lovelace");
  });

  it("reports entries it could not read instead of dropping them", () => {
    const { recipients, invalid } = parseRecipientInput(
      "good@x.com, not-an-email",
    );

    expect(recipients.map((recipient) => recipient.email)).toEqual([
      "good@x.com",
    ]);
    expect(invalid).toEqual(["not-an-email"]);
  });

  it("gives every recipient a distinct id", () => {
    const { recipients } = parseRecipientInput("a@x.com, b@x.com");

    expect(recipients[0].id).not.toBe(recipients[1].id);
  });
});

describe("dedupeRecipients", () => {
  it("keeps the first occurrence of an address", () => {
    const existing = parseRecipientInput("a@x.com").recipients;
    const incoming = parseRecipientInput("A@X.com, b@x.com").recipients;

    const merged = dedupeRecipients(existing, incoming);

    expect(merged.map((recipient) => recipient.email)).toEqual([
      "a@x.com",
      "b@x.com",
    ]);
  });

  it("returns the original list untouched when nothing is new", () => {
    const existing = parseRecipientInput("a@x.com").recipients;

    expect(dedupeRecipients(existing, existing)).toBe(existing);
  });
});

describe("isValidEmail", () => {
  it.each([
    ["marcus@northwind.co", true],
    ["  spaced@x.com  ", true],
    ["no-at-sign", false],
    ["missing@domain", false],
    ["", false],
  ])("treats %s as valid=%s", (value, expected) => {
    expect(isValidEmail(value)).toBe(expected);
  });
});

describe("recipientInitials", () => {
  it("uses first and last name when a name is known", () => {
    expect(
      recipientInitials({
        id: "1",
        email: "m@x.com",
        name: "Marcus Lee",
        contactId: null,
      }),
    ).toBe("ML");
  });

  it("falls back to the address when there is no name", () => {
    expect(
      recipientInitials({
        id: "1",
        email: "marcus.lee@x.com",
        name: null,
        contactId: null,
      }),
    ).toBe("ML");
  });
});
