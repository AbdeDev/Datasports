import { cn } from "cn";
import type { ComponentProps } from "react";

function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: callers always pass htmlFor + a matching input id
    <label
      data-slot="label"
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    />
  );
}

export { Label };
