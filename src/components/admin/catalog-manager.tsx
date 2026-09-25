"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Camera,
  ChevronRight,
  CirclePlus,
  Download,
  Eye,
  FileSpreadsheet,
  NotebookPen,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { AddItemSheet } from "@/components/admin/add-item-sheet"
import { Panel } from "@/components/admin/blocks"
import { Tag } from "@/components/shop/tag"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { catalog, isCustom, useAllProducts, type CustomProduct } from "@/lib/catalog"
import { categories, formatPrice, products, type CategoryId, type Product } from "@/lib/data"
import { cn } from "@/lib/utils"

type Row = { slug: string; price: number; live: boolean; cost: number }

const modifierGroups = [
  "Alternative Milks (Oat, Almond, Macadamia)",
  "Sweetness Scale (0%, 25%, 50%, 100%)",
  "Espresso Roast Swap (Decaf Sugarcane)",
]

export function CatalogManager() {
  const [rows, setRows] = useState<Record<string, Row>>(() =>
    Object.fromEntries(
      products.map((p, i) => [p.slug, { slug: p.slug, price: p.price, live: p.slug !== "basque-burnt-cheesecake", cost: 16 + ((i * 7) % 14) + 0.4 }])
    )
  )
  const [tab, setTab] = useState<CategoryId>("coffee")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("All (Active & 86'd)")
  const [selected, setSelected] = useState<string | null>("honey-cinnamon-oat-latte")
  const [draft, setDraft] = useState<{ price: string; live: boolean; mods: string[] } | null>({
    price: "6.25",
    live: true,
    mods: [...modifierGroups],
  })
  const [adding, setAdding] = useState(false)
  const [sheetKey, setSheetKey] = useState(0)
  const all = useAllProducts()

  // Built-in items keep their state here; admin-created items persist theirs in the catalog store.
  const rowFor = (p: Product): Row =>
    isCustom(p) ? { slug: p.slug, price: p.price, live: p.live, cost: 24.5 } : rows[p.slug]

  function saveRow(p: Product, patch: Partial<Pick<Row, "price" | "live">>) {
    if (isCustom(p)) catalog.update(p.slug, patch)
    else setRows((r) => ({ ...r, [p.slug]: { ...r[p.slug], ...patch } }))
  }

  function openAdd() {
    setSheetKey((k) => k + 1)
    setAdding(true)
  }

  function onCreated(item: CustomProduct) {
    setTab(item.category)
    setQuery("")
    setStatus("All (Active & 86'd)")
    setSelected(item.slug)
    setDraft({ price: item.price.toFixed(2), live: item.live, mods: [...modifierGroups] })
  }

  function removeItem(p: CustomProduct) {
    catalog.remove(p.slug)
    setSelected(null)
    toast.success(`${p.name} removed from the menu`)
  }

  const list = useMemo(
    () =>
      all.filter((p) => {
        const live = isCustom(p) ? p.live : rows[p.slug].live
        return (
          p.category === tab &&
          p.name.toLowerCase().includes(query.toLowerCase()) &&
          (status.startsWith("All") || (status === "Active" ? live : !live))
        )
      }),
    [all, tab, query, status, rows]
  )

  const current = selected ? all.find((p) => p.slug === selected) : null

  function select(slug: string) {
    const p = all.find((x) => x.slug === slug)
    if (!p) return
    const row = rowFor(p)
    setSelected(slug)
    setDraft({ price: row.price.toFixed(2), live: row.live, mods: [...modifierGroups] })
  }

  function push() {
    if (!current || !draft) return
    const price = Number.parseFloat(draft.price)
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid base price")
      return
    }
    saveRow(current, { price, live: draft.live })
    toast.success(`${current.name} pushed to POS`, { description: `${formatPrice(price)} · ${draft.live ? "Live" : "86'd"}` })
  }

  const liveCount = all.filter((p) => rowFor(p).live).length

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <AddItemSheet key={sheetKey} open={adding} onOpenChange={setAdding} defaultCategory={tab} onCreated={onCreated} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">
                Store Menu Operations • <span className="text-ink-soft normal-case tracking-normal">Active Barista POS & Online Store Sync</span>
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-oat px-2.5 py-0.5 text-label-md text-ink">
                <span className="size-1.5 rounded-full bg-forest" /> Square POS API: Synchronized (2m ago)
              </p>
              <h1 className="mt-3 font-serif text-headline-lg-sm text-ink md:text-headline-lg">
                Artisanal Beverage &amp; Provisions Catalog
              </h1>
              <p className="mt-2 text-body-md text-ink-soft">
                Curate seasonal extractions, assign roast-batch flavor profiles, and monitor real-time kitchen inventory
                states across downtown bar stations.
              </p>
            </div>
            <Button className="h-10 w-fit gap-2 rounded-lg px-4 hover:bg-amber" onClick={openAdd}>
              <CirclePlus className="size-4" /> Add New Menu Item
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Live Menu SKUs", value: String(liveCount + 29), foot: "4 Seasonal active", tone: "text-forest" },
              { label: "Daily Units Dispensed", value: "345", foot: "82% of day avg", tone: "text-amber" },
              { label: "Stock Alert States", value: "1 Critical", foot: "Basque Cheesecake (4 left)", tone: "text-danger" },
              { label: "86'd / Paused", value: `${all.length - liveCount} Item${all.length - liveCount === 1 ? "" : "s"}`, foot: "Auto-resets 06:00 AM", tone: "text-amber" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-3 ring-1 ring-border">
                <p className="text-label-md text-ink-soft">{s.label}</p>
                <p className={cn("mt-1 font-serif text-headline-sm", s.label.startsWith("Stock") ? "text-danger" : "text-ink")}>{s.value}</p>
                <p className={cn("text-label-sm font-semibold", s.tone)}>{s.foot}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel tone="dark" className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <p className="eyebrow text-amber-glow">Menu Utilities</p>
            <span className="rounded-md bg-milk/10 px-2 py-0.5 text-label-sm">v3.4 Roastery</span>
          </div>
          <h2 className="font-serif text-headline-sm">Batch Modifications</h2>
          <p className="text-body-sm text-milk/75">
            Execute immediate global price recalibrations or curate origin tasting cards.
          </p>
          {[
            { icon: FileSpreadsheet, title: "Bulk Price Adjustment", sub: "Oat milk, single origins (+10%)" },
            { icon: NotebookPen, title: "Tasting Notes Editor", sub: "Sync SCA wheel tags to POS cards" },
          ].map(({ icon: Icon, title, sub }) => (
            <button
              key={title}
              type="button"
              onClick={() => toast(title)}
              className="flex items-center gap-3 rounded-xl bg-milk/10 p-3 text-left transition-colors hover:bg-milk/15"
            >
              <Icon className="size-5 text-amber-glow" />
              <span className="flex-1">
                <span className="block text-label-lg">{title}</span>
                <span className="block text-label-sm text-milk/70">{sub}</span>
              </span>
              <ChevronRight className="size-4" />
            </button>
          ))}
          <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
            <Button variant="secondary" size="sm" className="gap-1.5 bg-milk/10 text-milk hover:bg-milk/20">
              <Download className="size-3.5" /> Export CSV
            </Button>
            <Button variant="secondary" size="sm" className="bg-milk/10 text-milk hover:bg-milk/20">
              Import Catalog
            </Button>
          </div>
        </Panel>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setTab(c.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-label-lg font-semibold whitespace-nowrap transition-colors",
              tab === c.id ? "bg-espresso text-milk" : "bg-oat text-ink hover:bg-oat-deep"
            )}
          >
            {c.label}
            <span className={cn("rounded-full px-1.5 text-label-sm", tab === c.id ? "bg-milk/20" : "bg-oat-deeper text-ink-soft")}>
              {all.filter((p) => p.category === c.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-oat-light p-2 ring-1 ring-espresso/5 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter products by title, roast origin, harvest lot, modifier…"
            className="h-10 rounded-xl border-transparent bg-white pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => v && setStatus(v as string)}>
          <SelectTrigger className="h-10 w-full rounded-xl border-0 bg-white text-label-md md:w-56">
            <span className="text-ink-soft">Status:</span> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All (Active & 86'd)", "Active", "86'd"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon-lg" className="max-md:hidden" aria-label="Reset filters" onClick={() => { setQuery(""); setStatus("All (Active & 86'd)") }}>
          <RotateCcw />
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="overflow-hidden rounded-3xl bg-white shadow-warm ring-1 ring-espresso/5">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-label-sm uppercase">Menu Item</TableHead>
                <TableHead className="text-label-sm uppercase max-sm:hidden">Profile</TableHead>
                <TableHead className="text-right text-label-sm uppercase">Price</TableHead>
                <TableHead className="pr-4 text-right text-label-sm uppercase">Live</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map((p) => {
                const row = rowFor(p)
                return (
                  <TableRow
                    key={p.slug}
                    onClick={() => select(p.slug)}
                    data-state={selected === p.slug ? "selected" : undefined}
                    className="cursor-pointer hover:bg-oat-light data-[state=selected]:bg-amber-soft/30"
                  >
                    <TableCell className="py-3 pl-4">
                      <div className="flex items-center gap-3">
                        <Image src={p.image} alt="" width={48} height={48} className="size-12 rounded-xl object-cover" />
                        <div className="min-w-0">
                          <p className="flex items-center gap-1.5 text-title-md text-ink">
                            <span className="truncate">{p.name}</span>
                            {isCustom(p) ? <Tag tone="forest">New</Tag> : null}
                          </p>
                          <p className="text-label-sm text-amber">{p.kicker}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-sm:hidden">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((t) => (
                          <Tag key={t.label} tone={t.tone}>
                            {t.label}
                          </Tag>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-title-md tabular">{formatPrice(row.price)}</TableCell>
                    <TableCell className="pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={row.live}
                        onCheckedChange={(live) => {
                          saveRow(p, { live })
                          if (selected === p.slug) setDraft((d) => (d ? { ...d, live } : d))
                        }}
                        className="data-checked:bg-forest"
                        aria-label={`${p.name} visible`}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
              {list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-body-md text-ink-soft">
                    No items match these filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        {current && draft ? (
          <aside className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-warm-lg ring-1 ring-espresso/5 xl:sticky xl:top-24">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Live Operational Quick-Edit</p>
                <h2 className="mt-0.5 font-serif text-headline-sm text-ink">{current.name}</h2>
              </div>
              <Button variant="ghost" size="icon-sm" className="rounded-full bg-oat" aria-label="Close editor" onClick={() => setSelected(null)}>
                <X />
              </Button>
            </div>
            <div className="relative h-36 overflow-hidden rounded-2xl">
              <Image src={current.image} alt="" fill sizes="384px" className="object-cover" />
              <button type="button" className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-espresso/80 to-transparent p-3 text-label-lg text-milk">
                <Camera className="size-4" /> Update POS Hero Image
              </button>
            </div>
            <Label className="flex items-center gap-3 rounded-xl bg-oat-light p-3 font-normal">
              <Eye className="size-4 text-amber" />
              <span className="flex-1">
                <span className="block text-title-md text-ink">Store Visibility</span>
                <span className="block text-body-sm text-ink-soft">Live on Web & Aura Mobile App</span>
              </span>
              <Switch checked={draft.live} onCheckedChange={(live) => setDraft({ ...draft, live })} className="data-checked:bg-forest" />
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-oat-light p-3">
                <Label htmlFor="base-price" className="text-label-md text-ink-soft">
                  Base Price ($)
                </Label>
                <Input
                  id="base-price"
                  inputMode="decimal"
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  className="mt-1.5 h-9 bg-white text-title-md tabular focus-visible:border-amber-bright"
                />
              </div>
              <div className="rounded-xl bg-oat-light p-3">
                <p className="text-label-md text-ink-soft">Target Food Cost</p>
                <p className="mt-2.5 text-title-lg text-forest tabular">{rowFor(current).cost.toFixed(1)}%</p>
              </div>
            </div>
            <div>
              <p className="eyebrow">Extraction Spec (Synesso MVP)</p>
              <dl className="mt-2 divide-y divide-border rounded-xl bg-oat-light text-label-md">
                {[
                  ["Pressure Profile", "9.2 Bar Flat (Pre-infuse 4s)"],
                  ["Dry Dose / Wet Yield", "19.5g In / 42.0g Out (27s)"],
                  ["Active Bean Hopper", "Colombia Pink Bourbon (Lot 4B)"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2 px-3 py-2">
                    <dt className="text-ink-soft">{k}</dt>
                    <dd className={cn("text-right text-ink", k.startsWith("Active") && "text-amber")}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="eyebrow">Active Modifier Groups</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {modifierGroups.map((m) => (
                  <Label key={m} className="flex cursor-pointer items-center justify-between gap-2 rounded-lg bg-oat-light px-3 py-2 text-body-sm font-normal">
                    {m}
                    <Checkbox
                      checked={draft.mods.includes(m)}
                      onCheckedChange={(on) =>
                        setDraft({ ...draft, mods: on ? [...draft.mods, m] : draft.mods.filter((x) => x !== m) })
                      }
                      className="data-checked:border-amber data-checked:bg-amber"
                    />
                  </Label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={push} className="h-10 flex-1 gap-2 rounded-lg hover:bg-amber">
                <RefreshCw className="size-4" /> Push Changes to POS
              </Button>
              <Button variant="secondary" className="h-10 rounded-lg" onClick={() => select(current.slug)}>
                Discard
              </Button>
            </div>
            {isCustom(current) ? (
              <Button
                variant="ghost"
                className="h-9 gap-1.5 rounded-lg text-danger hover:bg-danger-soft hover:text-danger"
                onClick={() => removeItem(current)}
              >
                <Trash2 className="size-4" /> Remove item from menu
              </Button>
            ) : null}
          </aside>
        ) : (
          <div className="rounded-3xl border border-dashed border-espresso/15 p-8 text-center text-body-md text-ink-soft">
            Select a menu item to open the live quick-edit panel.
          </div>
        )}
      </div>
    </div>
  )
}
