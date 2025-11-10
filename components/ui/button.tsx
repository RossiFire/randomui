import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "px-4 py-2 w-fit rounded-md transition-all duration-150 outline-none text-sm cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-fd-primary text-fd-primary-foreground px-4 py-2 rounded-md hover:bg-fd-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
        secondary: "bg-fd-accent cursor-pointer text-fd-accent-foreground hover:bg-fd-accent/70 hover:shadow-md hover:shadow-fd-accent/50 active:scale-95 focus-visible:ring-2 focus-visible:ring-fd-accent-foreground/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        ghost: "hover:bg-fd-accent hover:text-fd-accent-foreground dark:hover:bg-fd-accent/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

function Button({
  className,
  asChild = false,
  variant = "primary",
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost"
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}

      {...props}
    />
  );
}

export { Button };
