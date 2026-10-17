import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-white shadow-xs",
        secondary:
          "border-border bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-white shadow-xs",
        outline:
          "border-border text-foreground",
        hero:
          "border-primary/30 bg-primary/15 text-primary text-[13px] px-3.5 py-1 font-medium",
        portalTier:
          "border-border bg-card text-muted-foreground text-xs px-2.5 py-0.5 font-medium",
        warning:
          "border-warning/30 bg-warning/15 text-warning text-xs px-2.5 py-0.5 font-medium",
        success:
          "border-success/30 bg-success/15 text-success text-xs px-2.5 py-0.5 font-medium",
        accent:
          "border-primary/30 bg-primary/15 text-primary text-xs px-2.5 py-0.5 font-medium",
        muted:
          "border-border bg-secondary text-muted-foreground text-xs px-2.5 py-0.5 font-medium",
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
