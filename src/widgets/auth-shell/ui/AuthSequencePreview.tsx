import { Clock, Flag, Send, type LucideIcon } from "lucide-react";

interface AuthSequenceStep {
  readonly id: string;
  readonly kicker: string;
  readonly title: string;
  readonly icon: LucideIcon;
  readonly cardClassName: string;
  readonly badgeClassName: string;
  readonly kickerClassName: string;
}

const STEPS: readonly AuthSequenceStep[] = [
  {
    id: "send",
    kicker: "Send",
    title: "Q3 partnership intro",
    icon: Send,
    cardClassName: "border-on-dark-hairline bg-on-dark-fill",
    badgeClassName: "bg-on-dark-tint-accent text-on-dark-accent",
    kickerClassName: "text-on-dark-accent",
  },
  {
    id: "wait",
    kicker: "Wait",
    title: "3 business days",
    icon: Clock,
    cardClassName: "border-on-dark-hairline bg-on-dark-fill",
    badgeClassName: "bg-on-dark-tint-violet text-on-dark-violet",
    kickerClassName: "text-on-dark-violet",
  },
  {
    id: "goal",
    kicker: "Goal",
    title: "Reply received — sequence stops",
    icon: Flag,
    cardClassName: "border-on-dark-hairline-success bg-on-dark-fill-success",
    badgeClassName: "bg-on-dark-tint-success text-on-dark-success",
    kickerClassName: "text-on-dark-success",
  },
];

const AuthSequencePreview = () => {
  return (
    <ul className="flex list-none flex-col items-start gap-0">
      {STEPS?.map((step, index) => (
        <li key={step?.id} className="contents">
          {index > 0 ? (
            <span
              aria-hidden
              className="ml-5.75 block h-3.25 w-0.5 bg-on-dark-hairline"
            />
          ) : null}
          <div
            className={`flex w-full max-w-72.5 items-center gap-2.75 rounded-4xl border-[1.5px] px-3.5 py-2.75 ${step.cardClassName}`}
          >
            <span
              aria-hidden
              className={`flex size-6.5 flex-none items-center justify-center rounded-xl ${step.badgeClassName}`}
            >
              <step.icon className="size-3.25" strokeWidth={2} />
            </span>
            <span className="min-w-0">
              <span
                className={`block font-mono text-3xs leading-flat font-bold tracking-widest uppercase ${step?.kickerClassName}`}
              >
                {step?.kicker}
              </span>
              <span className="mt-0.75 block text-base font-bold text-on-dark">
                {step?.title}
              </span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AuthSequencePreview;
