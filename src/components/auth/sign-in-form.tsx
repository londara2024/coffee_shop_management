"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CircleCheck, Loader2, Lock, Mail, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { AuthCard, AuthHeading, Field, isEmail, PasswordField, SocialButtons } from "@/components/auth/auth-fields"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

type Errors = { email?: string; password?: string }

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")

  function validate(): Errors {
    const e: Errors = {}
    if (!isEmail(email)) e.email = "Enter the email linked to your Roastery ID."
    if (!password) e.password = "Enter your password."
    return e
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return
    // No auth backend yet — simulate the round-trip, then return to the menu.
    setStatus("loading")
    setTimeout(() => {
      setStatus("done")
      toast.success("Welcome back to Aura", { description: remember ? "You'll stay signed in on this device." : undefined })
      setTimeout(() => router.push("/"), 600)
    }, 1200)
  }

  return (
    <AuthCard>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <AuthHeading
          icon={ShieldCheck}
          badge="Secure Roastery Access"
          title="Welcome Back to Aura"
          description="Sign in to manage your roast subscriptions, harvest reservations, and Botanica Gold perks."
        />

        <SocialButtons verb="Sign in" divider="Or sign in with email" />

        <div className="flex flex-col gap-4">
          <Field
            id="email"
            label="Email Address"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="elena.rostova@botanica.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            hint={<span className="text-label-sm font-semibold text-amber uppercase">Roastery ID</span>}
          />
          <PasswordField
            id="password"
            label="Password"
            icon={Lock}
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint={
              <button
                type="button"
                className="text-label-md font-semibold text-amber hover:underline"
                onClick={() => toast("Password reset", { description: "We'll email you a reset link once accounts are live." })}
              >
                Forgot password?
              </button>
            }
          />
        </div>

        <Label className="flex cursor-pointer items-center gap-3 text-body-md font-normal text-ink">
          <Checkbox
            checked={remember}
            onCheckedChange={setRemember}
            className="size-5 data-checked:border-amber data-checked:bg-amber"
          />
          Keep me signed in on this roastery device
        </Label>

        <Button type="submit" disabled={status !== "idle"} className="h-auto min-h-12 w-full gap-2 rounded-xl py-3 text-title-md whitespace-normal hover:bg-amber">
          {status === "idle" && (
            <>
              Sign In to Your Account <ArrowRight className="size-4" />
            </>
          )}
          {status === "loading" && (
            <>
              <Loader2 className="size-4 animate-spin" /> Authenticating…
            </>
          )}
          {status === "done" && (
            <>
              <CircleCheck className="size-4" /> Authenticated
            </>
          )}
        </Button>

        <Separator />
        <p className="text-center text-body-md text-balance text-ink-soft">
          New to Aura Roasters?{" "}
          <Link href="/sign-up" className="font-semibold text-amber underline-offset-4 hover:underline">
            Create an account &amp; join Botanica Club
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
