"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, BadgeCheck, CircleCheck, IdCard, Loader2, Lock, Mail, Phone } from "lucide-react"
import { toast } from "sonner"

import {
  AuthCard,
  AuthHeading,
  Field,
  isEmail,
  PasswordField,
  SocialButtons,
  StrengthMeter,
} from "@/components/auth/auth-fields"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type Errors = { name?: string; email?: string; phone?: string; password?: string; terms?: string }

const checkbox = "size-5 data-checked:border-amber data-checked:bg-amber"

export function SignUpForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" })
  const [remember, setRemember] = useState(true)
  const [news, setNews] = useState(true)
  const [terms, setTerms] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  function validate(): Errors {
    const e: Errors = {}
    if (form.name.trim().length < 2) e.name = "Tell us the name for your cup."
    if (!isEmail(form.email)) e.email = "Enter a valid email for your Roastery ID & receipts."
    if (form.phone && form.phone.replace(/\D/g, "").length < 7) e.phone = "That number looks too short."
    if (form.password.length < 8) e.password = "Use at least 8 characters."
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = "Include both letters and numbers."
    if (!terms) e.terms = "Please accept the Terms of Service and Privacy Policy."
    return e
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    // No auth backend yet — simulate account creation, then return to the menu.
    setStatus("loading")
    setTimeout(() => {
      setStatus("done")
      toast.success(`Welcome to Aura, ${form.name.trim().split(" ")[0]}!`, {
        description: "Your welcome pour is waiting at the counter.",
      })
      setTimeout(() => router.push("/"), 600)
    }, 1200)
  }

  return (
    <AuthCard>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <AuthHeading
          icon={BadgeCheck}
          badge="Secure Botanica Registration"
          title="Create Your Account"
          description="Sign up in seconds to personalize your brew profile and unlock immediate member benefits."
          aside={<span className="shrink-0 text-body-sm whitespace-nowrap text-ink-soft">Step 1 of 1</span>}
        />

        <SocialButtons verb="Sign up" divider="Or register with email" />

        <div className="flex flex-col gap-4">
          <Field
            id="name"
            label="Full Name"
            icon={IdCard}
            autoComplete="name"
            placeholder="Elena Rostova"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
          />
          <Field
            id="email"
            label="Email Address"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="elena.rostova@botanica.com"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            hint={<span className="text-label-sm font-semibold text-amber uppercase">Roastery ID &amp; Receipts</span>}
          />
          <Field
            id="phone"
            label="Phone Number"
            icon={Phone}
            type="tel"
            autoComplete="tel"
            placeholder="+1 (555) 234-5678"
            value={form.phone}
            onChange={set("phone")}
            error={errors.phone}
            hint={<span className="text-label-sm text-ink-soft">Optional • Express Barista SMS</span>}
          />
          <div className="flex flex-col gap-2.5">
            <PasswordField
              id="password"
              label="Create Password"
              icon={Lock}
              autoComplete="new-password"
              placeholder="Minimum 8 mindful characters"
              value={form.password}
              onChange={set("password")}
              error={errors.password}
            />
            <StrengthMeter value={form.password} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label className="flex cursor-pointer items-center gap-3 text-body-md font-normal text-ink">
            <Checkbox checked={remember} onCheckedChange={setRemember} className={checkbox} />
            Keep me signed in on this roastery device
          </Label>
          <Label className="flex cursor-pointer items-center gap-3 text-body-md font-normal text-ink">
            <Checkbox checked={news} onCheckedChange={setNews} className={checkbox} />
            <span>
              Send me seasonal harvest drops and cupping invitations{" "}
              <span className="text-label-sm text-ink-mute">(Optional)</span>
            </span>
          </Label>
          <div className="flex flex-col gap-1">
            <Label className="flex cursor-pointer items-center gap-3 text-body-md font-normal text-ink">
              <Checkbox
                checked={terms}
                onCheckedChange={(v) => {
                  setTerms(v)
                  if (v) setErrors((e) => ({ ...e, terms: undefined }))
                }}
                aria-invalid={errors.terms ? true : undefined}
                className={checkbox}
              />
              <span>
                I agree to the{" "}
                <Link href="#" className="text-amber underline underline-offset-4">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-amber underline underline-offset-4">
                  Privacy Policy
                </Link>
              </span>
            </Label>
            {errors.terms ? <p className="pl-8 text-label-md font-semibold text-danger">{errors.terms}</p> : null}
          </div>
        </div>

        <Button type="submit" disabled={status !== "idle"} className="h-auto min-h-12 w-full gap-2 rounded-xl py-3 text-title-md whitespace-normal hover:bg-amber">
          {status === "idle" && (
            <>
              Create Account &amp; Claim Welcome Pour <ArrowRight className="size-4" />
            </>
          )}
          {status === "loading" && (
            <>
              <Loader2 className="size-4 animate-spin" /> Brewing your account…
            </>
          )}
          {status === "done" && (
            <>
              <CircleCheck className="size-4" /> Account created
            </>
          )}
        </Button>

        <Separator />
        <p className="text-center text-body-md text-balance text-ink-soft">
          Already have an Aura account?{" "}
          <Link href="/sign-in" className="font-semibold text-amber underline underline-offset-4">
            Sign In
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
