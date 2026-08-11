"use client";

import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { formatSavedAgo } from "../lib/formatFileSize";
import type {
  ComposerWindowState,
  DraftSaveState,
} from "../types/emailComposer.types";

export interface ComposerHeaderProps {
  readonly title: string;
  readonly windowState: ComposerWindowState;
  readonly saveState: DraftSaveState;
  readonly savedAt: string | null;
  readonly now: Date;
  readonly onMinimise: () => void;
  readonly onToggleMaximise: () => void;
  readonly onClose: () => void;
}

const SAVE_MESSAGE: Record<DraftSaveState, string> = {
  idle: "Not saved yet",
  saving: "Saving draft…",
  saved: "Draft saved",
  error: "Draft not saved — retrying",
};

const ComposerHeader = ({
  title,
  windowState,
  saveState,
  savedAt,
  now,
  onMinimise,
  onToggleMaximise,
  onClose,
}: ComposerHeaderProps) => {
  const isMaximised = windowState === "maximised";
  const savedLabel =
    saveState === "saved" && savedAt
      ? `Draft saved ${formatSavedAgo(savedAt, now)}`
      : SAVE_MESSAGE[saveState];

  return (
    <header className="flex flex-none items-center justify-between gap-3 border-b border-border-2 bg-surface-3 px-panel py-2.5">
      <h2 className="min-w-0 truncate text-md font-extrabold text-heading">
        {title}
      </h2>

      <div className="flex flex-none items-center gap-1.5">
        <span
          aria-live="polite"
          className="hidden font-mono text-xs font-medium text-eyebrow sm:inline"
        >
          {savedLabel}
        </span>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onMinimise}
          aria-label="Minimise composer"
        >
          <Minus aria-hidden />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onToggleMaximise}
          aria-label={isMaximised ? "Exit full screen" : "Full screen"}
          aria-pressed={isMaximised}
        >
          {isMaximised ? <Minimize2 aria-hidden /> : <Maximize2 aria-hidden />}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={onClose}
          aria-label="Close composer"
        >
          <X aria-hidden />
        </Button>
      </div>
    </header>
  );
};

export default ComposerHeader;
