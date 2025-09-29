import * as React from "react";
import { cn } from "@/lib/utils";

type CommandProps = React.HTMLAttributes<HTMLDivElement>;

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative rounded-md border bg-background text-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Command.displayName = "Command";

export { Command };
