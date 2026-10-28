import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-[42px] w-full min-w-0 rounded-control bg-sunken px-3.5 py-2 text-sm text-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[background-color,box-shadow] duration-150 outline-none placeholder:text-fg-3 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1.5px_var(--primary),0_0_0_4px_var(--brand-soft)] focus-visible:outline-none",
        "aria-invalid:bg-card aria-invalid:shadow-[inset_0_0_0_1.5px_var(--danger),0_0_0_4px_var(--danger-soft)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
