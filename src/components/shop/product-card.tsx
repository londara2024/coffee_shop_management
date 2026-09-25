"use client"

import Image from "next/image"
import Link from "next/link"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { ImagePill, Tag } from "@/components/shop/tag"
import { Button } from "@/components/ui/button"
import { formatPrice, type Product } from "@/lib/data"
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
  toast.success(`${product.name} added`, { description: `${formatPrice(product.price)} · Ready in ~12 min` })
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
          alt={product.name}
          fill
          sizes={feature ? "(min-width: 1024px) 320px, 100vw" : "144px"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute top-2 left-2">
          <ImagePill variant={featureLabel?.variant ?? "dark"}>{featureLabel?.text ?? product.badge}</ImagePill>
        </span>
        {product.imageTag && !feature ? (
          <span className="absolute bottom-2 left-2 max-sm:hidden">
            <ImagePill variant="light">{product.imageTag}</ImagePill>
          </span>
        ) : null}
      </Link>

      <div className={cn("flex min-w-0 flex-1 flex-col justify-between gap-2", feature ? "p-4 sm:p-5" : "p-3 sm:p-4")}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate eyebrow text-[10px] sm:text-label-sm">{product.kicker}</span>
            <span
              className={cn(
                "shrink-0 text-ink tabular",
                feature ? "font-serif text-headline-sm font-semibold" : "text-title-md font-semibold"
              )}
            >
              {formatPrice(product.price)}
            </span>
          </div>
          <Link href={href}>
            <h3
              className={cn(
                "text-ink transition-colors hover:text-amber",
                feature ? "font-serif text-headline-sm" : "line-clamp-2 text-title-md"
              )}
            >
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-1.5 text-label-sm text-ink-soft">
            <span>{product.kcal} kcal</span>
            {product.extra ? <span>• {product.extra}</span> : null}
            <span aria-hidden>•</span>
            {product.tags.map((t) => (
              <Tag key={t.label} tone={t.tone}>
                {t.label}
              </Tag>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => quickAdd(product)}
            className="h-8 flex-1 gap-1.5 rounded-lg text-label-md font-semibold hover:bg-amber"
          >
            <Plus className="size-4" />
            <span className="sm:hidden">Quick Add</span>
            <span className="max-sm:hidden">Quick Add to Order</span>
          </Button>
        </div>
      </div>
    </article>
  )
}
