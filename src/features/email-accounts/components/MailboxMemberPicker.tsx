"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { memberSearchValue, substringFilter } from "../lib/commandFilter";
import { initialsOf } from "../lib/emailAccountFormat";
import type { WorkspaceMember } from "../types/emailAccount.types";

export interface MailboxMemberPickerProps {
  readonly members: readonly WorkspaceMember[];
  readonly assignedMembershipIds: readonly string[];
  readonly isLoading: boolean;
  readonly onToggleMember: (member: WorkspaceMember, assigned: boolean) => void;
}

const MailboxMemberPicker = ({
  members,
  assignedMembershipIds,
  isLoading,
  onToggleMember,
}: MailboxMemberPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger
        render={<Button type="button" variant="outline" size="sm" />}
        aria-label="Add member"
      >
        <Plus className="size-3.25" aria-hidden strokeWidth={2.4} />
        Add member
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0" align="end">
        <Command filter={substringFilter}>
          <CommandInput placeholder="Search name, email or role…" />
          <CommandList>
            {isLoading ? (
              <div className="px-3 py-6 text-center text-sm text-meta">
                Loading members…
              </div>
            ) : (
              <>
                <CommandEmpty>
                  No one in this organisation matches.
                </CommandEmpty>
                {members.map((member) => {
                  const isAssigned = assignedMembershipIds.includes(
                    member.membershipId,
                  );

                  return (
                    <CommandItem
                      key={member.membershipId}
                      value={memberSearchValue(
                        member.name,
                        member.email,
                        member.role,
                      )}
                      onSelect={() => onToggleMember(member, !isAssigned)}
                      className="gap-2.5"
                    >
                      <Check
                        aria-hidden
                        className={cn(
                          "size-3.5 flex-none text-accent-500",
                          isAssigned ? "opacity-100" : "opacity-0",
                        )}
                        strokeWidth={2.4}
                      />
                      <span
                        aria-hidden
                        className="grid size-6 flex-none place-items-center rounded-pill bg-accent-050 text-3xs font-extrabold text-accent-700"
                      >
                        {initialsOf(member.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-heading">
                          {member.name}
                        </span>
                        <span className="block truncate font-mono text-xs font-medium text-eyebrow">
                          {member.email}
                        </span>
                      </span>
                    </CommandItem>
                  );
                })}
              </>
            )}
          </CommandList>
        </Command>

        <p className="border-t border-border-2 px-3 py-2 text-xs leading-normal text-meta">
          Only members of this organisation can be granted a mailbox.
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default MailboxMemberPicker;
