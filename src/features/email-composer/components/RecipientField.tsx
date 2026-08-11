"use client";

import {
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Ban } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { createId } from "../lib/createId";
import {
  normaliseEmail,
  parseRecipientInput,
  recipientLabel,
} from "../lib/parseRecipients";
import type {
  ContactSuggestion,
  EmailRecipient,
} from "../types/emailComposer.types";

export interface RecipientFieldProps {
  readonly label: string;
  readonly recipients: readonly EmailRecipient[];
  readonly suggestions: readonly ContactSuggestion[];
  readonly isLoadingSuggestions: boolean;
  readonly suppressedEmails: readonly string[];
  readonly autoFocus?: boolean;
  readonly trailing?: ReactNode;
  readonly onQueryChange: (query: string) => void;
  readonly onAdd: (recipients: readonly EmailRecipient[]) => void;
  readonly onRemove: (recipientId: string) => void;
}

const COMMIT_KEYS = new Set(["Enter", "Tab", ",", ";"]);

const toRecipient = (suggestion: ContactSuggestion): EmailRecipient => ({
  id: createId("rcp"),
  email: normaliseEmail(suggestion.email),
  name: suggestion.name,
  contactId: suggestion.contactId,
});

const RecipientField = ({
  label,
  recipients,
  suggestions,
  isLoadingSuggestions,
  suppressedEmails,
  autoFocus = false,
  trailing,
  onQueryChange,
  onAdd,
  onRemove,
}: RecipientFieldProps) => {
  const inputId = useId();
  const listboxId = `${inputId}-suggestions`;
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [invalidEntry, setInvalidEntry] = useState<string | null>(null);

  const suppressed = new Set(
    suppressedEmails.map((email) => email.toLowerCase()),
  );
  const chosen = new Set(recipients.map((recipient) => recipient.email));
  const openSuggestions = suggestions.filter(
    (suggestion) => !chosen.has(normaliseEmail(suggestion.email)),
  );
  const isListOpen = value.trim().length > 0 && openSuggestions.length > 0;

  const updateValue = (next: string): void => {
    setValue(next);
    setActiveIndex(-1);
    setInvalidEntry(null);
    onQueryChange(next);
  };

  const commitText = (text: string): boolean => {
    const trimmed = text.trim();

    if (trimmed.length === 0) {
      return true;
    }

    const { recipients: parsed, invalid } = parseRecipientInput(trimmed);

    if (parsed.length > 0) {
      onAdd(parsed);
    }

    if (invalid.length > 0) {
      setInvalidEntry(invalid.join(", "));
      setValue(invalid.join(", "));
      onQueryChange("");
      return false;
    }

    updateValue("");
    return true;
  };

  const commitSuggestion = (suggestion: ContactSuggestion): void => {
    onAdd([toRecipient(suggestion)]);
    updateValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (isListOpen && event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % openSuggestions.length);
      return;
    }

    if (isListOpen && event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (index) =>
          (index + openSuggestions.length - 1) % openSuggestions.length,
      );
      return;
    }

    if (event.key === "Escape" && isListOpen) {
      event.preventDefault();
      setActiveIndex(-1);
      onQueryChange("");
      return;
    }

    if (COMMIT_KEYS.has(event.key)) {
      if (isListOpen && activeIndex >= 0) {
        event.preventDefault();
        commitSuggestion(openSuggestions[activeIndex]);
        return;
      }

      if (event.key === "Tab" && value.trim().length === 0) {
        return;
      }

      event.preventDefault();
      commitText(value);
      return;
    }

    if (
      event.key === "Backspace" &&
      value.length === 0 &&
      recipients.length > 0
    ) {
      event.preventDefault();
      onRemove(recipients[recipients.length - 1].id);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>): void => {
    const pasted = event.clipboardData.getData("text");

    if (!/[,;\n]/.test(pasted)) {
      return;
    }

    event.preventDefault();
    commitText(pasted);
  };

  return (
    <div className="flex-none border-b border-border-1">
      <div className="flex items-start gap-2.5 px-panel py-2">
        <label
          htmlFor={inputId}
          className="mt-1.5 w-9 flex-none cursor-text type-eyebrow text-eyebrow"
        >
          {label}
        </label>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {recipients.map((recipient) => {
            const isSuppressed = suppressed.has(recipient.email);

            return (
              <Badge
                key={recipient.id}
                size="md"
                variant={isSuppressed ? "danger" : "neutral"}
                title={
                  isSuppressed
                    ? `${recipient.email} is on the suppression list`
                    : recipient.email
                }
                onDismiss={() => onRemove(recipient.id)}
                dismissLabel={`Remove ${recipientLabel(recipient)}`}
              >
                {isSuppressed ? <Ban aria-hidden /> : null}
                {recipientLabel(recipient)}
              </Badge>
            );
          })}

          <div className="relative min-w-32 flex-1">
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              inputMode="email"
              autoComplete="off"
              autoFocus={autoFocus}
              spellCheck={false}
              value={value}
              role="combobox"
              aria-expanded={isListOpen}
              aria-controls={isListOpen ? listboxId : undefined}
              aria-autocomplete="list"
              aria-activedescendant={
                isListOpen && activeIndex >= 0
                  ? `${listboxId}-${activeIndex}`
                  : undefined
              }
              aria-invalid={invalidEntry ? true : undefined}
              aria-describedby={invalidEntry ? errorId : undefined}
              placeholder={
                recipients.length === 0 ? "Name or email address" : ""
              }
              onChange={(event) => updateValue(event.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onBlur={() => commitText(value)}
              className="h-6 w-full min-w-0 bg-transparent text-base text-text-2 outline-none placeholder:text-text-9"
            />

            {isListOpen ? (
              <ul
                id={listboxId}
                role="listbox"
                aria-label={`${label} suggestions`}
                className="absolute top-full left-0 z-20 mt-1.5 max-h-64 w-72 max-w-[80vw] animate-fa-pop overflow-y-auto rounded-3xl border border-border-6 bg-popover p-1 shadow-popover"
              >
                {openSuggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.contactId}
                    id={`${listboxId}-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      commitSuggestion(suggestion);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.75",
                      index === activeIndex && "bg-row-hover",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-heading">
                        {suggestion.name ?? suggestion.email}
                      </span>
                      <span className="block truncate font-mono text-xs font-medium text-eyebrow">
                        {suggestion.email}
                        {suggestion.company ? ` · ${suggestion.company}` : ""}
                      </span>
                    </span>
                    {suggestion.isSuppressed ? (
                      <Badge size="xs" variant="danger">
                        Suppressed
                      </Badge>
                    ) : null}
                  </li>
                ))}

                {isLoadingSuggestions ? (
                  <li
                    role="presentation"
                    className="px-2.5 py-1.5 text-xs font-medium text-eyebrow"
                  >
                    Searching contacts…
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
        </div>

        {trailing ? <div className="flex-none">{trailing}</div> : null}
      </div>

      {invalidEntry ? (
        <p
          id={errorId}
          role="alert"
          className="px-panel pb-2 text-xs font-bold text-danger-600"
        >
          {invalidEntry} is not a valid email address — fix it or remove it
          before sending.
        </p>
      ) : null}
    </div>
  );
};

export default RecipientField;
