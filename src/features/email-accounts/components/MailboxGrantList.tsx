"use client";

import { UserPlus, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { initialsOf } from "../lib/emailAccountFormat";
import type {
  MailboxGrant,
  WorkspaceMember,
} from "../types/emailAccount.types";
import MailboxMemberPicker from "./MailboxMemberPicker";

export interface MailboxGrantListProps {
  readonly grants: readonly MailboxGrant[];
  readonly members: readonly WorkspaceMember[];
  readonly isLoadingMembers: boolean;
  readonly address: string;
  readonly onToggleSend: (membershipId: string, canSend: boolean) => void;
  readonly onAssignMember: (member: WorkspaceMember) => void;
  readonly onRemoveMember: (membershipId: string) => void;
}

const MailboxGrantList = ({
  grants,
  members,
  isLoadingMembers,
  address,
  onToggleSend,
  onAssignMember,
  onRemoveMember,
}: MailboxGrantListProps) => {
  const assignedIds = grants.map((grant) => grant.membershipId);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <p className="type-eyebrow text-eyebrow">
          {grants.filter((grant) => grant.canSend).length} of {grants.length}{" "}
          can send
        </p>

        <div className="ms-auto">
          <MailboxMemberPicker
            members={members}
            assignedMembershipIds={assignedIds}
            isLoading={isLoadingMembers}
            onToggleMember={(member, assigned) => {
              if (assigned) {
                onAssignMember(member);
                return;
              }

              onRemoveMember(member.membershipId);
            }}
          />
        </div>
      </div>

      {grants.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border-6 bg-surface-1 px-card py-6 text-center">
          <UserPlus
            aria-hidden
            className="size-5 text-accent-500"
            strokeWidth={1.7}
          />
          <p className="mt-2 text-sm font-bold text-heading">
            No one can send from this mailbox
          </p>
          <p className="mt-1 max-w-[30em] text-xs leading-normal text-meta">
            Add a member to grant them this address as a sending identity.
          </p>
        </div>
      ) : (
        <ul className="flex max-h-44 flex-col divide-y divide-border-1 overflow-y-auto rounded-2xl border border-border-2 bg-surface-1 px-card">
          {grants.map((grant) => (
            <li
              key={grant.membershipId}
              className="flex items-center gap-2.5 py-2.5"
            >
              <span
                aria-hidden
                className="grid size-7 flex-none place-items-center rounded-pill bg-accent-050 text-2xs font-extrabold text-accent-700"
              >
                {initialsOf(grant.name)}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-heading">
                  {grant.name}
                </p>
                <p className="truncate font-mono text-xs font-medium text-eyebrow">
                  {grant.email}
                </p>
              </div>

              <span className="flex-none rounded-sm bg-surface-6 px-1.75 py-0.5 text-3xs font-bold text-text-5">
                {grant.role}
              </span>

              <Switch
                size="sm"
                checked={grant.canSend}
                aria-label={`Let ${grant.name} send from ${address}`}
                onCheckedChange={(checked) =>
                  onToggleSend(grant.membershipId, checked)
                }
              />

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${grant.name} from ${address}`}
                onClick={() => onRemoveMember(grant.membershipId)}
              >
                <X className="size-3" aria-hidden strokeWidth={2.4} />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MailboxGrantList;
