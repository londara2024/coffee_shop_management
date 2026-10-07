import type { Metadata } from "next"

import { ShopSettingsManager } from "@/components/admin/shop-settings-manager"

export const metadata: Metadata = { title: "ការកំណត់ហាង" }

export default function AdminSettingsPage() {
  return <ShopSettingsManager />
}
