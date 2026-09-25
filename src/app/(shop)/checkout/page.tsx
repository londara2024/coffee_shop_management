import type { Metadata } from "next"

import { CheckoutView } from "@/components/shop/checkout-view"

export const metadata: Metadata = { title: "Review Your Order" }

export default function CheckoutPage() {
  return <CheckoutView />
}
