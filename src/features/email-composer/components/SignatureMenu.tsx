"use client";

import { Check, Signature } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { EmailSignature } from "../types/emailComposer.types";

export interface SignatureMenuProps {
  readonly signatures: readonly EmailSignature[];
  readonly activeSignatureId: string | null;
  readonly isLoading: boolean;
  readonly onSelect: (signatureId: string | null) => void;
  readonly variant: "icon" | "link";
}

const SCOPE_LABEL: Record<EmailSignature["scope"], string> = {
  personal: "Personal",
  workspace: "Workspace",
  organisation: "Organisation",
};

const SignatureMenu = ({
  signatures,
  activeSignatureId,
  isLoading,
  onSelect,
  variant,
}: SignatureMenuProps) => {
  return (
    <DropdownMenu>
      {variant === "icon" ? (
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Signature"
              title="Signature"
            />
          }
        >
          <Signature aria-hidden />
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger className="ml-auto flex-none rounded-md px-1.5 py-0.5 text-xs font-bold text-link transition-colors duration-(--dur-hover) ease-out outline-none hover:text-link-hover focus-visible:ring-2 focus-visible:ring-ring/50">
          Change
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent
        align={variant === "icon" ? "start" : "end"}
        side={variant === "icon" ? "top" : "bottom"}
        sideOffset={8}
        className="w-72"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="type-eyebrow text-eyebrow">
            Signature
          </DropdownMenuLabel>

          {isLoading ? (
            <p className="px-2.5 py-2 text-xs font-medium text-eyebrow">
              Loading signatures…
            </p>
          ) : null}

          {!isLoading && signatures.length === 0 ? (
            <p className="px-2.5 py-2 text-xs leading-normal font-medium text-eyebrow">
              No signatures yet. Build one in Signatures and it will appear
              here.
            </p>
          ) : null}

          {!isLoading ? (
            <DropdownMenuItem onClick={() => onSelect(null)}>
              <span className="min-w-0 flex-1">No signature</span>
              {activeSignatureId === null ? (
                <Check aria-hidden className="size-3.5 text-accent-500" />
              ) : null}
            </DropdownMenuItem>
          ) : null}

          {signatures.map((signature) => (
            <DropdownMenuItem
              key={signature.id}
              onClick={() => onSelect(signature.id)}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold text-heading">
                  {signature.label}
                </span>
                <span className="block truncate text-xs font-medium text-eyebrow">
                  {SCOPE_LABEL[signature.scope]}
                </span>
              </span>
              {signature.isLockedByAdmin ? (
                <Badge size="xs" variant="locked">
                  Locked
                </Badge>
              ) : null}
              {activeSignatureId === signature.id ? (
                <Check
                  aria-hidden
                  className="size-3.5 flex-none text-accent-500"
                />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SignatureMenu;
