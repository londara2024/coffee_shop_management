import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Droplet, Flame, Flower2, Leaf, Mountain } from "lucide-react"

import { AddPairingButton } from "@/components/shop/add-pairing-button"
import { CustomProductView } from "@/components/shop/custom-product-view"
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
import { categories, formatPrice, getProduct, pairings, products } from "@/lib/data"

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params
  return { title: getProduct(slug)?.name ?? "Product" }
}

const profile = [
  { label: "Acidity", value: "Mild (2/5)", pct: 40 },
  { label: "Sweetness", value: "Rich (4/5)", pct: 80 },
  { label: "Body", value: "Velvety (4/5)", pct: 80 },
  { label: "Roast Level", value: "Med-Light", pct: 45 },
]

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-8">
        <div className="lg:col-start-1 lg:row-start-1">
          <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-warm ring-1 ring-espresso/5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={hero} alt={product.name} fill priority sizes="(min-width:1024px) 640px, 100vw" className="object-cover" />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <ImagePill variant="light">{product.kicker}</ImagePill>
                <ImagePill>{product.imageTag ?? "Barista Pick"}</ImagePill>
                <ImagePill variant="light" className="text-forest">
                  <Leaf className="mr-1 size-3" /> 100% Organic Arabica
                </ImagePill>
              </div>
              <span className="absolute right-3 bottom-3">
                <ImagePill variant="light" className="text-ink">
                  <Flame className="mr-1 size-3 text-amber" /> {product.kcal}–{product.kcal + 30} Cal (12 oz)
                </ImagePill>
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 px-2 pt-3 pb-1">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-amber-soft text-amber">
                  <Droplet className="size-4" />
                </span>
                <div>
                  <p className="text-title-md text-ink">Slow-Extracted Micro-Batch</p>
                  <p className="text-body-sm text-ink-soft">Pulled at 9.2 bars on Slayer Espresso v3</p>
                </div>
              </div>
              <Link href="#" className="hidden items-center gap-1 text-label-md font-semibold text-amber sm:flex">
                View Brew Protocol <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ProductConfigurator product={product} />
        </div>

        <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2 lg:self-start">
          <section className="rounded-3xl bg-oat-light p-5 ring-1 ring-espresso/5 sm:p-7">
            <span className="eyebrow">The Botanical Profile</span>
            <h2 className="mt-1 font-serif text-headline-md text-ink">Warm Spiced Velvet</h2>
            <p className="mt-2 text-body-lg text-ink-soft">
              {product.description ??
                "Our signature seasonal craft creation pairs freshly pulled single-origin Colombian espresso with slow-steamed barista oat milk, infused naturally with raw wildflower honey and a delicate honeycomb sweetness."}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4">
              {profile.map((p) => (
                <div key={p.label} className="rounded-lg bg-white p-3 ring-1 ring-border">
                  <p className="text-label-sm text-ink-soft">{p.label}</p>
                  <p className="text-title-md text-ink">{p.value}</p>
                  <div className="mt-2 h-1 rounded-full bg-oat-deep">
                    <div className="h-full rounded-full bg-amber" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 rounded-xl bg-oat p-4 sm:flex-row sm:items-center">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-oat-deeper text-amber">
                <Mountain className="size-5" />
              </span>
              <div className="flex-1">
                <p className="eyebrow">Single-Origin Harvest</p>
                <p className="text-title-md text-ink">Cooperativa Santa Teresa</p>
                <p className="text-body-sm text-ink-soft">Huila, Colombia • 1,750m • Fully Washed Castillo</p>
              </div>
              <span className="w-fit rounded-full bg-white px-3 py-1 text-label-sm font-semibold text-ink-soft ring-1 ring-border">
                Fair Trace #8942
              </span>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              {
                icon: Droplet,
                title: "Minor Figures Organic Oat",
                text: "Craft formulated without gums or preservatives, microfoamed to silky 145°F gloss.",
              },
              {
                icon: Flower2,
                title: "Raw Wildflower Honey",
                text: "Sourced sustainably from high-desert apiaries, providing floral enzymes and golden sweetness.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3 rounded-2xl bg-oat-light p-4 ring-1 ring-espresso/5">
                <Icon className="mt-0.5 size-5 shrink-0 text-amber" />
                <div>
                  <p className="text-title-md text-ink">{title}</p>
                  <p className="text-body-sm text-ink-soft">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-14">
        <span className="eyebrow">Pairing Selections</span>
        <h2 className="mt-1 font-serif text-headline-md text-ink">Complement Your Cup</h2>
        <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-2 scrollbar-none md:grid md:grid-cols-3 md:overflow-visible">
          {pairings.map((p) => (
            <article
              key={p.slug}
              className="flex w-72 shrink-0 snap-start flex-col gap-3 rounded-2xl bg-white p-3 shadow-warm ring-1 ring-espresso/5 md:w-auto"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                <Image src={p.image} alt={p.name} fill sizes="(min-width:768px) 400px, 288px" className="object-cover" />
              </div>
              <div className="flex items-start justify-between gap-2 px-1">
                <div>
                  <p className="text-title-md text-ink">{p.name}</p>
                  <p className="text-body-sm text-ink-soft">{p.description}</p>
                </div>
                <span className="text-title-md font-semibold text-ink tabular">{formatPrice(p.price)}</span>
              </div>
              <AddPairingButton item={p} />
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
