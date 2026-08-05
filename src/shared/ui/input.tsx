import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/shared/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-control w-full min-w-0 rounded-xl border border-border-5 bg-surface-0 px-2.75 py-1 text-base text-text-2 transition-[border-color,box-shadow] duration-(--dur-hover) ease-out outline-none",
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-bold file:text-text-3",
        "placeholder:text-text-9",
        "hover:border-accent-200",
        "focus-visible:border-accent-500 focus-visible:ring-3 focus-visible:ring-ring/25",
        "disabled:cursor-not-allowed disabled:bg-surface-3 disabled:opacity-45",
        "aria-invalid:border-danger-600 aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
