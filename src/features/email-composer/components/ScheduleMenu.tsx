"use client";

import { useMemo, useState } from "react";
import { CalendarClock, ChevronDown } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  buildScheduleOptions,
  fromLocalInputValue,
  toLocalInputValue,
} from "../lib/scheduleOptions";

export interface ScheduleMenuProps {
  readonly timeZone: string;
  readonly scheduledAt: string | null;
  readonly isDisabled: boolean;
  readonly onSchedule: (at: Date | null) => void;
}

const ScheduleMenu = ({
  timeZone,
  scheduledAt,
  isDisabled,
  onSchedule,
}: ScheduleMenuProps) => {
  const now = useMemo(() => new Date(), []);
  const options = useMemo(
    () => buildScheduleOptions(now, timeZone),
    [now, timeZone],
  );
  const [customValue, setCustomValue] = useState(() =>
    toLocalInputValue(scheduledAt ? new Date(scheduledAt) : now, timeZone),
  );

  const applyCustom = (): void => {
    const parsed = fromLocalInputValue(customValue, timeZone);

    if (parsed) {
      onSchedule(parsed);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            disabled={isDisabled}
            aria-label="Schedule this send"
          />
        }
      >
        <CalendarClock aria-hidden />
        <span className="hidden sm:inline">Schedule</span>
        <ChevronDown aria-hidden className="size-3" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={8}
        className="w-72"
      >
        <DropdownMenuLabel className="type-eyebrow text-eyebrow">
          Schedule send · {timeZone}
        </DropdownMenuLabel>

        {options.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={() => onSchedule(option.at)}
            className="flex-col items-start gap-0.5 py-2"
          >
            <span className="text-sm font-bold text-heading">
              {option.label}
            </span>
            <span className="font-mono text-xs font-medium text-eyebrow">
              {option.detail}
            </span>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <div className="flex flex-col gap-1.5 px-2 py-1.5">
          <Label htmlFor="composer-schedule-custom" className="text-xs">
            Pick a date and time
          </Label>
          <Input
            id="composer-schedule-custom"
            type="datetime-local"
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            className="h-control-sm text-sm"
          />
          <div className="flex items-center gap-1.5">
            <Button type="button" size="sm" onClick={applyCustom}>
              Schedule
            </Button>
            {scheduledAt ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => onSchedule(null)}
              >
                Send immediately instead
              </Button>
            ) : null}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ScheduleMenu;
