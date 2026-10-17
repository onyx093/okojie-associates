import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-[color,background-color,border-color,box-shadow,opacity] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-brand-hover active:bg-[#3f51cf] shadow-sm",
        primary:
          "bg-primary text-white hover:bg-brand-hover active:bg-[#3f51cf] shadow-sm",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-sm",
        outline:
          "border border-border-strong bg-transparent text-white hover:bg-white/5 hover:border-white/40",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "bg-transparent text-body hover:text-white hover:bg-white/5",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 text-sm",
        pill: "h-11 px-6 text-sm",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7 text-base",
        compact: "h-9 px-4 text-xs font-medium",
        icon: "size-9 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
)

function Button({
  className,
  variant,
  size,
  fullWidth,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
