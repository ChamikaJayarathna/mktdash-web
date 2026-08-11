"use client";

import { useMemo } from "react";
import { PenLine } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { sanitizeEmailHtml } from "../lib/sanitizeEmailHtml";
import type { EmailSignature } from "../types/emailComposer.types";

export interface ComposerSignatureBlockProps {
  readonly signatures: readonly EmailSignature[];
  readonly activeSignature: EmailSignature | null;
  readonly onSelect: (signatureId: string | null) => void;
}

const SIGNATURE_HTML_CLASSNAME =
  "text-base leading-relaxed text-body [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_p]:my-0";

const ComposerSignatureBlock = ({
  signatures,
  activeSignature,
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

        <DropdownMenu>
          <DropdownMenuTrigger className="ml-auto flex-none rounded-md px-1.5 py-0.5 text-xs font-bold text-link transition-colors duration-(--dur-hover) ease-out outline-none hover:text-link-hover focus-visible:ring-2 focus-visible:ring-ring/50">
            Change
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="w-64">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="type-eyebrow text-eyebrow">
                Signature
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onSelect(null)}>
                No signature
              </DropdownMenuItem>
              {signatures.map((signature) => (
                <DropdownMenuItem
                  key={signature.id}
                  onClick={() => onSelect(signature.id)}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {signature.label}
                  </span>
                  {signature.isLockedByAdmin ? (
                    <Badge size="xs" variant="locked">
                      Locked
                    </Badge>
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
