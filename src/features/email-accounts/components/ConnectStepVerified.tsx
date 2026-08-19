import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ConnectVerificationStep } from "../types/emailAccount.types";

export interface ConnectStepVerifiedProps {
  readonly address: string;
  readonly steps: readonly ConnectVerificationStep[];
}

const ConnectStepVerified = ({ address, steps }: ConnectStepVerifiedProps) => {
  return (
    <div>
      <div className="flex items-center gap-2.75">
        <span
          aria-hidden
          className="grid size-control flex-none place-items-center rounded-3xl bg-success-050 text-success-600"
        >
          <Check className="size-4" strokeWidth={2.6} />
        </span>
        <div className="min-w-0">
          <h3 className="text-xl leading-tight font-extrabold tracking-snug text-heading">
            Connected
          </h3>
          <p className="mt-0.75 truncate font-mono text-base font-medium text-meta">
            {address}
          </p>
        </div>
      </div>

      <ul className="mt-4 rounded-4xl border border-border-card bg-surface-1 px-3.75">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className={cn(
              "flex items-start gap-2.75 py-2.75",
              index < steps.length - 1 && "border-b border-border-1",
            )}
          >
            <span
              aria-hidden
              className="grid size-4.75 flex-none place-items-center rounded-pill bg-success-050 text-success-600"
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-heading">{step.label}</p>
              <p className="mt-0.5 text-xs leading-normal font-medium text-meta">
                {step.note}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3.5 rounded-3xl border border-accent-100 bg-accent-025 px-3.75 py-3.25 text-sm leading-normal font-medium text-accent-400">
        Nothing sends from this mailbox until you publish a sequence or press
        Send. For cold outreach, use a domain kept separate from the one your
        company runs on.
      </p>
    </div>
  );
};

export default ConnectStepVerified;
