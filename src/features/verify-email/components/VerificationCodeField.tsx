"use client";

import { useState, type ChangeEvent, type RefObject } from "react";
import { cn } from "@/shared/lib/utils";
import {
  VERIFICATION_CODE_LENGTH,
  sanitiseVerificationCode,
  toVerificationCodeSlots,
} from "../lib/verificationCode";

export interface VerificationCodeFieldProps {
  readonly id: string;
  readonly value: string;
  readonly inputRef: RefObject<HTMLInputElement | null>;
  readonly isDisabled: boolean;
  readonly isInvalid: boolean;
  readonly describedBy?: string;
  readonly onChange: (code: string) => void;
  readonly onBlur: () => void;
}

const VerificationCodeField = ({
  id,
  value,
  inputRef,
  isDisabled,
  isInvalid,
  describedBy,
  onChange,
  onBlur,
}: VerificationCodeFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const slots = toVerificationCodeSlots(value);
  const activeIndex = Math.min(value.length, VERIFICATION_CODE_LENGTH - 1);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(sanitiseVerificationCode(event.target.value));
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        inputMode="numeric"
        autoComplete="one-time-code"
        autoCorrect="off"
        spellCheck={false}
        maxLength={VERIFICATION_CODE_LENGTH}
        disabled={isDisabled}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy}
        className="absolute inset-0 z-10 size-full rounded-4xl bg-transparent text-transparent caret-transparent opacity-0 outline-none disabled:cursor-not-allowed"
      />

      <div aria-hidden className="flex items-center gap-1.5 sm:gap-2">
        {slots.map((digit, index) => {
          const isActive = isFocused && !isDisabled && index === activeIndex;

          return (
            <div
              key={index}
              className={cn(
                "flex h-13 flex-1 items-center justify-center rounded-2xl border-[1.5px] bg-surface-0 font-mono text-2xl font-semibold text-heading transition-[border-color,box-shadow] duration-(--dur-hover) ease-out",
                digit ? "border-border-6" : "border-border-5",
                isInvalid && "border-danger-600",
                isActive &&
                  (isInvalid
                    ? "ring-3 ring-destructive/20"
                    : "border-accent-500 ring-3 ring-ring/25"),
                isDisabled && "bg-surface-3 opacity-45",
              )}
            >
              {digit ? (
                digit
              ) : isActive ? (
                <span className="h-6 w-0.5 animate-caret-blink rounded-pill bg-heading" />
              ) : (
                <span className="text-text-9">0</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationCodeField;
