"use client";

import { ChevronUp, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import type { ComposerSession } from "../types/emailComposer.types";

export interface ComposerMinimisedBarProps {
  readonly session: ComposerSession;
  readonly onRestore: () => void;
  readonly onClose: () => void;
}

const ComposerMinimisedBar = ({
  session,
  onRestore,
  onClose,
}: ComposerMinimisedBarProps) => {
  const title = session.draft.subject.trim() || "New message";
  const recipientCount =
    session.draft.to.length +
    session.draft.cc.length +
    session.draft.bcc.length;

  return (
    <div className="pointer-events-auto flex w-64 animate-fa-pop items-center gap-1 rounded-t-4xl border border-b-0 border-border-6 bg-surface-3 py-1.5 pr-1.5 pl-3">
      <button
        type="button"
        onClick={onRestore}
        className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span className="block truncate text-sm font-bold text-heading">
          {title}
        </span>
        <span className="block truncate font-mono text-2xs font-medium text-eyebrow">
          {recipientCount === 0
            ? "No recipients yet"
            : `${recipientCount} recipient${recipientCount === 1 ? "" : "s"}`}
        </span>
      </button>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onRestore}
        aria-label={`Restore composer — ${title}`}
      >
        <ChevronUp aria-hidden />
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onClose}
        aria-label={`Close composer — ${title}`}
      >
        <X aria-hidden />
      </Button>
    </div>
  );
};

export default ComposerMinimisedBar;
