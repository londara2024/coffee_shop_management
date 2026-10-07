"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CircleCheck, Loader2, Lock, Phone, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { AuthCard, AuthHeading, Field, PasswordField, SocialButtons } from "@/components/auth/auth-fields"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { markSignedIn } from "@/lib/auth"

type Errors = { phone?: string; password?: string }

export function SignInForm() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")

  function validate(): Errors {
    const e: Errors = {}
    if (phone.replace(/\D/g, "").length < 7) e.phone = "សូមបញ្ចូលលេខទូរស័ព្ទដែលភ្ជាប់ជាមួយលេខសម្គាល់ហាងរបស់អ្នក។"
    if (!password) e.password = "សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក។"
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
      markSignedIn()
      toast.success("សូមស្វាគមន៍ត្រឡប់មកវិញ", { description: remember ? "អ្នកនឹងនៅតែចូលប្រើបានលើឧបករណ៍នេះ។" : undefined })
      setTimeout(() => router.push("/"), 600)
    }, 1200)
  }

  return (
    <AuthCard>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <AuthHeading
          icon={ShieldCheck}
          badge="ការចូលប្រើប្រាស់ដោយសុវត្ថិភាព"
          title="សូមស្វាគមន៍ត្រឡប់មកកាន់ Free Shop Coffee"
          description="ចូលគណនីដើម្បីគ្រប់គ្រងកាហ្វេ របស់អ្នក"
        />

        <SocialButtons verb="Sign in" divider="Or sign in with phone number" />

        <div className="flex flex-col gap-4">
          <Field
            id="phone"
            label="លេខទូរស័ព្ទ"
            icon={Phone}
            type="tel"
            autoComplete="tel"
            placeholder="+855 12 345 678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            hint={<span className="text-label-sm font-semibold text-amber uppercase">លេខសម្គាល់ហាង</span>}
          />
          <PasswordField
            id="password"
            label="ពាក្យសម្ងាត់"
            icon={Lock}
            autoComplete="current-password"
            placeholder="ពាក្យសម្ងាត់របស់អ្នក"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint={
              <button
                type="button"
                className="text-label-md font-semibold text-amber hover:underline"
                onClick={() => toast("កំណត់ពាក្យសម្ងាត់ឡើងវិញ", { description: "យើងនឹងផ្ញើតំណកំណត់ពាក្យសម្ងាត់ឡើងវិញតាមអ៊ីមែល នៅពេលប្រព័ន្ធគណនីដំណើរការ។" })}
              >
                ភ្លេចពាក្យសម្ងាត់?
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
          រក្សាការចូលប្រើរបស់ខ្ញុំនៅលើឧបករណ៍នេះ
        </Label>

        <Button type="submit" disabled={status !== "idle"} className="h-auto min-h-12 w-full gap-2 rounded-xl py-3 text-title-md whitespace-normal hover:bg-amber">
          {status === "idle" && (
            <>
              ចូលប្រើគណនីរបស់អ្នក <ArrowRight className="size-4" />
            </>
          )}
          {status === "loading" && (
            <>
              <Loader2 className="size-4 animate-spin" /> កំពុងផ្ទៀងផ្ទាត់...
            </>
          )}
          {status === "done" && (
            <>
              <CircleCheck className="size-4" /> បានផ្ទៀងផ្ទាត់រួចរាល់
            </>
          )}
        </Button>

        <Separator />
        <p className="text-center text-body-md text-balance text-ink-soft">
          អ្នកមិនទាន់មានគណនីមែនទេ?{" "}
          <Link href="/sign-up" className="font-semibold text-amber underline-offset-4 hover:underline">
            បង្កើតគណនីសម្រាប់ហាង
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
