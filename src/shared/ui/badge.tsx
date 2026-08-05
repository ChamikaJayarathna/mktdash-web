import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { XIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1.25 rounded-pill border border-transparent font-bold whitespace-nowrap transition-colors duration-(--dur-hover) ease-out focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3! [&>svg]:[stroke-width:1.8]",
  {
    variants: {
      variant: {
        default: "bg-surface-6 text-text-5",
        neutral: "bg-surface-6 text-text-5",
        accent: "bg-accent-050 text-accent-500",
        success: "bg-success-050 text-success-600",
        warning: "bg-warning-050 text-warning-700",
        danger: "bg-danger-050 text-danger-600",
        violet: "bg-cat-violet-050 text-cat-violet-600",
        teal: "bg-cat-teal-050 text-cat-teal-600",
        orange: "bg-cat-orange-050 text-cat-orange-600",
        locked: "bg-warning-100 text-warning-700",
        outline: "border-border-5 bg-surface-0 text-text-5",
        secondary: "bg-surface-6 text-text-5",
        destructive: "bg-danger-050 text-danger-600",
      },
      size: {
        xs: "px-1.5 py-px text-3xs",
        sm: "px-2 py-0.5 text-2xs",
        md: "px-2.5 py-0.75 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  },
);

type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean;
    onDismiss?: () => void;
    dismissLabel?: string;
  };

function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  onDismiss,
  dismissLabel = "Remove",
  children,
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant, size }), className),
        children: (
          <>
            {dot ? (
              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-xs bg-current"
              />
            ) : null}
            {children}
            {onDismiss ? (
              <button
                type="button"
                onClick={onDismiss}
                aria-label={dismissLabel}
                className="-mr-0.5 ml-px grid size-3.5 shrink-0 cursor-pointer place-items-center rounded-pill text-current opacity-60 transition-opacity duration-(--dur-hover) ease-out hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                <XIcon className="size-2.5" strokeWidth={2.2} aria-hidden />
              </button>
            ) : null}
          </>
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
export type { BadgeProps };
