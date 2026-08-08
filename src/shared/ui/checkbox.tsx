"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4.25 shrink-0 items-center justify-center rounded-sm border-[1.5px] border-border-6 bg-surface-0 transition-[background-color,border-color,box-shadow] duration-(--dur-hover) ease-out outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "hover:border-accent-200",
        "focus-visible:border-accent-500 focus-visible:ring-3 focus-visible:ring-ring/25",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "aria-invalid:border-danger-600 aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current [&>svg]:size-2.75 [&>svg]:stroke-3"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
