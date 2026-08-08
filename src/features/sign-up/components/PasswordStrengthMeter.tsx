import { cn } from "@/shared/lib/utils";
import type {
  PasswordStrength,
  PasswordStrengthTone,
} from "../types/signUp.types";

export interface PasswordStrengthMeterProps {
  readonly strength: PasswordStrength;
  readonly characterCount: number;
  readonly labelId: string;
}

const METER_SEGMENTS = [1, 2, 3, 4] as const;

const TONE_BAR_CLASS: Record<PasswordStrengthTone, string> = {
  neutral: "bg-border-2",
  danger: "bg-danger-600",
  warning: "bg-warning-700",
  success: "bg-success-600",
};

const TONE_TEXT_CLASS: Record<PasswordStrengthTone, string> = {
  neutral: "text-text-8",
  danger: "text-danger-600",
  warning: "text-warning-700",
  success: "text-success-600",
};

const PasswordStrengthMeter = ({
  strength,
  characterCount,
  labelId,
}: PasswordStrengthMeterProps) => {
  return (
    <div>
      <div aria-hidden className="flex items-center gap-1">
        {METER_SEGMENTS?.map((segment) => (
          <span
            key={segment}
            className={cn(
              "h-1 flex-1 rounded-sm transition-colors duration-(--dur-panel) ease-out",
              strength?.score >= segment
                ? TONE_BAR_CLASS[strength.tone]
                : "bg-border-2",
            )}
          />
        ))}
      </div>

      <div className="mt-1.75 flex items-baseline justify-between gap-2.5">
        <span
          id={labelId}
          aria-live="polite"
          className={cn(
            "text-xs font-bold",
            TONE_TEXT_CLASS[strength?.tone ?? "neutral"],
          )}
        >
          {strength?.label}
        </span>
        {characterCount > 0 ? (
          <span className="font-mono text-xs font-medium text-text-8">
            {characterCount} {characterCount === 1 ? "character" : "characters"}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
