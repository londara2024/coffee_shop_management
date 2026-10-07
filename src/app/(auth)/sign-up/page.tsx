import type { Metadata } from "next"

import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = { title: "បង្កើតគណនី" }

export default function SignUpPage() {
  return <SignUpForm />
}
