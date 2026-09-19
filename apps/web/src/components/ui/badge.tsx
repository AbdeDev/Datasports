import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1 border px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border bg-transparent text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        success: "border-transparent bg-emerald-500/15 text-emerald-400",
        warning: "border-transparent bg-amber-500/15 text-amber-400",
        destructive: "border-transparent bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
