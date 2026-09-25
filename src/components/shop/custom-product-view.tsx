"use client"

import { useSyncExternalStore } from "react"
import Image from "next/image"
import Link from "next/link"
import { Leaf } from "lucide-react"

import { ProductConfigurator } from "@/components/shop/product-configurator"
import { ImagePill } from "@/components/shop/tag"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { useCustomProducts } from "@/lib/catalog"
import { categories } from "@/lib/data"

const noop = () => () => {}

/**
 * Product page for items created in Admin › Menu & Catalog. Those live in the browser's catalog store,
 * so the server can't render them — this looks the slug up after hydration.
 */
export function CustomProductView({ slug }: { slug: string }) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const product = useCustomProducts().find((p) => p.slug === slug && p.live)

  if (!hydrated) {
    return (
      <div className="mx-auto grid max-w-7xl animate-pulse gap-6 px-4 pt-14 md:px-6 lg:grid-cols-2">
        <div className="aspect-[4/3] rounded-3xl bg-oat" />
        <div className="h-96 rounded-3xl bg-oat" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <p className="font-serif text-headline-md text-ink">This item isn&apos;t on the menu</p>
        <p className="text-body-md text-ink-soft">It may have been removed or switched off by the roastery.</p>
        <Button nativeButton={false} render={<Link href="/" />} className="mt-2 hover:bg-amber">
          Back to the menu
        </Button>
      </div>
    )
  }

  const category = categories.find((c) => c.id === product.category)!

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-20 md:px-6 lg:pb-12">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>Menu</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/#${category.id}-section`} />}>{category.label}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate">{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-warm ring-1 ring-espresso/5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={product.image} alt={product.name} fill priority sizes="(min-width:1024px) 640px, 100vw" className="object-cover" />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <ImagePill variant="light">{product.kicker}</ImagePill>
                <ImagePill>{product.badge}</ImagePill>
              </div>
              {product.imageTag ? (
                <span className="absolute right-3 bottom-3">
                  <ImagePill variant="light" className="text-forest">
                    <Leaf className="mr-1 size-3" /> {product.imageTag}
                  </ImagePill>
                </span>
              ) : null}
            </div>
          </div>
          {product.description ? (
            <section className="rounded-3xl bg-oat-light p-5 ring-1 ring-espresso/5 sm:p-7">
              <span className="eyebrow">About this {category.id === "food" || category.id === "desserts" ? "dish" : "drink"}</span>
              <p className="mt-2 text-body-lg text-ink-soft">{product.description}</p>
            </section>
          ) : null}
        </div>
        <div>
          <ProductConfigurator product={product} />
        </div>
      </div>
    </div>
  )
}
