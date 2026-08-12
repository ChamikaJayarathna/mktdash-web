"use client";

import {
  ComposerMinimisedBar,
  ComposerWindow,
  selectSessions,
  useComposerSend,
  useEmailComposerStore,
} from "@/features/email-composer";

export interface ComposerDockProps {
  readonly workspaceSlug: string;
  readonly senderName: string;
}

const ComposerDock = ({ workspaceSlug, senderName }: ComposerDockProps) => {
  const sessions = useEmailComposerStore(selectSessions);
  const setWindowState = useEmailComposerStore((state) => state.setWindowState);
  const closeComposer = useEmailComposerStore((state) => state.closeComposer);
  const { send, discard } = useComposerSend(workspaceSlug, senderName);

  if (sessions.length === 0) {
    return null;
  }

  const maximisedSession =
    sessions.find((session) => session.windowState === "maximised") ?? null;
  const dockedSessions = sessions.filter(
    (session) => session.windowState !== "maximised",
  );

  return (
    <>
      {maximisedSession ? (
        <div
          aria-hidden
          className="fixed inset-0 z-40 animate-fa-fade bg-scrim"
        />
      ) : null}

      {maximisedSession ? (
        <ComposerWindow
          key={maximisedSession.id}
          session={maximisedSession}
          workspaceSlug={workspaceSlug}
          onSend={send}
          onDiscard={discard}
        />
      ) : null}

      <div className="pointer-events-none fixed right-0 bottom-0 z-40 flex max-w-full items-end justify-end gap-3 overflow-x-auto px-4 md:px-6">
        {dockedSessions.map((session) =>
          session.windowState === "minimised" ? (
            <ComposerMinimisedBar
              key={session.id}
              session={session}
              onRestore={() => setWindowState(session.id, "normal")}
              onClose={() => closeComposer(session.id)}
            />
          ) : (
            <ComposerWindow
              key={session.id}
              session={session}
              workspaceSlug={workspaceSlug}
              onSend={send}
              onDiscard={discard}
            />
          ),
        )}
      </div>
    </>
  );
};

export default ComposerDock;
