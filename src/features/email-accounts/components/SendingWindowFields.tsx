"use client";

import { useId } from "react";
import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/ui/label";
import { WEEKDAYS } from "../lib/sendingWindow";
import type { Weekday } from "../types/emailAccount.types";
import TimeCombobox from "./TimeCombobox";
import TimeZoneCombobox from "./TimeZoneCombobox";

export interface SendingWindowFieldsProps {
  readonly days: readonly Weekday[];
  readonly startTime: string;
  readonly endTime: string;
  readonly timeZone: string;
  readonly daysError: string | null;
  readonly endTimeError: string | null;
  readonly onToggleDay: (day: Weekday) => void;
  readonly onStartTimeChange: (value: string) => void;
  readonly onEndTimeChange: (value: string) => void;
  readonly onTimeZoneChange: (value: string) => void;
}

const SendingWindowFields = ({
  days,
  startTime,
  endTime,
  timeZone,
  daysError,
  endTimeError,
  onToggleDay,
  onStartTimeChange,
  onEndTimeChange,
  onTimeZoneChange,
}: SendingWindowFieldsProps) => {
  const startId = useId();
  const endId = useId();
  const timeZoneId = useId();
  const daysErrorId = `${startId}-days-error`;
  const endErrorId = `${endId}-error`;

  return (
    <div className="flex flex-col gap-3">
      <fieldset className="min-w-0">
        <legend className="text-sm leading-snug font-bold text-text-5">
          Sending days
        </legend>
        <div
          className="mt-1.5 flex flex-wrap gap-1.5"
          aria-describedby={daysError ? daysErrorId : undefined}
        >
          {WEEKDAYS.map((day) => {
            const isOn = days.includes(day.id);

            return (
              <label
                key={day.id}
                className={cn(
                  "cursor-pointer rounded-pill border-[1.5px] px-3 py-1.25 text-xs font-bold transition-colors duration-(--dur-hover) ease-out",
                  "has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
                  isOn
                    ? "border-accent-500 bg-accent-050 text-accent-700"
                    : "border-border-5 bg-surface-0 text-text-5 hover:border-accent-200",
                )}
              >
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => onToggleDay(day.id)}
                  className="sr-only"
                />
                {day.label}
              </label>
            );
          })}
        </div>
        {daysError ? (
          <p
            id={daysErrorId}
            role="alert"
            className="mt-1.5 text-xs text-danger-600"
          >
            {daysError}
          </p>
        ) : null}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={startId}>Opens</Label>
          <TimeCombobox
            id={startId}
            label="Opens"
            value={startTime}
            onChange={onStartTimeChange}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={endId}>Closes</Label>
          <TimeCombobox
            id={endId}
            label="Closes"
            value={endTime}
            isInvalid={endTimeError !== null}
            describedBy={endTimeError ? endErrorId : undefined}
            onChange={onEndTimeChange}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <Label htmlFor={timeZoneId}>Timezone</Label>
          <TimeZoneCombobox
            id={timeZoneId}
            value={timeZone}
            onChange={onTimeZoneChange}
          />
        </div>
      </div>

      {endTimeError ? (
        <p id={endErrorId} role="alert" className="text-xs text-danger-600">
          {endTimeError}
        </p>
      ) : null}
    </div>
  );
};

export default SendingWindowFields;
