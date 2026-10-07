"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { ImagePill } from "@/components/shop/tag"
import { Button } from "@/components/ui/button"
import { formatPrice, formatRiel, type Product } from "@/lib/data"
import { cart } from "@/lib/cart"
import { cn } from "@/lib/utils"

export function quickAdd(product: Product) {
  cart.add({
    id: `${product.slug}|default`,
    slug: product.slug,
    name: product.name,
    image: product.image,
    unitPrice: product.price,
    details: "House standard preparation",
  })
  const name = product.nameKm ?? product.name
  toast.success(`បានបន្ថែម ${name}`, {
    description: `${formatPrice(product.price)} · រួចរាល់ក្នុងរយៈពេលប្រហែល១២នាទី`,
  })
}

export function ProductCard({
  product,
  feature = false,
  featureLabel,
}: {
  product: Product
  feature?: boolean
  featureLabel?: { text: string; variant: "dark" | "amber" }
}) {
  const href = `/product/${product.slug}`
  const name = product.nameKm ?? product.name

  return (
    <article
      className={cn(
        "group flex overflow-hidden rounded-2xl bg-oat shadow-warm ring-1 ring-espresso/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-warm-lg",
        feature ? "flex-col sm:flex-row" : "flex-row"
      )}
    >
      <Link
        href={href}
        className={cn(
          "relative shrink-0 overflow-hidden",
          feature ? "h-44 sm:h-auto sm:w-1/2" : "w-28 sm:w-36"
        )}
      >
        <Image
          src={product.image}
          alt={name}
          fill
          sizes={feature ? "(min-width: 1024px) 320px, 100vw" : "144px"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-2 left-2">
          <ImagePill variant={featureLabel?.variant ?? "dark"}>{featureLabel?.text ?? product.badge}</ImagePill>
        </span>
      </Link>

      <div className={cn("flex min-w-0 flex-1 flex-col justify-between gap-2", feature ? "p-4 sm:p-5" : "p-3 sm:p-4")}>
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={href} className="min-w-0">
              <h3
                className={cn(
                  "font-normal text-ink transition-colors hover:text-amber",
                  feature ? "font-serif text-headline-sm" : "line-clamp-2 text-title-md"
                )}
              >
                {name}
              </h3>
            </Link>
            <span className="flex shrink-0 flex-col items-end">
              <span
                className={cn(
                  "text-ink tabular",
                  feature ? "font-serif text-headline-sm font-semibold" : "text-title-md font-semibold"
                )}
              >
                {formatPrice(product.price)}
              </span>
              <span className="text-label-sm text-ink-soft tabular">{formatRiel(product.price)}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => quickAdd(product)}
            className="h-8 flex-1 gap-1.5 rounded-lg text-label-md font-semibold hover:bg-amber"
          >
            <Plus className="size-4" />
            <span className="sm:hidden">បន្ថែមរហ័ស</span>
            <span className="max-sm:hidden">បន្ថែមរហ័សទៅការកម្ម៉ង់</span>
          </Button>
        </div>
      </div>
    </article>
  )
}
