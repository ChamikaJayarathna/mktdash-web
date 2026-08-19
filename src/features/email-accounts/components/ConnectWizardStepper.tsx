import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { ConnectWizardStep } from "../hooks/useConnectMailboxWizard";

export interface ConnectWizardStepperProps {
  readonly currentStep: ConnectWizardStep;
}

const STEPS: readonly {
  readonly step: ConnectWizardStep;
  readonly label: string;
}[] = [
  { step: 1, label: "Mailbox" },
  { step: 2, label: "Authorise" },
  { step: 3, label: "Verify" },
];

const ConnectWizardStepper = ({ currentStep }: ConnectWizardStepperProps) => {
  return (
    <ol className="ms-auto flex flex-wrap items-center gap-3.5">
      {STEPS.map(({ step, label }) => {
        const isDone = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <li
            key={step}
            aria-current={isCurrent ? "step" : undefined}
            className="flex flex-none items-center gap-1.75"
          >
            <span
              aria-hidden
              className={cn(
                "grid size-5 flex-none place-items-center rounded-pill text-2xs font-extrabold",
                isDone && "bg-success-600 text-white",
                isCurrent && "bg-accent-500 text-white",
                !isDone && !isCurrent && "bg-surface-6 text-eyebrow",
              )}
            >
              {isDone ? <Check className="size-2.5" strokeWidth={3} /> : step}
            </span>
            <span
              className={cn(
                "text-sm font-bold whitespace-nowrap",
                step <= currentStep ? "text-heading" : "text-eyebrow",
              )}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default ConnectWizardStepper;
