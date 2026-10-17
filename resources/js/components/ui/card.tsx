import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-[18px] border border-border p-7 md:p-8 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] duration-150 hover:border-border-strong",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-xl md:text-[22px] leading-tight font-semibold text-foreground tracking-[-0.02em]", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm leading-relaxed", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center pt-2", className)}
      {...props}
    />
  )
}

function CardBestFor({ className, label = "Best for:", children, ...props }: React.ComponentProps<"div"> & { label?: string }) {
  return (
    <div
      data-slot="card-best-for"
      className={cn(
        "rounded-[12px] bg-secondary p-3.5 text-[13px] leading-relaxed text-body border border-border/50",
        className
      )}
      {...props}
    >
      <span className="font-semibold text-foreground mr-1.5">{label}</span>
      {children}
    </div>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardBestFor,
}
