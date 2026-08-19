import { describe, expect, it } from "vitest";
import {
  fastmailProviderFixture,
  gmailProviderFixture,
} from "@/test/fixtures/emailAccounts.fixtures";
import type { EmailProvider } from "../types/emailAccount.types";
import { detectProvider, emailDomain } from "./detectProvider";

const imapProviderFixture: EmailProvider = {
  ...fastmailProviderFixture,
  id: "imap",
  name: "Custom IMAP / SMTP",
  sub: "Any other provider",
  monogram: "::",
  tone: "neutral",
  domains: [],
};

const providers: readonly EmailProvider[] = [
  gmailProviderFixture,
  fastmailProviderFixture,
  imapProviderFixture,
];

describe("emailDomain", () => {
  it("reads the domain out of a full address", () => {
    expect(emailDomain("priya@followaxis.com")).toBe("followaxis.com");
  });

  it("lowercases and trims so casing never changes the match", () => {
    expect(emailDomain("Priya@FollowAxis.COM ")).toBe("followaxis.com");
  });

  it("returns null until there is something on both sides of the @", () => {
    expect(emailDomain("priya")).toBeNull();
    expect(emailDomain("@followaxis.com")).toBeNull();
    expect(emailDomain("priya@")).toBeNull();
  });

  it("returns null for a domain with no dot, which cannot be looked up", () => {
    expect(emailDomain("priya@localhost")).toBeNull();
  });
});

describe("detectProvider", () => {
  it("matches a known consumer domain with high confidence", () => {
    const detection = detectProvider("someone@gmail.com", providers);

    expect(detection?.provider.id).toBe("gmail");
    expect(detection?.confidence).toBe("high");
    expect(detection?.how).toBe("Matched a known consumer domain");
  });

  it("falls back to an MX hint for a business domain", () => {
    const detection = detectProvider("priya@followaxis.com", providers);

    expect(detection?.provider.id).toBe("gmail");
    expect(detection?.how).toContain("aspmx.l.google.com");
  });

  it("drops to manual IMAP with low confidence when nothing matches", () => {
    const detection = detectProvider("hello@unknown-host.dev", providers);

    expect(detection?.provider.id).toBe("imap");
    expect(detection?.confidence).toBe("low");
    expect(detection?.how).toBe("No MX match for unknown-host.dev");
  });

  it("returns nothing until the address is complete", () => {
    expect(detectProvider("priya@", providers)).toBeNull();
    expect(detectProvider("", providers)).toBeNull();
  });
});
