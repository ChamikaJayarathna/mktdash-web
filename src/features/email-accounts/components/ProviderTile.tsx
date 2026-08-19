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
  const isOAuth = provider.authMethod === "oauth";

  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-3xl border-[1.5px] px-2.75 py-2.5 transition-all duration-(--dur-hover) ease-out",
        "has-focus-visible:border-ring has-focus-visible:ring-3 has-focus-visible:ring-ring/40",
        isSelected
          ? "border-accent-500 bg-accent-025"
          : "border-border-card bg-card hover:border-accent-200",
      )}
    >
      <input
        type="radio"
        name="connect-provider"
        value={provider.id}
        checked={isSelected}
        onChange={() => onSelect(provider)}
        className="sr-only"
      />

      <span
        aria-hidden
        className={cn(
          "grid size-7.5 flex-none place-items-center rounded-2xl text-sm font-extrabold",
          providerToneClasses[provider.tone],
        )}
      >
        {provider.monogram}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-heading">
          {provider.name}
        </span>
        <span className="block truncate text-2xs font-medium text-eyebrow">
          {provider.sub}
        </span>
      </span>

      <span
        className={cn(
          "flex-none rounded-sm px-1.75 py-0.5 text-3xs font-bold",
          isOAuth
            ? "bg-success-050 text-success-600"
            : "bg-surface-6 text-text-5",
        )}
      >
        {isOAuth ? "OAuth" : "App password"}
      </span>
    </label>
  );
};

export default ProviderTile;
