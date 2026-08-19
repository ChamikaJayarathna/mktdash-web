import { describe, expect, it } from "vitest";
import {
  nearlyFullMailboxFixture,
  pausedMailboxFixture,
  syncingMailboxFixture,
} from "@/test/fixtures/emailAccounts.fixtures";
import {
  formatEndpoint,
  formatStorageText,
  isStorageUnderPressure,
  storageUsagePercent,
  syncStateLabel,
} from "./emailAccountFormat";
import { formatSyncAgo } from "./relativeTime";

describe("storageUsagePercent", () => {
  it("reports used storage as a share of the quota", () => {
    expect(storageUsagePercent(syncingMailboxFixture)).toBe(28);
  });

  it("never exceeds a full bar when usage overshoots the quota", () => {
    expect(
      storageUsagePercent({
        ...syncingMailboxFixture,
        storageUsedGb: 40,
        storageQuotaGb: 15,
      }),
    ).toBe(100);
  });

  it("stays at zero rather than dividing by an absent quota", () => {
    expect(
      storageUsagePercent({ ...syncingMailboxFixture, storageQuotaGb: 0 }),
    ).toBe(0);
  });
});

describe("isStorageUnderPressure", () => {
  it("flags a mailbox past the 80% mark", () => {
    expect(isStorageUnderPressure(nearlyFullMailboxFixture)).toBe(true);
  });

  it("leaves a mailbox with headroom unflagged", () => {
    expect(isStorageUnderPressure(syncingMailboxFixture)).toBe(false);
  });
});

describe("formatStorageText", () => {
  it("reads as used of quota", () => {
    expect(formatStorageText(syncingMailboxFixture)).toBe("4.2 GB of 15 GB");
  });
});

describe("syncStateLabel", () => {
  it("distinguishes an active mailbox from a paused one", () => {
    expect(syncStateLabel(syncingMailboxFixture)).toBe("Auto sync on");
    expect(syncStateLabel(pausedMailboxFixture)).toBe("Sync paused");
  });
});

describe("formatEndpoint", () => {
  it("joins host and port the way the mailbox card shows it", () => {
    expect(formatEndpoint("imap.gmail.com", 993)).toBe("imap.gmail.com:993");
  });
});

describe("formatSyncAgo", () => {
  const now = new Date("2026-08-12T10:00:00.000Z");

  it("counts seconds under a minute", () => {
    expect(formatSyncAgo("2026-08-12T09:59:26.000Z", now)).toBe("34s ago");
  });

  it("counts whole minutes under an hour", () => {
    expect(formatSyncAgo("2026-08-12T09:56:00.000Z", now)).toBe("4m ago");
  });

  it("counts whole hours under a day", () => {
    expect(formatSyncAgo("2026-08-12T08:00:00.000Z", now)).toBe("2h ago");
  });

  it("counts days beyond that", () => {
    expect(formatSyncAgo("2026-08-09T10:00:00.000Z", now)).toBe("3d ago");
  });

  it("does not render a negative age from a clock skew", () => {
    expect(formatSyncAgo("2026-08-12T10:00:30.000Z", now)).toBe("just now");
  });
});
