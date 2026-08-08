import { cn } from "@/shared/lib/utils";
import type { SignUpStep } from "../types/signUp.types";

export interface SignUpStepIndicatorProps {
  readonly currentStep: SignUpStep;
}

const STEPS: readonly SignUpStep[] = [1, 2];

const SignUpStepIndicator = ({ currentStep }: SignUpStepIndicatorProps) => {
  return (
    <div className="flex items-center gap-2.25">
      <span
        aria-hidden
        className="flex size-5.5 flex-none items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
      >
        {STEPS[0]}
      </span>

      <span
        aria-hidden
        className="h-0.5 flex-1 overflow-hidden rounded-sm bg-border-2"
      >
        <span
          className={cn(
            "block h-full bg-primary transition-[width] duration-300 ease-out",
            currentStep === 2 ? "w-full" : "w-0",
          )}
        />
      </span>

      <span
        aria-hidden
        className={cn(
          "flex size-5.5 flex-none items-center justify-center rounded-full text-xs font-bold transition-colors duration-(--dur-hover) ease-out",
          currentStep === 2
            ? "bg-primary text-primary-foreground"
            : "bg-border-2 text-text-8",
        )}
      >
        {STEPS[1]}
      </span>

      <span className="type-eyebrow flex-none text-eyebrow">
        Step {currentStep} of {STEPS.length}
      </span>
    </div>
  );
};

export default SignUpStepIndicator;
