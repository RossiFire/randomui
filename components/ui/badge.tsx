import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-fd-ring/50 focus-visible:ring-[3px] aria-invalid:ring-fd-destructive/20 dark:aria-invalid:ring-fd-destructive/40 aria-invalid:border-fd-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-fd-primary text-fd-primary-foreground [a&]:hover:bg-fd-primary/90",
        secondary:
          "border-transparent bg-fd-secondary text-fd-secondary-foreground [a&]:hover:bg-fd-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-fd-destructive/90 focus-visible:ring-fd-destructive/20 dark:focus-visible:ring-fd-destructive/40 dark:bg-fd-destructive/60",
        outline:
          "text-fd-foreground [a&]:hover:bg-fd-accent [a&]:hover:text-fd-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
