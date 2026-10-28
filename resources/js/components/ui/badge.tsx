import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex h-[22px] w-fit shrink-0 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-medium whitespace-nowrap transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "bg-brand-soft text-brand",
        accent:
          "bg-brand-soft text-brand",
        secondary:
          "bg-sunken text-fg-2 shadow-[inset_0_0_0_1px_var(--border)]",
        neutral:
          "bg-sunken text-fg-2 shadow-[inset_0_0_0_1px_var(--border)]",
        muted:
          "bg-sunken text-fg-2 shadow-[inset_0_0_0_1px_var(--border)]",
        outline:
          "bg-card text-fg-2 shadow-[inset_0_0_0_1px_var(--border)]",
        success:
          "bg-success-soft text-success",
        warning:
          "bg-warning-soft text-warning",
        danger:
          "bg-danger-soft text-danger",
        destructive:
          "bg-danger-soft text-danger",
        hero:
          "h-auto bg-brand-soft px-3 py-1 text-xs font-medium text-brand shadow-chip",
        portalTier:
          "bg-sunken text-fg-2 shadow-[inset_0_0_0_1px_var(--border)]",
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
  dot = false,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    dot?: boolean
  }) {
  const Comp = asChild ? Slot : "span"

  if (asChild) {
    return (
      <Comp
        data-slot="badge"
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {dot && (
        <span
          className="size-1.5 shrink-0 rounded-full bg-current"
          aria-hidden="true"
        />
      )}
      {children}
    </Comp>
  )
}

export { Badge, badgeVariants }
