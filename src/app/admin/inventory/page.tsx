import type { Metadata } from "next"

import { InventoryLedger } from "@/components/admin/inventory-ledger"

export const metadata: Metadata = { title: "Inventory & Supplies" }

export default function InventoryPage() {
  return <InventoryLedger />
}
