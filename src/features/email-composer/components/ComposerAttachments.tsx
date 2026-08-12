"use client";

import { Paperclip, X } from "lucide-react";
import { formatFileSize } from "../lib/formatFileSize";
import type { DraftAttachment } from "../types/emailComposer.types";

export interface ComposerAttachmentsProps {
  readonly attachments: readonly DraftAttachment[];
  readonly onRemove: (attachmentId: string) => void;
}

const ComposerAttachments = ({
  attachments,
  onRemove,
}: ComposerAttachmentsProps) => {
  if (attachments.length === 0) {
    return null;
  }

  const totalBytes = attachments.reduce(
    (total, attachment) => total + attachment.sizeBytes,
    0,
  );

  return (
    <section
      aria-label="Attachments"
      className="max-h-24 flex-none overflow-y-auto border-t border-border-1 bg-surface-1 px-panel py-2.5"
    >
      <p className="mb-1.75 type-eyebrow text-eyebrow">
        {attachments.length} attachment{attachments.length === 1 ? "" : "s"} ·{" "}
        {formatFileSize(totalBytes)}
      </p>

      <ul className="flex flex-wrap gap-1.75">
        {attachments.map((attachment) => (
          <li
            key={attachment.id}
            className="flex items-center gap-2 rounded-xl border border-border-5 bg-card py-1.25 pr-1.5 pl-2.25"
          >
            <Paperclip
              aria-hidden
              className="size-3 flex-none text-meta"
              strokeWidth={1.9}
            />
            <span className="min-w-0">
              <span className="block max-w-44 truncate text-sm font-bold text-heading">
                {attachment.name}
              </span>
              <span className="block font-mono text-2xs font-medium text-eyebrow">
                {formatFileSize(attachment.sizeBytes)}
              </span>
            </span>
            <button
              type="button"
              onClick={() => onRemove(attachment.id)}
              aria-label={`Remove ${attachment.name}`}
              className="grid size-5 flex-none place-items-center rounded-md text-faint transition-colors duration-(--dur-hover) ease-out outline-none hover:bg-danger-050 hover:text-danger-600 focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <X aria-hidden className="size-3" strokeWidth={2.2} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ComposerAttachments;
