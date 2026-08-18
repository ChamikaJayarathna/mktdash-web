import { cn } from "@/shared/lib/utils";
import { providerToneClasses } from "../lib/emailAccountFormat";
import type { EmailProvider } from "../types/emailAccount.types";

export interface ProviderTileProps {
  readonly provider: EmailProvider;
  readonly isSelected: boolean;
  readonly onSelect: (provider: EmailProvider) => void;
}

const ProviderTile = ({
  provider,
  isSelected,
  onSelect,
}: ProviderTileProps) => {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-3xl border-[1.5px] px-3 py-2.75 transition-all duration-(--dur-hover) ease-out",
        "has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
        isSelected
          ? "border-accent-500 bg-accent-025 shadow-accent"
          : "border-border-card bg-card hover:border-accent-200",
      )}
    >
      <input
        type="radio"
        name="email-provider"
        value={provider.id}
        checked={isSelected}
        onChange={() => onSelect(provider)}
        className="sr-only"
      />

      <span
        aria-hidden
        className={cn(
          "grid size-8 flex-none place-items-center rounded-2xl text-base font-extrabold",
          providerToneClasses[provider.tone],
        )}
      >
        {provider.monogram}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-heading">
          {provider.name}
        </span>
        <span className="block truncate text-xs font-medium text-meta">
          {provider.sub}
        </span>
      </span>

      <span
        aria-hidden
        className={cn(
          "size-3.75 flex-none rounded-pill border-[1.5px] transition-colors duration-(--dur-hover) ease-out",
          isSelected
            ? "border-accent-500 bg-accent-500 ring-3 ring-white ring-inset"
            : "border-border-7 bg-card",
        )}
      />
    </label>
  );
};

export default ProviderTile;
