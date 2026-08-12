import { cn } from "@/shared/lib/utils";
import type { SendingAccountProvider } from "../types/emailComposer.types";

export interface SendingAccountSwatchProps {
  readonly provider: SendingAccountProvider;
  readonly className?: string;
}

const PROVIDER_MONOGRAM: Record<SendingAccountProvider, string> = {
  gmail: "G",
  outlook: "O",
  imap: "IM",
};

const PROVIDER_TONE: Record<SendingAccountProvider, string> = {
  gmail: "bg-danger-050 text-danger-600",
  outlook: "bg-accent-050 text-accent-700",
  imap: "bg-surface-6 text-text-5",
};

const SendingAccountSwatch = ({
  provider,
  className,
}: SendingAccountSwatchProps) => {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-5 flex-none place-items-center rounded-md font-sans text-3xs font-bold",
        PROVIDER_TONE[provider],
        className,
      )}
    >
      {PROVIDER_MONOGRAM[provider]}
    </span>
  );
};

export default SendingAccountSwatch;
