"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, CircleAlert, OctagonX } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import type {
  DeliverabilityReport,
  DeliverabilitySeverity,
} from "../types/emailComposer.types";

export interface ComposerChecksProps {
  readonly report: DeliverabilityReport;
}

const SEVERITY_ICON = {
  pass: CheckCircle2,
  warning: CircleAlert,
  blocker: OctagonX,
} as const;

const SEVERITY_TONE: Record<DeliverabilitySeverity, string> = {
  pass: "text-success-600",
  warning: "text-warning-700",
  blocker: "text-danger-600",
};

const ComposerChecks = ({ report }: ComposerChecksProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const flagged = [...report.blockers, ...report.warnings];

  return (
    <section
      aria-label="Pre-send checks"
      className="flex-none border-t border-border-2 bg-surface-1 px-panel py-1.75"
    >
      <button
        type="button"
        onClick={() => setIsExpanded((expanded) => !expanded)}
        aria-expanded={isExpanded}
        className="flex w-full items-center gap-1.75 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Badge size="sm" variant="success" dot>
          {report.passedCount} pre-send check
          {report.passedCount === 1 ? "" : "s"} passed
        </Badge>

        {report.warnings.length > 0 ? (
          <Badge size="sm" variant="warning">
            {report.warnings.length} warning
            {report.warnings.length === 1 ? "" : "s"}
          </Badge>
        ) : null}

        {report.blockers.length > 0 ? (
          <Badge size="sm" variant="danger">
            {report.blockers.length} blocking
          </Badge>
        ) : null}

        {flagged.length > 0 ? (
          <ChevronDown
            aria-hidden
            className={cn(
              "ml-auto size-3.5 flex-none text-meta transition-transform duration-(--dur-hover) ease-out",
              isExpanded && "rotate-180",
            )}
          />
        ) : null}
      </button>

      {isExpanded && flagged.length > 0 ? (
        <ul className="mt-2 flex animate-fa-in flex-col gap-1.5">
          {flagged.map((check) => {
            const Icon = SEVERITY_ICON[check.severity];

            return (
              <li key={check.id} className="flex items-start gap-2">
                <Icon
                  aria-hidden
                  className={cn(
                    "mt-px size-3.5 flex-none",
                    SEVERITY_TONE[check.severity],
                  )}
                  strokeWidth={2}
                />
                <p className="min-w-0 text-xs leading-normal text-body">
                  <span className="font-bold text-heading">{check.label}</span>
                  {" — "}
                  {check.detail}
                </p>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
};

export default ComposerChecks;
