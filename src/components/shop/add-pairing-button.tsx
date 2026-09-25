"use client"

import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { cart } from "@/lib/cart"
import type { pairings } from "@/lib/data"

export function AddPairingButton({ item }: { item: (typeof pairings)[number] }) {
  return (
    <Button
      variant="secondary"
      className="mt-auto h-9 gap-1.5 rounded-lg text-label-md hover:bg-oat-deep"
      onClick={() => {
        cart.add({
          id: `${item.slug}|default`,
          slug: item.slug,
          name: item.name,
          image: item.image,
          unitPrice: item.price,
          details: item.description,
          tag: "Pairing",
        })
        toast.success(`${item.name} added`)
      }}
    >
      <Plus className="size-4" /> {item.cta}
    </Button>
  )
}
