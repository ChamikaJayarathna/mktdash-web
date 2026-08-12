"use client";

import { useId, useRef } from "react";
import {
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Link2,
  Paperclip,
  Send,
  Trash2,
  Type,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { formatScheduleStamp } from "../lib/scheduleOptions";
import type {
  ComposerSendState,
  EmailSignature,
  EmailTemplateSummary,
} from "../types/emailComposer.types";
import EmojiPickerMenu from "./EmojiPickerMenu";
import InsertUrlMenu from "./InsertUrlMenu";
import ScheduleMenu from "./ScheduleMenu";
import SignatureMenu from "./SignatureMenu";

export interface ComposerActionsProps {
  readonly sendState: ComposerSendState;
  readonly canSend: boolean;
  readonly blockerSummary: string | null;
  readonly scheduledAt: string | null;
  readonly timeZone: string;
  readonly isToolbarVisible: boolean;
  readonly trackOpens: boolean;
  readonly templates: readonly EmailTemplateSummary[];
  readonly isTemplatesLoading: boolean;
  readonly signatures: readonly EmailSignature[];
  readonly isSignaturesLoading: boolean;
  readonly activeSignatureId: string | null;
  readonly onSend: () => void;
  readonly onSchedule: (at: Date | null) => void;
  readonly onToggleToolbar: () => void;
  readonly onToggleTrackOpens: () => void;
  readonly onAttachFiles: (files: FileList) => void;
  readonly onInsertLink: (href: string) => void;
  readonly onInsertImage: (src: string, alt: string) => void;
  readonly onApplyTemplate: (template: EmailTemplateSummary) => void;
  readonly onSelectSignature: (signatureId: string | null) => void;
  readonly onInsertEmoji: (emoji: string) => void;
  readonly onDiscard: () => void;
}

const ComposerActions = ({
  sendState,
  canSend,
  blockerSummary,
  scheduledAt,
  timeZone,
  isToolbarVisible,
  trackOpens,
  templates,
  isTemplatesLoading,
  signatures,
  isSignaturesLoading,
  activeSignatureId,
  onSend,
  onSchedule,
  onToggleToolbar,
  onToggleTrackOpens,
  onAttachFiles,
  onInsertLink,
  onInsertImage,
  onApplyTemplate,
  onSelectSignature,
  onInsertEmoji,
  onDiscard,
}: ComposerActionsProps) => {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSending = sendState === "sending";
  const isScheduled = scheduledAt !== null;
  const sendLabel = isSending
    ? "Sending…"
    : isScheduled
      ? "Schedule send"
      : "Send";

  return (
    <div className="flex-none border-t border-border-2 bg-card px-panel py-2.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                size="lg"
                disabled={!canSend || isSending}
                onClick={onSend}
                aria-describedby={
                  blockerSummary ? `${fileInputId}-blockers` : undefined
                }
              />
            }
          >
            <Send aria-hidden />
            {sendLabel}
          </TooltipTrigger>
          <TooltipContent>
            {blockerSummary ?? `${sendLabel} — ⌘↵`}
          </TooltipContent>
        </Tooltip>

        <ScheduleMenu
          timeZone={timeZone}
          scheduledAt={scheduledAt}
          isDisabled={isSending}
          onSchedule={onSchedule}
        />

        <span aria-hidden className="mx-1 h-5.5 w-px flex-none bg-border-4" />

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onToggleToolbar}
          aria-pressed={isToolbarVisible}
          aria-label="Formatting options"
          title="Formatting options"
        >
          <Type aria-hidden />
        </Button>

        <input
          ref={fileInputRef}
          id={fileInputId}
          type="file"
          multiple
          aria-hidden
          tabIndex={-1}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              onAttachFiles(event.target.files);
            }

            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach files"
          title="Attach files"
        >
          <Paperclip aria-hidden />
        </Button>

        <InsertUrlMenu
          icon={Link2}
          label="Insert link"
          urlLabel="Link address"
          urlPlaceholder="https://example.com"
          submitLabel="Link selection"
          onSubmit={(href) => onInsertLink(href)}
        />

        <EmojiPickerMenu onSelect={onInsertEmoji} />

        <InsertUrlMenu
          icon={ImageIcon}
          label="Insert image"
          urlLabel="Image address"
          urlPlaceholder="https://example.com/image.png"
          secondaryLabel="Alt text"
          secondaryPlaceholder="What the image shows"
          submitLabel="Insert image"
          onSubmit={onInsertImage}
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button type="button" variant="tinted" size="sm" />}
          >
            <FileText aria-hidden />
            Template
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="top"
            sideOffset={8}
            className="w-72"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="type-eyebrow text-eyebrow">
                Insert a template
              </DropdownMenuLabel>

              {isTemplatesLoading ? (
                <p className="px-2.5 py-2 text-xs font-medium text-eyebrow">
                  Loading templates…
                </p>
              ) : null}

              {!isTemplatesLoading && templates.length === 0 ? (
                <p className="px-2.5 py-2 text-xs leading-normal font-medium text-eyebrow">
                  No templates yet. Build one in Templates and it will appear
                  here.
                </p>
              ) : null}

              {templates.map((template) => (
                <DropdownMenuItem
                  key={template.id}
                  onClick={() => onApplyTemplate(template)}
                  className="flex-col items-start gap-0.5 py-2"
                >
                  <span className="text-sm font-bold text-heading">
                    {template.name}
                  </span>
                  <span className="text-xs font-medium text-eyebrow">
                    {template.scope} · {template.state.replace("-", " ")}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <SignatureMenu
          variant="icon"
          signatures={signatures}
          isLoading={isSignaturesLoading}
          activeSignatureId={activeSignatureId}
          onSelect={onSelectSignature}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggleTrackOpens}
          aria-pressed={trackOpens}
          title={
            trackOpens
              ? "Open tracking on — inflated by privacy proxies"
              : "Open tracking off — the default for one-to-one email"
          }
        >
          {trackOpens ? <Eye aria-hidden /> : <EyeOff aria-hidden />}
          <span className="hidden md:inline">
            {trackOpens ? "Tracking on" : "Tracking off"}
          </span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDiscard}
          aria-label="Discard draft"
          title="Discard draft"
          className="ml-auto hover:bg-danger-050 hover:text-danger-600"
        >
          <Trash2 aria-hidden />
        </Button>
      </div>

      {isScheduled && scheduledAt ? (
        <p className="mt-2 font-mono text-xs font-medium text-accent-700">
          Queued for {formatScheduleStamp(new Date(scheduledAt), timeZone)} —
          cancellable until it leaves.
        </p>
      ) : null}

      {blockerSummary ? (
        <p
          id={`${fileInputId}-blockers`}
          role="status"
          className="mt-2 text-xs font-bold text-danger-600"
        >
          {blockerSummary}
        </p>
      ) : null}
    </div>
  );
};

export default ComposerActions;
