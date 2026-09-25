"use client"

import { useState } from "react"
import { Eye, EyeOff, type LucideIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/** Centered card shared by sign-in and sign-up (one width for both, per the unified design). */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-3xl bg-white p-6 shadow-warm-lg ring-1 ring-espresso/5 sm:p-10">
      {children}
    </div>
  )
}

export function AuthHeading({
  icon: Icon,
  badge,
  title,
  description,
  aside,
}: {
  icon: LucideIcon
  badge: string
  title: string
  description: string
  aside?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-amber-soft/50 px-3 py-1 eyebrow">
          <Icon className="size-3.5 shrink-0" /> {badge}
        </span>
        {aside}
      </div>
      <h1 className="font-serif text-headline-lg-sm text-ink md:text-headline-lg">{title}</h1>
      <p className="text-body-md text-ink-soft">{description}</p>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8.1Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8l3.7-2.8Z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4Z" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9a4.8 4.8 0 0 0-3.8-2c-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9a5 5 0 0 0-4.2 2.6c-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8s2 .8 3.4.8c1.4 0 2.3-1.3 3.1-2.5a11 11 0 0 0 1.4-2.9 4.5 4.5 0 0 1-2.6-4.1ZM13.9 5a4.4 4.4 0 0 0 1-3.2 4.5 4.5 0 0 0-3 1.5 4.2 4.2 0 0 0-1 3.1c1.2.1 2.3-.5 3-1.4Z" />
    </svg>
  )
}

export function SocialButtons({ verb, divider }: { verb: string; divider: string }) {
  const soon = (provider: string) =>
    toast(`${provider} ${verb.toLowerCase()} isn't connected yet`, { description: "Use your email below for now." })
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button type="button" variant="secondary" className="h-11 gap-2 rounded-xl bg-oat text-body-md hover:bg-oat-deep" onClick={() => soon("Google")}>
          <GoogleIcon /> {verb} with Google
        </Button>
        <Button type="button" variant="secondary" className="h-11 gap-2 rounded-xl bg-oat text-body-md hover:bg-oat-deep" onClick={() => soon("Apple ID")}>
          <AppleIcon /> {verb} with Apple ID
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-label-sm font-bold tracking-widest text-ink-mute uppercase">{divider}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  )
}

type FieldProps = {
  id: string
  label: string
  icon: LucideIcon
  hint?: React.ReactNode
  error?: string
  /** Rendered inside the input, right-aligned (e.g. a show-password toggle). */
  end?: React.ReactNode
} & Omit<React.ComponentProps<"input">, "id">

/** Label + icon-prefixed input on an oat surface, with an optional error line underneath. */
export function Field({ id, label, icon: Icon, hint, error, end, className, ...input }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id} className="text-title-md font-normal text-ink">
          {label}
        </Label>
        {hint}
      </div>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-soft" />
        <Input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "h-12 rounded-xl border-transparent bg-oat-light pl-11 text-body-md focus-visible:border-amber-bright focus-visible:ring-amber-bright/20",
            className
          )}
          {...input}
        />
        {end ? <div className="absolute top-1/2 right-2 -translate-y-1/2">{end}</div> : null}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-label-md font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function PasswordField(props: Omit<FieldProps, "type" | "end">) {
  const [visible, setVisible] = useState(false)
  return (
    <Field
      {...props}
      type={visible ? "text" : "password"}
      className="pr-12"
      end={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="text-ink-soft hover:bg-oat-deep"
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      }
    />
  )
}

const strengthLabels = ["Light bloom", "Gentle infusion", "Balanced body", "Strong roast", "Artisanal Reserve"]

/** Same scoring as the design's inline script: length ≥4, ≥8, upper+digit, symbol. */
export function passwordStrength(value: string) {
  let score = 0
  if (value.length >= 4) score++
  if (value.length >= 8) score++
  if (/[A-Z]/.test(value) && /[0-9]/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value)) score++
  return score
}

export function StrengthMeter({ value }: { value: string }) {
  const score = passwordStrength(value)
  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={cn("h-1 rounded-full transition-colors", score >= n ? "bg-amber" : "bg-oat-deeper")} />
        ))}
      </div>
      <div className="flex justify-between text-label-sm text-ink-soft">
        <span>
          Sensory complexity: <b className="text-amber">{strengthLabels[score]}</b>
        </span>
        <span>Include letters &amp; numbers</span>
      </div>
    </div>
  )
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
