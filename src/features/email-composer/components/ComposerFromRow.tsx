"use client";

import { ChevronDown, CircleAlert, Lock } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import type { SendingAccount } from "../types/emailComposer.types";
import SendingAccountSwatch from "./SendingAccountSwatch";

export interface ComposerFromRowProps {
  readonly accounts: readonly SendingAccount[];
  readonly selectedAccount: SendingAccount | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly onRetry: () => void;
  readonly onSelect: (accountId: string) => void;
}

const capPercent = (account: SendingAccount): number =>
  account.dailyCap === 0
    ? 0
    : Math.min(Math.round((account.sentToday / account.dailyCap) * 100), 100);

const ComposerFromRow = ({
  accounts,
  selectedAccount,
  isLoading,
  isError,
  onRetry,
  onSelect,
}: ComposerFromRowProps) => {
  const grantedAccounts = accounts.filter((account) => account.isGranted);
  const lockedCount = accounts.length - grantedAccounts.length;

  return (
    <div className="flex-none border-b border-accent-100 bg-panel px-panel py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="w-9 flex-none type-eyebrow text-accent-300">From</span>

        {isLoading ? (
          <div
            role="status"
            aria-label="Loading mailboxes"
            className="h-control flex-1 animate-pulse rounded-2xl bg-accent-100"
          />
        ) : null}

        {!isLoading && isError ? (
          <div className="flex flex-1 items-center gap-2">
            <CircleAlert
              aria-hidden
              className="size-3.5 flex-none text-danger-600"
              strokeWidth={2}
            />
            <p className="min-w-0 flex-1 text-sm font-medium text-danger-600">
              Could not load your mailboxes — nothing can send until this
              resolves.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Retry
            </Button>
          </div>
        ) : null}

        {!isLoading && !isError && accounts.length === 0 ? (
          <p className="flex-1 text-sm font-medium text-warning-700">
            No mailbox is connected to this workspace yet, so nothing can be
            sent.
          </p>
        ) : null}

        {!isLoading && !isError && accounts.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-control min-w-0 flex-1 justify-start gap-2.25 rounded-2xl border-accent-500 bg-card px-2.75 shadow-raised"
                  aria-label={
                    selectedAccount
                      ? `Sending from ${selectedAccount.address}. Change mailbox`
                      : "Choose the mailbox this leaves from"
                  }
                />
              }
            >
              {selectedAccount ? (
                <>
                  <SendingAccountSwatch provider={selectedAccount.provider} />
                  <span className="min-w-0 truncate font-mono text-base font-bold text-heading">
                    {selectedAccount.address}
                  </span>
                  <Badge size="xs" variant="neutral" className="hidden sm:flex">
                    {selectedAccount.kind}
                  </Badge>
                </>
              ) : (
                <span className="text-base font-bold text-text-5">
                  Choose a mailbox
                </span>
              )}
              <ChevronDown
                aria-hidden
                className="ml-auto size-3 flex-none text-meta"
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={6}
              className="w-(--anchor-width) min-w-72 rounded-3xl p-1.5 shadow-popover"
            >
              <DropdownMenuLabel className="px-2.5 pt-1 pb-2 type-eyebrow text-eyebrow">
                Accounts you can send from · {grantedAccounts.length}
              </DropdownMenuLabel>

              <DropdownMenuRadioGroup
                value={selectedAccount?.id ?? ""}
                onValueChange={(value) => onSelect(String(value))}
                className="flex flex-col gap-px"
              >
                {accounts.map((account) => (
                  <DropdownMenuRadioItem
                    key={account.id}
                    value={account.id}
                    disabled={!account.isGranted}
                    closeOnClick
                    className="gap-2.5 rounded-lg py-2 pr-8 pl-2.5 focus:bg-row-hover"
                  >
                    <SendingAccountSwatch provider={account.provider} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-sm font-semibold text-heading">
                        {account.address}
                      </span>
                      <span className="mt-px block truncate text-xs font-medium text-eyebrow">
                        {account.kind} · {account.sentToday} of{" "}
                        {account.dailyCap} sends today
                      </span>
                    </span>
                    {account.isGranted ? null : (
                      <Lock
                        aria-hidden
                        className="size-3 flex-none text-faint"
                        strokeWidth={2}
                      />
                    )}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>

              {lockedCount > 0 ? (
                <p className="mt-1.5 border-t border-dashed border-border-5 px-2.5 pt-2 text-xs font-medium text-eyebrow">
                  {lockedCount} more mailbox
                  {lockedCount === 1 ? "" : "es"} in this workspace — not
                  granted to you.
                </p>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      {selectedAccount ? (
        <div className="mt-2 flex items-center gap-2.5">
          <span aria-hidden className="w-9 flex-none" />
          <div
            role="progressbar"
            aria-label={`Daily sending cap for ${selectedAccount.address}`}
            aria-valuemin={0}
            aria-valuemax={selectedAccount.dailyCap}
            aria-valuenow={selectedAccount.sentToday}
            className="h-1 min-w-0 flex-1 overflow-hidden rounded-sm bg-accent-100"
          >
            <div
              className="h-full rounded-sm bg-accent-500"
              style={{ width: `${capPercent(selectedAccount)}%` }}
            />
          </div>
          <span className="flex-none font-mono text-xs font-medium text-accent-300">
            {selectedAccount.sentToday} of {selectedAccount.dailyCap} sends
            today
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default ComposerFromRow;
