import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-1.75 border-[1.5px] border-transparent bg-clip-padding font-bold whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-(--dur-hover) ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-45 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:[stroke-width:1.8] [&_svg:not([class*='size-'])]:size-3.75",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-accent hover:bg-accent-600 hover:shadow-accent-hover active:not-aria-[haspopup]:translate-y-px",
        solid:
          "bg-solid text-on-solid hover:bg-solid-hover active:not-aria-[haspopup]:translate-y-px",
        outline:
          "border-border-5 bg-surface-0 text-text-5 hover:border-accent-200 hover:text-text-3 aria-expanded:border-accent-200 aria-expanded:bg-surface-2",
        secondary:
          "bg-surface-6 text-text-5 hover:bg-surface-5 hover:text-text-3 aria-expanded:bg-surface-5",
        tinted:
          "border-accent-150 bg-accent-025 text-accent-700 hover:border-accent-200 hover:bg-accent-050",
        dashed:
          "border-dashed border-accent-200 bg-accent-025 text-accent-500 hover:border-accent-500 hover:bg-accent-050",
        ghost:
          "text-text-5 hover:bg-surface-5 hover:text-text-3 aria-expanded:bg-surface-5",
        destructive:
          "border-danger-100 bg-surface-0 text-danger-600 hover:bg-danger-050 focus-visible:border-danger-600 focus-visible:ring-destructive/20",
        link: "text-accent-500 underline-offset-4 hover:text-accent-700 hover:underline",
      },
      size: {
        default: "h-control rounded-xl px-3.25 text-sm",
        xs: "h-6 rounded-md px-2 text-2xs",
        sm: "h-control-sm rounded-lg px-2.5 text-xs",
        lg: "h-9 rounded-2xl px-5 text-base",
        icon: "size-control rounded-xl",
        "icon-xs": "size-6 rounded-md",
        "icon-sm": "size-control-sm rounded-lg",
        "icon-lg": "size-9 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
