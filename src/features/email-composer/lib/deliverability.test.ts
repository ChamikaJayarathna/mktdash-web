import { describe, expect, it } from "vitest";
import {
  emailDraftFixture,
  recipientFixture,
  sendingAccountFixture,
} from "@/test/fixtures/emailComposer.fixtures";
import { findSpamTriggers, runDeliverabilityChecks } from "./deliverability";
import type {
  DeliverabilityCheckId,
  DeliverabilityReport,
} from "../types/emailComposer.types";

const severityOf = (
  report: DeliverabilityReport,
  id: DeliverabilityCheckId,
): string | undefined =>
  report.checks.find((check) => check.id === id)?.severity;

describe("runDeliverabilityChecks", () => {
  it("passes a well-formed message", () => {
    const report = runDeliverabilityChecks({
      draft: emailDraftFixture(),
      account: sendingAccountFixture(),
      suppressedEmails: [],
    });

    expect(report.blockers).toEqual([]);
    expect(report.warnings).toEqual([]);
    expect(report.canSend).toBe(true);
  });

  it("blocks a send to a suppressed address and names it", () => {
    const report = runDeliverabilityChecks({
      draft: emailDraftFixture({
        to: [recipientFixture({ email: "dana@northwind.co" })],
      }),
      account: sendingAccountFixture(),
      suppressedEmails: ["dana@northwind.co"],
    });

    expect(report.canSend).toBe(false);
    expect(severityOf(report, "suppression")).toBe("blocker");
    expect(report.blockers[0].detail).toContain("dana@northwind.co");
  });

  it("blocks when no recipient has been added", () => {
    const report = runDeliverabilityChecks({
      draft: emailDraftFixture({ to: [] }),
      account: sendingAccountFixture(),
      suppressedEmails: [],
    });

    expect(severityOf(report, "recipients")).toBe("blocker");
    expect(report.canSend).toBe(false);
  });

  it("blocks a mailbox the membership is not granted", () => {
    const report = runDeliverabilityChecks({
      draft: emailDraftFixture(),
      account: sendingAccountFixture({ isGranted: false }),
      suppressedEmails: [],
    });

    expect(severityOf(report, "sending-account")).toBe("blocker");
  });

  it("blocks once the mailbox has used its daily cap", () => {
    const report = runDeliverabilityChecks({
      draft: emailDraftFixture(),
      account: sendingAccountFixture({ sentToday: 80, dailyCap: 80 }),
      suppressedEmails: [],
    });

    expect(severityOf(report, "sending-cap")).toBe("blocker");
    expect(report.canSend).toBe(false);
  });

  it("warns rather than blocks on a missing subject", () => {
    const report = runDeliverabilityChecks({
      draft: emailDraftFixture({ subject: "   " }),
      account: sendingAccountFixture(),
      suppressedEmails: [],
    });

    expect(severityOf(report, "subject")).toBe("warning");
    expect(report.canSend).toBe(true);
  });

  it("warns when there is no plain-text part", () => {
    const report = runDeliverabilityChecks({
      draft: emailDraftFixture({
        bodyHtml: '<p><img src="a.png"></p>',
        bodyText: "",
      }),
      account: sendingAccountFixture(),
      suppressedEmails: [],
    });

    expect(severityOf(report, "plain-text-part")).toBe("warning");
  });

  it("warns on an image-only body", () => {
    const report = runDeliverabilityChecks({
      draft: emailDraftFixture({
        bodyHtml: '<p><img src="a.png" alt="Deck">Hi</p>',
        bodyText: "Hi",
      }),
      account: sendingAccountFixture(),
      suppressedEmails: [],
    });

    expect(severityOf(report, "image-only")).toBe("warning");
  });

  it("warns once the message carries too many links", () => {
    const links = Array.from(
      { length: 9 },
      (_value, index) => `<a href="https://x.com/${index}">link</a>`,
    ).join("");

    const report = runDeliverabilityChecks({
      draft: emailDraftFixture({ bodyHtml: `<p>${links}</p>` }),
      account: sendingAccountFixture(),
      suppressedEmails: [],
    });

    expect(severityOf(report, "link-count")).toBe("warning");
  });

  it("blocks when no mailbox has been chosen at all", () => {
    const report = runDeliverabilityChecks({
      draft: emailDraftFixture({ fromAccountId: null }),
      account: null,
      suppressedEmails: [],
    });

    expect(severityOf(report, "sending-account")).toBe("blocker");
  });
});

describe("findSpamTriggers", () => {
  it("finds phrasing filters score against", () => {
    expect(findSpamTriggers("Act now", "100% free and risk-free")).toEqual(
      expect.arrayContaining(["act now", "risk free", "100% free"]),
    );
  });

  it("finds shouting and repeated punctuation", () => {
    expect(findSpamTriggers("URGENT", "Really?!!")).toEqual(
      expect.arrayContaining(["shouting caps", "repeated punctuation"]),
    );
  });

  it("leaves ordinary copy alone", () => {
    expect(
      findSpamTriggers("Partnership intro", "Worth fifteen minutes this week?"),
    ).toEqual([]);
  });
});
