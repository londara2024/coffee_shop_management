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
import { markSignedIn } from "@/lib/auth"

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
    if (form.name.trim().length < 2) e.name = "សូមប្រាប់យើងនូវឈ្មោះសម្រាប់ពែងរបស់អ្នក។"
    if (!isEmail(form.email)) e.email = "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ សម្រាប់លេខសម្គាល់ហាង និងបង្កាន់ដៃ។"
    if (form.phone && form.phone.replace(/\D/g, "").length < 7) e.phone = "លេខនេះហាក់ដូចជាខ្លីពេក។"
    if (form.password.length < 8) e.password = "សូមប្រើយ៉ាងហោចណាស់ ៨ តួអក្សរ។"
    else if (!/[A-Za-z]/.test(form.password) || !/[0-9]/.test(form.password))
      e.password = "ត្រូវមានទាំងអក្សរ និងលេខ។"
    if (!terms) e.terms = "សូមយល់ព្រមលើលក្ខខណ្ឌសេវាកម្ម និងគោលការណ៍ឯកជនភាព។"
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
      markSignedIn()
      toast.success(`សូមស្វាគមន៍មកកាន់ Free Shop Coffee, ${form.name.trim().split(" ")[0]}!`, {
        description: "ភេសជ្ជៈស្វាគមន៍របស់អ្នកកំពុងរង់ចាំនៅកន្លែងបញ្ជរ។",
      })
      setTimeout(() => router.push("/"), 600)
    }, 1200)
  }

  return (
    <AuthCard>
      <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
        <AuthHeading
          icon={BadgeCheck}
          badge="ការចុះឈ្មោះដោយសុវត្ថិភាព"
          title="បង្កើតគណនីរបស់អ្នក"
          description="ចុះឈ្មោះ ដើម្បីកំណត់ទម្រង់កាហ្វេ និងទទួលបានអត្ថប្រយោជន៍សមាជិកភ្លាមៗ។"
          aside={<span className="shrink-0 text-body-sm whitespace-nowrap text-ink-soft">ជំហានទី ១ នៃ ១</span>}
        />

        <SocialButtons verb="Sign up" divider="Or register with email" />

        <div className="flex flex-col gap-4">
          <Field
            id="name"
            label="ឈ្មោះពេញ"
            icon={IdCard}
            autoComplete="name"
            placeholder="Elena Rostova"
            value={form.name}
            onChange={set("name")}
            error={errors.name}
          />
          <Field
            id="email"
            label="អាសយដ្ឋានអ៊ីមែល"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="elena.rostova@botanica.com"
            value={form.email}
            onChange={set("email")}
            error={errors.email}
            hint={<span className="text-label-sm font-semibold text-amber uppercase">លេខសម្គាល់ហាង និងបង្កាន់ដៃ</span>}
          />
          <Field
            id="phone"
            label="លេខទូរស័ព្ទ"
            icon={Phone}
            type="tel"
            autoComplete="tel"
            placeholder="+855 12 345 678"
            value={form.phone}
            onChange={set("phone")}
            error={errors.phone}
            hint={<span className="text-label-sm text-ink-soft">ស្រេចចិត្ត • សារ SMS ពីបារីស្តា</span>}
          />
          <div className="flex flex-col gap-2.5">
            <PasswordField
              id="password"
              label="បង្កើតពាក្យសម្ងាត់"
              icon={Lock}
              autoComplete="new-password"
              placeholder="យ៉ាងតិច ៨ តួអក្សរ"
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
            រក្សាការចូលប្រើរបស់ខ្ញុំនៅលើឧបករណ៍នេះ
          </Label>
          <Label className="flex cursor-pointer items-center gap-3 text-body-md font-normal text-ink">
            <Checkbox checked={news} onCheckedChange={setNews} className={checkbox} />
            <span>
              ផ្ញើដំណឹងផលិតផលថ្មីតាមរដូវ និងការអញ្ជើញភ្លក្សរសជាតិមកខ្ញុំ{" "}
              <span className="text-label-sm text-ink-mute">(ស្រេចចិត្ត)</span>
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
                ខ្ញុំយល់ព្រមលើ{" "}
                <Link href="#" className="text-amber underline underline-offset-4">
                  លក្ខខណ្ឌសេវាកម្ម
                </Link>{" "}
                និង{" "}
                <Link href="#" className="text-amber underline underline-offset-4">
                  គោលការណ៍ឯកជនភាព
                </Link>
              </span>
            </Label>
            {errors.terms ? <p className="pl-8 text-label-md font-semibold text-danger">{errors.terms}</p> : null}
          </div>
        </div>

        <Button type="submit" disabled={status !== "idle"} className="h-auto min-h-12 w-full gap-2 rounded-xl py-3 text-title-md whitespace-normal hover:bg-amber">
          {status === "idle" && (
            <>
              បង្កើតគណនី និងទទួលភេសជ្ជៈស្វាគមន៍ <ArrowRight className="size-4" />
            </>
          )}
          {status === "loading" && (
            <>
              <Loader2 className="size-4 animate-spin" /> កំពុងបង្កើតគណនីរបស់អ្នក...
            </>
          )}
          {status === "done" && (
            <>
              <CircleCheck className="size-4" /> បានបង្កើតគណនីរួចរាល់
            </>
          )}
        </Button>

        <Separator />
        <p className="text-center text-body-md text-balance text-ink-soft">
          មានគណនីរួចហើយមែនទេ?{" "}
          <Link href="/sign-in" className="font-semibold text-amber underline underline-offset-4">
            ចូលប្រើគណនី
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
