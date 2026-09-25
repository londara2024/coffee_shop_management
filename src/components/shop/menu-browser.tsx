"use client"

import { useEffect, useMemo, useState } from "react"
import { Cake, Coffee, CupSoda, Flame, Leaf, Sandwich, Search, SlidersHorizontal } from "lucide-react"

import { ProductCard } from "@/components/shop/product-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAllProducts } from "@/lib/catalog"
import { categories, filters, getProduct, type CategoryId, type Product } from "@/lib/data"
import { cn } from "@/lib/utils"

const icons: Record<CategoryId, typeof Coffee> = {
  coffee: Coffee,
  tea: Leaf,
  smoothies: CupSoda,
  food: Sandwich,
  desserts: Cake,
}

const filterFns: Record<string, (p: Product) => boolean> = {
  "All Creations": () => true,
  "Seasonal Favorites": (p) => /seasonal|signature|special|reserve/i.test(`${p.kicker} ${p.tags.map((t) => t.label)}`),
  "Iced & Cold Brew": (p) => /iced|cold/i.test(`${p.badge} ${p.kicker}`),
  "Single Origin Micro-lots": (p) => /origin|pour over|matcha|uji/i.test(`${p.kicker} ${p.name} ${p.badge}`),
  "Dairy-Free Natural": (p) => p.tags.some((t) => /vegan|plant|detox/i.test(t.label)),
}

export function MenuBrowser() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState(filters[0])
  const [active, setActive] = useState<CategoryId>("coffee")
  const [scrolled, setScrolled] = useState(false)

  // The divider under the sticky bar only appears once content scrolls beneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Built-in menu plus admin-created items that are switched live.
  const all = useAllProducts({ liveOnly: true })

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter(
      (p) =>
        filterFns[filter](p) &&
        (!q || `${p.name} ${p.kicker} ${p.tags.map((t) => t.label).join(" ")}`.toLowerCase().includes(q))
    )
  }, [all, query, filter])

  // Scroll-spy: highlight the category section currently under the sticky bar.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting)
        if (hit) setActive(hit.target.id.replace("-section", "") as CategoryId)
      },
      { rootMargin: "-40% 0px -55% 0px" }
    )
    categories.forEach((c) => {
      const el = document.getElementById(`${c.id}-section`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [visible])

  const spotlight = [getProduct("brown-sugar-oat-shaken-espresso")!, getProduct("cardamom-pistachio-cortado")!]
  const filtering = query !== "" || filter !== filters[0]
  const ActiveIcon = icons[active]

  function goToCategory(id: CategoryId) {
    setActive(id)
    document.getElementById(`${id}-section`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <div
        className={cn(
          "sticky top-16 z-30 bg-milk/95 backdrop-blur-md transition-shadow duration-200 md:top-20",
          scrolled && "shadow-sm"
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pt-3 pb-2 md:px-6">
          {/* Phones: categories & filters collapse into dropdowns so nothing runs off-screen */}
          <div className="grid grid-cols-2 gap-2 md:hidden">
            <Select
              value={active}
              items={Object.fromEntries(categories.map((c) => [c.id, c.label]))}
              onValueChange={(v) => v && goToCategory(v as CategoryId)}
            >
              <SelectTrigger aria-label="Category" className="h-10 w-full rounded-full border-0 bg-espresso px-4 text-label-lg font-semibold text-milk [&_svg]:text-milk">
                <ActiveIcon className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => {
                  const Icon = icons[c.id]
                  return (
                    <SelectItem key={c.id} value={c.id} className="py-2">
                      <Icon className="size-4 text-amber" />
                      <span className="flex-1">{c.label}</span>
                      <span className="rounded-full bg-oat-deeper px-1.5 text-label-sm text-ink-soft">{c.count}</span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Select value={filter} onValueChange={(v) => v && setFilter(v as string)}>
              <SelectTrigger
                aria-label="Filter"
                className={cn(
                  "h-10 w-full rounded-full border-0 px-4 text-label-md font-bold",
                  filter === filters[0] ? "bg-oat text-ink" : "bg-amber-soft text-[#2e1500]"
                )}
              >
                <SlidersHorizontal className="size-4 text-amber" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filters.map((f) => (
                  <SelectItem key={f} value={f} className="py-2">
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none" aria-label="Categories">
              {categories.map((c) => {
                const Icon = icons[c.id]
                const on = active === c.id
                return (
                  <a
                    key={c.id}
                    href={`#${c.id}-section`}
                    onClick={() => setActive(c.id)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-label-lg font-semibold whitespace-nowrap transition-colors",
                      on ? "bg-espresso text-milk shadow-sm" : "bg-oat text-ink hover:bg-oat-deep"
                    )}
                  >
                    <Icon className="size-4" />
                    {c.label}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-label-sm",
                        on ? "bg-milk/20 text-milk" : "bg-oat-deeper text-ink-soft"
                      )}
                    >
                      {c.count}
                    </span>
                  </a>
                )
              })}
            </nav>
            <div className="relative w-72">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roasts, botanicals, treats…"
                className="h-9 rounded-full border-transparent bg-oat pl-9 focus-visible:border-amber-bright"
              />
            </div>
          </div>
          <div className="relative md:hidden">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roasts, botanicals, treats…"
              className="h-9 rounded-full border-transparent bg-oat pl-9"
            />
          </div>
          <div className="hidden">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-3 py-1 text-label-sm font-bold tracking-wide whitespace-nowrap transition-colors",
                  filter === f ? "bg-amber-soft text-[#2e1500] shadow-sm" : "bg-oat text-ink hover:bg-oat-deep"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-8 md:px-6 md:py-10">
        {!filtering ? (
          <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Limited Harvest Edition</span>
                <h2 className="mt-1 font-serif text-headline-sm text-ink sm:text-headline-md">
                  Seasonal Botanicals &amp; Reserve Roasts
                </h2>
              </div>
              <span className="hidden text-body-sm text-ink-soft sm:inline">Handcrafted in micro-batches</span>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
              <ProductCard product={spotlight[0]} feature featureLabel={{ text: "Barista Choice", variant: "dark" }} />
              <ProductCard product={spotlight[1]} feature featureLabel={{ text: "Autumn Special", variant: "amber" }} />
            </div>
          </section>
        ) : null}

        {categories.map((c) => {
          const items = visible.filter((p) => p.category === c.id)
          if (items.length === 0) return null
          const lead = c.id === "coffee"
          return (
            <section key={c.id} id={`${c.id}-section`} className="flex scroll-mt-44 flex-col gap-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <span className="flex items-center gap-1 eyebrow">
                    {lead ? <Flame className="size-3.5" /> : null}
                    {c.eyebrow}
                  </span>
                  <h2
                    className={cn(
                      "mt-1 font-serif text-ink",
                      lead ? "text-headline-lg-sm md:text-headline-lg" : "text-headline-sm sm:text-headline-md"
                    )}
                  >
                    {c.title}
                  </h2>
                </div>
                {c.note ? <span className="hidden text-body-sm text-ink-soft sm:inline">{c.note}</span> : null}
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          )
        })}

        {visible.length === 0 ? (
          <div className="rounded-2xl bg-oat p-10 text-center">
            <p className="font-serif text-headline-sm text-ink">Nothing brewing for that search</p>
            <p className="mt-1 text-body-md text-ink-soft">Try another tasting note, or clear the filter.</p>
          </div>
        ) : null}
      </div>
    </>
  )
}
