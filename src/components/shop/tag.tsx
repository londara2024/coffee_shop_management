import { Badge } from "@/components/ui/badge"
import type { Tone } from "@/lib/data"
import { cn } from "@/lib/utils"

const tones: Record<Tone, string> = {
  forest: "bg-forest-soft text-forest",
  amber: "bg-amber-soft/70 text-amber",
  neutral: "bg-oat-deep text-ink-soft",
}

/** Small rectangular tasting / dietary tag ("Vegan", "Signature"). */
export function Tag({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: React.ReactNode
}) {
  return (
    <Badge
      className={cn(
        "h-auto rounded-sm px-1.5 py-0.5 text-label-sm font-semibold normal-case tracking-normal",
        tones[tone],
        className
      )}
    >
      {children}
    </Badge>
  )
}

/** Pill overlay placed on product imagery ("HOT / ICED", "BARISTA CHOICE"). */
export function ImagePill({
  variant = "dark",
  className,
  children,
}: {
  variant?: "dark" | "amber" | "light"
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] leading-4 font-bold tracking-wider uppercase backdrop-blur-sm",
        variant === "dark" && "bg-espresso/80 text-milk",
        variant === "amber" && "bg-amber text-white",
        variant === "light" && "bg-white/90 text-amber normal-case tracking-normal font-semibold",
        className
      )}
    >
      {children}
    </span>
  )
}
