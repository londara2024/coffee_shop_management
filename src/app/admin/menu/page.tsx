import type { Metadata } from "next"

import { CatalogManager } from "@/components/admin/catalog-manager"

export const metadata: Metadata = { title: "Menu & Catalog" }

export default function AdminMenuPage() {
  return <CatalogManager />
}
