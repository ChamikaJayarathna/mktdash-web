"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { substringFilter } from "../lib/commandFilter";
import {
  buildTimeOptions,
  findTimeOption,
  parseTimeQuery,
  to12Hour,
  withCustomTime,
} from "../lib/timeOptions";

export interface TimeComboboxProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly isInvalid?: boolean;
  readonly describedBy?: string;
  readonly onChange: (time: string) => void;
}

const HALF_HOUR_OPTIONS = buildTimeOptions();

const TimeCombobox = ({
  id,
  label,
  value,
  isInvalid,
  describedBy,
  onChange,
}: TimeComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeValue, setActiveValue] = useState("");

  const typed = parseTimeQuery(query);
  const options = withCustomTime(
    withCustomTime(HALF_HOUR_OPTIONS, value),
    typed ?? "",
  );
  const selected = findTimeOption(options, value);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setQuery("");
      setActiveValue(selected?.search ?? "");
    }

    setIsOpen(open);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-label={label}
        aria-invalid={isInvalid ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "flex h-control w-full min-w-0 items-center gap-2 rounded-xl border bg-surface-0 px-2.75 text-left",
          "transition-[border-color,box-shadow] duration-(--dur-hover) ease-out outline-none",
          "hover:border-accent-200 focus-visible:border-accent-500 focus-visible:ring-3 focus-visible:ring-ring/25",
          isInvalid ? "border-danger-600" : "border-border-5",
        )}
      >
        <span className="min-w-0 flex-1 truncate font-mono text-base font-medium text-text-2">
          {value}
        </span>
        <span className="flex-none text-xs font-medium text-eyebrow">
          {to12Hour(value)}
        </span>
        <ChevronsUpDown
          aria-hidden
          className="size-3.5 flex-none text-faint"
          strokeWidth={1.8}
        />
      </PopoverTrigger>

      <PopoverContent className="w-(--anchor-width) min-w-56 p-0" align="start">
        <Command
          value={activeValue}
          onValueChange={setActiveValue}
          filter={substringFilter}
        >
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search or type a time…"
          />
          <CommandList>
            <CommandEmpty>Type a time such as 09:30.</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                value={option.search}
                aria-label={`${option.label}, ${option.caption}`}
                onSelect={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className="gap-2"
              >
                <Check
                  aria-hidden
                  className={cn(
                    "size-3.5 flex-none text-accent-500",
                    option.id === value ? "opacity-100" : "opacity-0",
                  )}
                  strokeWidth={2.4}
                />
                <span className="min-w-0 flex-1 truncate font-mono text-sm font-semibold text-heading">
                  {option.label}
                </span>
                <span className="flex-none text-xs font-medium text-eyebrow">
                  {option.caption}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TimeCombobox;
