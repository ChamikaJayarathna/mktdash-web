import { cn } from "@/shared/lib/utils";
import type { MailboxScopeLevel, ScopeTone } from "../types/emailAccount.types";

export interface ScopeLevelCardProps {
  readonly level: MailboxScopeLevel;
  readonly scopeString: string;
  readonly isSelected: boolean;
  readonly isRecommended: boolean;
  readonly onSelect: (level: MailboxScopeLevel) => void;
}

const COST_CLASSES: Record<ScopeTone, string> = {
  warn: "text-danger-600",
  caution: "text-warning-700",
  ok: "text-text-6",
};

const TIER_CLASSES: Record<ScopeTone, string> = {
  warn: "bg-surface-6 text-text-5",
  caution: "bg-surface-6 text-text-5",
  ok: "bg-accent-050 text-accent-500",
};

const ScopeLevelCard = ({
  level,
  scopeString,
  isSelected,
  isRecommended,
  onSelect,
}: ScopeLevelCardProps) => {
  return (
    <label
      className={cn(
        "block cursor-pointer rounded-4xl border-[1.5px] px-3.75 py-3.5 transition-all duration-(--dur-hover) ease-out",
        "has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
        isSelected
          ? "border-accent-500 bg-accent-025 shadow-accent"
          : "border-border-card bg-card hover:border-accent-200",
      )}
    >
      <span className="flex items-start gap-2.75">
        <input
          type="radio"
          name="mailbox-scope"
          value={level.id}
          checked={isSelected}
          onChange={() => onSelect(level)}
          className="sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "mt-px size-4 flex-none rounded-pill border-[1.5px] transition-colors duration-(--dur-hover) ease-out",
            isSelected
              ? "border-accent-500 bg-accent-500 ring-3 ring-white ring-inset"
              : "border-border-7 bg-card",
          )}
        />

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-md font-extrabold text-heading">
              {level.name}
            </span>
            {isRecommended ? (
              <span className="flex-none rounded-pill bg-accent-500 px-2 py-0.5 text-3xs font-bold text-white">
                RECOMMENDED
              </span>
            ) : null}
            <span
              className={cn(
                "flex-none rounded-sm px-2 py-0.5 font-mono text-3xs font-semibold",
                TIER_CLASSES[level.tone],
              )}
            >
              {level.tier}
            </span>
          </span>

          <span className="mt-1.5 block text-sm leading-normal font-medium text-text-4">
            {level.gain}
          </span>
          <span
            className={cn(
              "mt-1 block text-sm leading-normal font-medium",
              COST_CLASSES[level.tone],
            )}
          >
            {level.cost}
          </span>
          <span className="mt-1.75 inline-block rounded-sm bg-canvas px-2 py-1 font-mono text-xs font-medium text-text-5">
            {scopeString}
          </span>
        </span>
      </span>
    </label>
  );
};

export default ScopeLevelCard;
