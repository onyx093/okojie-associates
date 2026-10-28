import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[96px] w-full resize-y rounded-control bg-sunken px-3.5 py-2.5 text-sm text-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-[background-color,box-shadow] duration-150 outline-none placeholder:text-fg-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:bg-card focus-visible:shadow-[inset_0_0_0_1.5px_var(--primary),0_0_0_4px_var(--brand-soft)] focus-visible:outline-none",
        "aria-invalid:bg-card aria-invalid:shadow-[inset_0_0_0_1.5px_var(--danger),0_0_0_4px_var(--danger-soft)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
