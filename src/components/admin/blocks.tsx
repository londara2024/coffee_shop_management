import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: React.ReactNode
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-1 font-serif text-headline-lg-sm text-ink md:text-headline-lg">{title}</h1>
        {description ? <p className="mt-2 text-body-md text-ink-soft">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}

export function Panel({
  className,
  children,
  tone = "oat",
}: {
  className?: string
  children: React.ReactNode
  tone?: "oat" | "white" | "dark"
}) {
  return (
    <section
      className={cn(
        "rounded-3xl p-4 ring-1 ring-espresso/5 sm:p-6",
        tone === "oat" && "bg-oat-light",
        tone === "white" && "bg-white shadow-warm",
        tone === "dark" && "bg-espresso text-milk",
        className
      )}
    >
      {children}
    </section>
  )
}

export function PanelTitle({
  eyebrow,
  title,
  aside,
  description,
}: {
  eyebrow?: string
  title: string
  aside?: React.ReactNode
  description?: string
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-0.5 font-serif text-headline-sm text-ink">{title}</h2>
        {description ? <p className="mt-1 text-body-sm text-ink-soft">{description}</p> : null}
      </div>
      {aside}
    </div>
  )
}

export function StatCard({
  label,
  icon: Icon,
  value,
  unit,
  foot,
  accent,
  className,
}: {
  label: string
  icon: LucideIcon
  value: string
  unit?: string
  foot?: React.ReactNode
  accent?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 rounded-3xl p-5 ring-1 ring-espresso/5",
        accent ? "bg-gradient-to-br from-oat-light to-amber-soft/50" : "bg-oat-light",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-label-md font-semibold tracking-wider text-ink-soft uppercase">{label}</span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-oat-deep text-amber">
          <Icon className="size-4" />
        </span>
      </div>
      <div>
        <p className="flex items-baseline gap-2">
          <span className="font-serif text-headline-lg-sm text-ink tabular md:text-headline-lg">{value}</span>
          {unit ? <span className="text-body-md text-ink-soft">{unit}</span> : null}
        </p>
        {foot ? <div className="mt-1 text-label-md text-ink-soft">{foot}</div> : null}
      </div>
    </div>
  )
}

/** Thin progress meter; tone follows status (amber = normal load, danger = critical, forest = healthy). */
export function Meter({ value, tone = "amber", className }: { value: number; tone?: "amber" | "danger" | "forest" | "glow"; className?: string }) {
  return (
    <div className={cn("h-1.5 overflow-hidden rounded-full bg-oat-deeper", className)} role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn(
          "h-full rounded-full",
          tone === "amber" && "bg-amber",
          tone === "danger" && "bg-danger",
          tone === "forest" && "bg-forest",
          tone === "glow" && "bg-amber-glow"
        )}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  )
}
