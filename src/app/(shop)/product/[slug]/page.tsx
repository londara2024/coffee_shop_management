import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { AddPairingButton } from "@/components/shop/add-pairing-button"
import { CustomProductView } from "@/components/shop/custom-product-view"
import { ProductConfigurator } from "@/components/shop/product-configurator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { categories, formatPrice, getProduct, pairings, products } from "@/lib/data"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params
  return { title: getProduct(slug)?.name ?? "Product" }
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params
  const product = getProduct(slug)
  // Not a built-in item: it may have been created in Admin › Menu & Catalog (stored in the browser).
  if (!product) return <CustomProductView slug={slug} />

  const category = categories.find((c) => c.id === product.category)!
  const hero = product.slug === "honey-cinnamon-oat-latte" ? "/images/latte-hero.jpg" : product.image

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 pb-20 md:px-6 lg:pb-12">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>ម៉ឺនុយ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/#${category.id}-section`} />}>
              {category.labelKm ?? category.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate">{product.nameKm ?? product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-warm ring-1 ring-espresso/5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image
                src={hero}
                alt={product.name}
                fill
                priority
                sizes="(min-width:1024px) 640px, 100vw"
                className="object-cover"
              />
            </div>
            {product.sizePrices ? (
              <div className="flex flex-wrap items-center gap-1.5 px-2 pt-3 pb-1">
                <span className="text-label-sm font-semibold text-ink-soft">ទំហំតម្លៃ៖</span>
                {(["តូច", "ធម្មតា", "ធំ"] as const).map((label, i) => (
                  <span key={label} className="rounded-full bg-oat px-2.5 py-0.5 text-label-sm font-semibold text-ink">
                    {label} {formatPrice(product.sizePrices![i])}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ProductConfigurator product={product} />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <section>
            <h2 className="font-serif text-headline-md text-ink">បំពេញបន្ថែមពែងរបស់អ្នក</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {pairings.map((p) => (
                <article
                  key={p.slug}
                  className="flex w-56 shrink-0 flex-col gap-2 rounded-xl bg-white p-2.5 shadow-warm ring-1 ring-espresso/5"
                >
                  <div className="relative aspect-4/3 overflow-hidden rounded-lg">
                    <Image src={p.image} alt={p.name} fill sizes="224px" className="object-cover" />
                  </div>
                  <div>
                    <p className="line-clamp-1 text-title-md text-ink">{p.nameKm ?? p.name}</p>
                    <p className="line-clamp-1 text-body-sm text-ink-soft">{p.descriptionKm ?? p.description}</p>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-title-md font-semibold text-ink tabular">{formatPrice(p.price)}</span>
                  </div>
                  <AddPairingButton item={p} />
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
