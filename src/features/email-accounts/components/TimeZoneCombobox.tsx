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
import { useTimeZones } from "../hooks/useTimeZones";
import { substringFilter } from "../lib/commandFilter";
import { findTimeZoneOption, withCurrentZone } from "../lib/timeZones";

export interface TimeZoneComboboxProps {
  readonly id: string;
  readonly value: string;
  readonly onChange: (timeZone: string) => void;
}

const TimeZoneCombobox = ({ id, value, onChange }: TimeZoneComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { options, isLoading } = useTimeZones(true);

  const allOptions = withCurrentZone(options, value);
  const selected = findTimeZoneOption(allOptions, value);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-label="Timezone"
        className={cn(
          "flex h-control w-full min-w-0 items-center gap-2 rounded-xl border border-border-5 bg-surface-0 px-2.75 text-left",
          "transition-[border-color,box-shadow] duration-(--dur-hover) ease-out outline-none",
          "hover:border-accent-200 focus-visible:border-accent-500 focus-visible:ring-3 focus-visible:ring-ring/25",
        )}
      >
        <span className="min-w-0 flex-1 truncate text-base font-medium text-text-2">
          {selected ? selected.label : value}
        </span>
        {selected?.offsetLabel ? (
          <span className="flex-none font-mono text-xs font-medium text-eyebrow">
            {selected.offsetLabel}
          </span>
        ) : null}
        <ChevronsUpDown
          aria-hidden
          className="size-3.5 flex-none text-faint"
          strokeWidth={1.8}
        />
      </PopoverTrigger>

      <PopoverContent className="w-(--anchor-width) min-w-72 p-0" align="start">
        <Command filter={substringFilter}>
          <CommandInput placeholder="Search city, country or zone…" />
          <CommandList>
            {isLoading ? (
              <div className="px-3 py-6 text-center text-sm text-meta">
                Loading timezones…
              </div>
            ) : (
              <>
                <CommandEmpty>No timezone matches that search.</CommandEmpty>
                {allOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.search}
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
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-heading">
                        {option.label}
                      </span>
                      <span className="block truncate text-xs font-medium text-eyebrow">
                        {option.region}
                      </span>
                    </span>
                    <span className="flex-none font-mono text-xs font-medium text-meta">
                      {option.offsetLabel}
                    </span>
                  </CommandItem>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TimeZoneCombobox;
