"use client";

import { create } from "zustand";
import { createId } from "../lib/createId";
import { dedupeRecipients } from "../lib/parseRecipients";
import type {
  ComposerOpenOptions,
  ComposerSendState,
  ComposerSession,
  ComposerWindowState,
  DraftAttachment,
  DraftSaveState,
  EmailDraft,
  EmailRecipient,
  EmailRecipientField,
} from "../types/emailComposer.types";

export const MAX_OPEN_COMPOSERS = 3;

const createDraft = (options: ComposerOpenOptions): EmailDraft => ({
  id: options.draftId ?? createId("draft"),
  fromAccountId: options.fromAccountId ?? null,
  to: options.to ?? [],
  cc: options.cc ?? [],
  bcc: options.bcc ?? [],
  subject: options.subject ?? "",
  bodyHtml: options.bodyHtml ?? "",
  bodyText: "",
  attachments: [],
  signatureId: null,
  templateId: null,
  templateName: null,
  trackOpens: false,
  scheduledAt: null,
  updatedAt: new Date().toISOString(),
});

const createSession = (options: ComposerOpenOptions): ComposerSession => ({
  id: createId("composer"),
  draft: createDraft(options),
  windowState: "normal",
  isCcVisible: (options.cc?.length ?? 0) > 0,
  isBccVisible: false,
  isToolbarVisible: true,
  saveState: "idle",
  savedAt: null,
  sendState: "idle",
  sendError: null,
});

interface EmailComposerState {
  readonly sessions: readonly ComposerSession[];
  readonly openComposer: (options?: ComposerOpenOptions) => string | null;
  readonly closeComposer: (sessionId: string) => void;
  readonly closeAllComposers: () => void;
  readonly setWindowState: (
    sessionId: string,
    windowState: ComposerWindowState,
  ) => void;
  readonly toggleToolbar: (sessionId: string) => void;
  readonly setFieldVisible: (
    sessionId: string,
    field: Exclude<EmailRecipientField, "to">,
    isVisible: boolean,
  ) => void;
  readonly patchDraft: (
    sessionId: string,
    patch: Partial<Omit<EmailDraft, "id" | "updatedAt">>,
  ) => void;
  readonly addRecipients: (
    sessionId: string,
    field: EmailRecipientField,
    recipients: readonly EmailRecipient[],
  ) => void;
  readonly removeRecipient: (
    sessionId: string,
    field: EmailRecipientField,
    recipientId: string,
  ) => void;
  readonly addAttachment: (
    sessionId: string,
    attachment: DraftAttachment,
  ) => void;
  readonly removeAttachment: (sessionId: string, attachmentId: string) => void;
  readonly setSaveState: (
    sessionId: string,
    saveState: DraftSaveState,
    savedAt?: string,
  ) => void;
  readonly setSendState: (
    sessionId: string,
    sendState: ComposerSendState,
    sendError?: string | null,
  ) => void;
}

const replaceSession = (
  sessions: readonly ComposerSession[],
  sessionId: string,
  update: (session: ComposerSession) => ComposerSession,
): readonly ComposerSession[] =>
  sessions.map((session) =>
    session.id === sessionId ? update(session) : session,
  );

const touchDraft = (
  session: ComposerSession,
  patch: Partial<Omit<EmailDraft, "id" | "updatedAt">>,
): ComposerSession => ({
  ...session,
  draft: { ...session.draft, ...patch, updatedAt: new Date().toISOString() },
  saveState: "idle",
});

export const useEmailComposerStore = create<EmailComposerState>((set, get) => ({
  sessions: [],

  openComposer: (options = {}) => {
    const { sessions } = get();

    if (options.draftId) {
      const existing = sessions.find(
        (session) => session.draft.id === options.draftId,
      );

      if (existing) {
        set({
          sessions: replaceSession(sessions, existing.id, (session) => ({
            ...session,
            windowState:
              session.windowState === "minimised"
                ? "normal"
                : session.windowState,
          })),
        });

        return existing.id;
      }
    }

    if (sessions.length >= MAX_OPEN_COMPOSERS) {
      return null;
    }

    const session = createSession(options);
    set({ sessions: [...sessions, session] });

    return session.id;
  },

  closeComposer: (sessionId) => {
    set((state) => ({
      sessions: state.sessions.filter((session) => session.id !== sessionId),
    }));
  },

  closeAllComposers: () => {
    set({ sessions: [] });
  },

  setWindowState: (sessionId, windowState) => {
    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) => ({
        ...session,
        windowState,
      })),
    }));
  },

  toggleToolbar: (sessionId) => {
    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) => ({
        ...session,
        isToolbarVisible: !session.isToolbarVisible,
      })),
    }));
  },

  setFieldVisible: (sessionId, field, isVisible) => {
    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) => ({
        ...session,
        ...(field === "cc"
          ? { isCcVisible: isVisible }
          : { isBccVisible: isVisible }),
      })),
    }));
  },

  patchDraft: (sessionId, patch) => {
    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) =>
        touchDraft(session, patch),
      ),
    }));
  },

  addRecipients: (sessionId, field, recipients) => {
    if (recipients.length === 0) {
      return;
    }

    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) =>
        touchDraft(session, {
          [field]: dedupeRecipients(session.draft[field], recipients),
        }),
      ),
    }));
  },

  removeRecipient: (sessionId, field, recipientId) => {
    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) =>
        touchDraft(session, {
          [field]: session.draft[field].filter(
            (recipient) => recipient.id !== recipientId,
          ),
        }),
      ),
    }));
  },

  addAttachment: (sessionId, attachment) => {
    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) =>
        touchDraft(session, {
          attachments: [...session.draft.attachments, attachment],
        }),
      ),
    }));
  },

  removeAttachment: (sessionId, attachmentId) => {
    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) =>
        touchDraft(session, {
          attachments: session.draft.attachments.filter(
            (attachment) => attachment.id !== attachmentId,
          ),
        }),
      ),
    }));
  },

  setSaveState: (sessionId, saveState, savedAt) => {
    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) => ({
        ...session,
        saveState,
        savedAt: savedAt ?? session.savedAt,
      })),
    }));
  },

  setSendState: (sessionId, sendState, sendError = null) => {
    set((state) => ({
      sessions: replaceSession(state.sessions, sessionId, (session) => ({
        ...session,
        sendState,
        sendError,
      })),
    }));
  },
}));

export const selectSessions = (state: EmailComposerState) => state.sessions;

export const selectSession =
  (sessionId: string) =>
  (state: EmailComposerState): ComposerSession | undefined =>
    state.sessions.find((session) => session.id === sessionId);

export const selectHasCapacity = (state: EmailComposerState): boolean =>
  state.sessions.length < MAX_OPEN_COMPOSERS;
