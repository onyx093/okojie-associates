import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-btn text-sm font-medium transition-[background-color,box-shadow,color,transform,opacity] duration-150 ease-snap outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[18px]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-btn hov:bg-brand-hover",
        primary:
          "bg-primary text-primary-foreground shadow-btn hov:bg-brand-hover",
        secondary:
          "bg-card text-foreground shadow-chip hov:bg-sunken",
        outline:
          "bg-card text-foreground shadow-chip hov:bg-sunken",
        ghost:
          "bg-transparent text-fg-2 hov:bg-sunken hov:text-foreground",
        danger:
          "bg-danger-soft text-danger shadow-[inset_0_0_0_1px_rgb(185_50_42/0.22)] hov:opacity-90",
        destructive:
          "bg-danger-soft text-danger shadow-[inset_0_0_0_1px_rgb(185_50_42/0.22)] hov:opacity-90",
        "danger-ghost":
          "bg-transparent text-danger hov:bg-danger-soft",
        link:
          "text-brand underline-offset-4 hov:underline active:scale-100",
      },
      size: {
        default: "h-10 rounded-btn px-4 text-sm",
        md: "h-10 rounded-btn px-4 text-sm",
        pill: "h-10 rounded-btn px-4 text-sm",
        sm: "h-9 rounded-[10px] px-3.5 text-[13px]",
        compact: "h-9 rounded-[10px] px-3.5 text-[13px]",
        xs: "h-8 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-[15px]",
        lg: "h-11 rounded-btn px-5 text-sm",
        xl: "h-[46px] rounded-btn px-5 text-[15px]",
        icon: "size-10 rounded-btn p-0 active:scale-[0.95]",
        "icon-sm": "size-8 rounded-lg p-0 active:scale-[0.95] [&_svg:not([class*='size-'])]:size-[15px]",
        "icon-xs": "size-7 rounded-md p-0 active:scale-[0.95] [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-11 rounded-btn p-0 active:scale-[0.95]",
      },
      block: {
        true: "w-full",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      block: false,
      fullWidth: false,
    },
  }
)

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
    loading?: boolean
  }

function Button({
  className,
  variant = "default",
  size = "default",
  block,
  fullWidth,
  asChild = false,
  iconLeft,
  iconRight,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const isBlock = Boolean(block || fullWidth)

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          buttonVariants({ variant, size, block: isBlock }),
          iconLeft && "pl-[13px]",
          iconRight && "pr-[13px]",
          className
        )}
        {...props}
      >
        {children}
      </Comp>
    )
  }

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        buttonVariants({ variant, size, block: isBlock }),
        iconLeft && "pl-[13px]",
        iconRight && "pr-[13px]",
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        iconLeft
      )}
      {children}
      {!loading && iconRight}
    </Comp>
  )
}

export { Button, buttonVariants }
