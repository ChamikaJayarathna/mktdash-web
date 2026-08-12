"use client";

import { useMemo } from "react";
import { PenLine } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { sanitizeEmailHtml } from "../lib/sanitizeEmailHtml";
import type { EmailSignature } from "../types/emailComposer.types";
import SignatureMenu from "./SignatureMenu";

export interface ComposerSignatureBlockProps {
  readonly signatures: readonly EmailSignature[];
  readonly activeSignature: EmailSignature | null;
  readonly isLoading: boolean;
  readonly onSelect: (signatureId: string | null) => void;
}

const SIGNATURE_HTML_CLASSNAME =
  "text-base leading-relaxed text-body [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_p]:my-0";

const ComposerSignatureBlock = ({
  signatures,
  activeSignature,
  isLoading,
  onSelect,
}: ComposerSignatureBlockProps) => {
  const safeHtml = useMemo(
    () => (activeSignature ? sanitizeEmailHtml(activeSignature.html) : ""),
    [activeSignature],
  );

  return (
    <section
      aria-label="Signature"
      className="mt-4 rounded-2xl border border-dashed border-border-6 bg-surface-1 p-card"
    >
      <div className="mb-2 flex items-center gap-2">
        <PenLine
          aria-hidden
          className="size-3 flex-none text-eyebrow"
          strokeWidth={1.9}
        />
        <span className="min-w-0 truncate type-eyebrow text-eyebrow">
          Signature · {activeSignature?.label ?? "None"}
        </span>

        {activeSignature?.isLockedByAdmin ? (
          <Badge size="xs" variant="locked">
            Locked by admin
          </Badge>
        ) : null}

        <SignatureMenu
          variant="link"
          signatures={signatures}
          isLoading={isLoading}
          activeSignatureId={activeSignature?.id ?? null}
          onSelect={onSelect}
        />
      </div>

      {activeSignature ? (
        <div
          className={SIGNATURE_HTML_CLASSNAME}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      ) : (
        <p className="text-xs font-medium text-eyebrow">
          Nothing will be appended — this message goes out unsigned.
        </p>
      )}
    </section>
  );
};

export default ComposerSignatureBlock;
