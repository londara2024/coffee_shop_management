import type { Metadata } from "next"

import { KdsBoard } from "@/components/admin/kds-board"

export const metadata: Metadata = { title: "Live Kitchen Tickets" }

export default function KdsPage() {
  return <KdsBoard />
}
