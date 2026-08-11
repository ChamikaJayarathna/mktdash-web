"use client";

import { useId } from "react";
import { cn } from "@/shared/lib/utils";

const MOBILE_SUBJECT_LIMIT = 65;

export interface ComposerSubjectRowProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

const ComposerSubjectRow = ({ value, onChange }: ComposerSubjectRowProps) => {
  const inputId = useId();
  const length = value.trim().length;
  const isLong = length > MOBILE_SUBJECT_LIMIT;

  return (
    <div className="flex flex-none items-center gap-2.5 border-b border-border-1 px-panel py-2">
      <label
        htmlFor={inputId}
        className="w-9 flex-none cursor-text type-eyebrow text-eyebrow"
      >
        Subj
      </label>

      <input
        id={inputId}
        type="text"
        value={value}
        autoComplete="off"
        placeholder="Subject"
        onChange={(event) => onChange(event.target.value)}
        className="h-6 min-w-0 flex-1 bg-transparent text-base font-semibold text-heading outline-none placeholder:font-normal placeholder:text-text-9"
      />

      <span
        className={cn(
          "flex-none font-mono text-xs font-medium",
          isLong ? "text-warning-700" : "text-eyebrow",
        )}
        title={
          isLong
            ? `Over ${MOBILE_SUBJECT_LIMIT} characters — mobile clients will cut this off`
            : undefined
        }
      >
        {length} / {MOBILE_SUBJECT_LIMIT}
      </span>
    </div>
  );
};

export default ComposerSubjectRow;
