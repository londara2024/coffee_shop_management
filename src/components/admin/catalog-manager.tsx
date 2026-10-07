"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import {
  Camera,
  CirclePlus,
  Download,
  Eye,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { AddItemSheet } from "@/components/admin/add-item-sheet"
import { Panel } from "@/components/admin/blocks"
import { ImportCatalogSheet } from "@/components/admin/import-catalog-sheet"
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
import { defaultToppings as STANDARD_TOPPINGS } from "@/components/shop/product-configurator"

type Row = {
  slug: string
  price: number
  sizePrices?: [number, number, number]
  toppings?: Product["toppings"]
  live: boolean
}

export function CatalogManager() {
  const [rows, setRows] = useState<Record<string, Row>>(() =>
    Object.fromEntries(
      products.map((p) => [
        p.slug,
        { slug: p.slug, price: p.price, sizePrices: p.sizePrices, toppings: p.toppings, live: p.slug !== "basque-burnt-cheesecake" },
      ])
    )
  )
  const [tab, setTab] = useState<CategoryId>("coffee")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("ទាំងអស់ (កំពុងលក់ & ដកចេញ)")
  const [selected, setSelected] = useState<string | null>("honey-cinnamon-oat-latte")
  const [draft, setDraft] = useState<{ size1: string; size2: string; size3: string; live: boolean; mods: string[] } | null>({
    size1: "",
    size2: "6.25",
    size3: "",
    live: true,
    mods: [],
  })
  const [adding, setAdding] = useState(false)
  const [sheetKey, setSheetKey] = useState(0)
  const [importing, setImporting] = useState(false)
  const all = useAllProducts()

  // Built-in items keep their state here; admin-created items persist theirs in the catalog store.
  const rowFor = (p: Product): Row =>
    isCustom(p) ? { slug: p.slug, price: p.price, sizePrices: p.sizePrices, toppings: p.toppings, live: p.live } : rows[p.slug]

  function saveRow(p: Product, patch: Partial<Pick<Row, "price" | "sizePrices" | "toppings" | "live">>) {
    if (isCustom(p)) catalog.update(p.slug, patch)
    else setRows((r) => ({ ...r, [p.slug]: { ...r[p.slug], ...patch } }))
  }

  function draftFromRow(row: Row) {
    return {
      size1: row.sizePrices?.[0] ? row.sizePrices[0].toFixed(2) : "",
      size2: row.price.toFixed(2),
      size3: row.sizePrices?.[2] ? row.sizePrices[2].toFixed(2) : "",
      live: row.live,
      mods: row.toppings?.map((t) => t.id) ?? [],
    }
  }

  function openAdd() {
    setSheetKey((k) => k + 1)
    setAdding(true)
  }

  function onCreated(item: CustomProduct) {
    setTab(item.category)
    setQuery("")
    setStatus("ទាំងអស់ (កំពុងលក់ & ដកចេញ)")
    setSelected(item.slug)
    setDraft(draftFromRow(rowFor(item)))
  }

  function removeItem(p: CustomProduct) {
    catalog.remove(p.slug)
    setSelected(null)
    toast.success(`បានដក ${p.nameKm ?? p.name} ចេញពីម៉ឺនុយ`)
  }

  const list = useMemo(
    () =>
      all.filter((p) => {
        const live = isCustom(p) ? p.live : rows[p.slug].live
        return (
          p.category === tab &&
          p.name.toLowerCase().includes(query.toLowerCase()) &&
          (status.startsWith("ទាំងអស់") || (status === "កំពុងលក់" ? live : !live))
        )
      }),
    [all, tab, query, status, rows]
  )

  const current = selected ? all.find((p) => p.slug === selected) : null

  function select(slug: string) {
    const p = all.find((x) => x.slug === slug)
    if (!p) return
    setSelected(slug)
    setDraft(draftFromRow(rowFor(p)))
  }

  function push() {
    if (!current || !draft) return
    const price = Number.parseFloat(draft.size2)
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("សូមបញ្ចូលតម្លៃទំហំធម្មតាឲ្យត្រឹមត្រូវ")
      return
    }
    const sizeNums: [number, number, number] = [Number(draft.size1) || 0, price, Number(draft.size3) || 0]
    const sizePrices = sizeNums.some(Boolean) ? sizeNums : undefined
    const toppings = draft.mods.length ? STANDARD_TOPPINGS.filter((t) => draft.mods.includes(t.id)) : undefined
    saveRow(current, { price, sizePrices, toppings, live: draft.live })
    toast.success(`បានផ្ញើ ${current.nameKm ?? current.name} ទៅកាន់ម៉ាស៊ីនគិតលុយ (POS)`, { description: `${formatPrice(price)} · ${draft.live ? "កំពុងបង្ហាញ" : "ដកចេញ"}` })
  }

  const liveCount = all.filter((p) => rowFor(p).live).length

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <AddItemSheet key={sheetKey} open={adding} onOpenChange={setAdding} defaultCategory={tab} onCreated={onCreated} />
      <ImportCatalogSheet open={importing} onOpenChange={setImporting} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">
                ប្រតិបត្តិការម៉ឺនុយហាង • <span className="text-ink-soft normal-case tracking-normal">ធ្វើសមកាលកម្មជាមួយ POS បារិស្តា និងហាងអនឡាញ</span>
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-oat px-2.5 py-0.5 text-label-md text-ink">
                <span className="size-1.5 rounded-full bg-forest" /> Square POS API៖ បានធ្វើសមកាលកម្ម (២នាទីមុន)
              </p>
              <h1 className="mt-3 font-serif text-headline-lg-sm text-ink md:text-headline-lg">
                កាតាឡុកភេសជ្ជៈ និងម្ហូបអាហារ
              </h1>
              <p className="mt-2 text-body-md text-ink-soft">
                រៀបចំភេសជ្ជៈ កំណត់ទម្រង់រសជាតិតាមឡុតដុត និងតាមដានស្តុកសម្ភារៈផ្ទះបាយជាក់ស្តែង។
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "ទំនិញកំពុងលក់", value: String(liveCount + 29), foot: "៤ ធាតុតាមរដូវកំពុងលក់", tone: "text-forest" },
              { label: "ចំនួនលក់បានប្រចាំថ្ងៃ", value: "345", foot: "៨២% នៃមធ្យមភាគប្រចាំថ្ងៃ", tone: "text-amber" },
              { label: "ស្តុកជិតអស់", value: "១ ធ្ងន់ធ្ងរ", foot: "នំឈីសបាស្ក (នៅសល់ ៤)", tone: "text-danger" },
              { label: "ដកចេញ / ផ្អាក", value: `ធាតុចំនួន ${all.length - liveCount}`, foot: "កំណត់ឡើងវិញស្វ័យប្រវត្តិម៉ោង ៦:០០ ព្រឹក", tone: "text-amber" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-3 ring-1 ring-border">
                <p className="text-label-md text-ink-soft">{s.label}</p>
                <p className={cn("mt-1 font-serif text-headline-sm", s.label.startsWith("ស្តុក") ? "text-danger" : "text-ink")}>{s.value}</p>
                <p className={cn("text-label-sm font-semibold", s.tone)}>{s.foot}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel tone="dark" className="flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <p className="eyebrow text-amber-glow">ឧបករណ៍ម៉ឺនុយ</p>
            <span className="rounded-md bg-milk/10 px-2 py-0.5 text-label-sm">v3.4 Roastery</span>
          </div>
          <h2 className="font-serif text-headline-sm">ទំនិញតាមប្រភេទ</h2>
          <p className="text-body-sm text-milk/75">ចំនួនទំនិញកំពុងបង្ហាញក្នុងម៉ឺនុយ សម្រាប់ប្រភេទនីមួយៗ។</p>
          <div className="flex flex-col gap-2.5">
            {categories.map((c) => {
              const count = all.filter((p) => p.category === c.id).length
              const max = Math.max(...categories.map((cc) => all.filter((p) => p.category === cc.id).length), 1)
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 truncate text-label-sm text-milk/75">{c.labelKm ?? c.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-milk/10">
                    <div className="h-full rounded-full bg-amber-glow" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                  <span className="w-6 shrink-0 text-right text-label-sm font-semibold tabular">{count}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2 pt-2">
            <Button variant="secondary" size="sm" className="gap-1.5 bg-milk/10 text-milk hover:bg-milk/20">
              <Download className="size-3.5" /> នាំចេញ CSV
            </Button>
            <Button variant="secondary" size="sm" className="bg-milk/10 text-milk hover:bg-milk/20" onClick={() => setImporting(true)}>
              នាំចូលកាតាឡុក
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
            {c.labelKm ?? c.label}
            <span className={cn("rounded-full px-1.5 text-label-sm", tab === c.id ? "bg-milk/20" : "bg-oat-deeper text-ink-soft")}>
              {all.filter((p) => p.category === c.id).length}
            </span>
          </button>
        ))}
        <Button className="ml-auto h-auto shrink-0 gap-2 rounded-full px-4 py-2 text-label-lg font-semibold hover:bg-amber" onClick={openAdd}>
          <CirclePlus className="size-4" /> បន្ថែមម្ហូបថ្មី
        </Button>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-oat-light p-2 ring-1 ring-espresso/5 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ត្រងទំនិញតាមឈ្មោះ ដើមកំណើតកាហ្វេ ឡុតច្រូតកាត់ ឬជម្រើសបន្ថែម…"
            className="h-10 rounded-xl border-transparent bg-white pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => v && setStatus(v as string)}>
          <SelectTrigger className="h-10 w-full rounded-xl border-0 bg-white text-label-md md:w-56">
            <span className="text-ink-soft">ស្ថានភាព៖</span> <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["ទាំងអស់ (កំពុងលក់ & ដកចេញ)", "កំពុងលក់", "ដកចេញ"].map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon-lg" className="max-md:hidden" aria-label="កំណត់តម្រងឡើងវិញ" onClick={() => { setQuery(""); setStatus("ទាំងអស់ (កំពុងលក់ & ដកចេញ)") }}>
          <RotateCcw />
        </Button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="overflow-hidden rounded-3xl bg-white shadow-warm ring-1 ring-espresso/5">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-4 text-label-sm uppercase">ធាតុម៉ឺនុយ</TableHead>
                <TableHead className="text-label-sm uppercase max-sm:hidden">ប្រភេទ</TableHead>
                <TableHead className="text-right text-label-sm uppercase">តម្លៃ</TableHead>
                <TableHead className="pr-4 text-right text-label-sm uppercase">បង្ហាញ</TableHead>
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
                            <span className="truncate">{p.nameKm ?? p.name}</span>
                            {isCustom(p) ? <Tag tone="forest">ថ្មី</Tag> : null}
                          </p>
                          <p className="text-label-sm text-amber">{p.kickerKm ?? p.kicker}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-sm:hidden">
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((t) => (
                          <Tag key={t.label} tone={t.tone}>
                            {t.labelKm ?? t.label}
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
                        aria-label={`${p.nameKm ?? p.name} មើលឃើញ`}
                      />
                    </TableCell>
                  </TableRow>
                )
              })}
              {list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-body-md text-ink-soft">
                    គ្មានទំនិញត្រូវនឹងតម្រងទាំងនេះទេ។
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
                <p className="eyebrow">កែសម្រួលរហ័សផ្ទាល់</p>
                <h2 className="mt-0.5 font-serif text-headline-sm text-ink">{current.nameKm ?? current.name}</h2>
              </div>
              <Button variant="ghost" size="icon-sm" className="rounded-full bg-oat" aria-label="បិទផ្ទាំងកែសម្រួល" onClick={() => setSelected(null)}>
                <X />
              </Button>
            </div>
            <div className="relative h-36 overflow-hidden rounded-2xl">
              <Image src={current.image} alt="" fill sizes="384px" className="object-cover" />
              <button type="button" className="absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-gradient-to-t from-espresso/80 to-transparent p-3 text-label-lg text-milk">
                <Camera className="size-4" /> ដូររូបភាពមេលើ POS
              </button>
            </div>
            <Label className="flex items-center gap-3 rounded-xl bg-oat-light p-3 font-normal">
              <Eye className="size-4 text-amber" />
              <span className="flex-1">
                <span className="block text-title-md text-ink">ភាពមើលឃើញលើហាង</span>
                <span className="block text-body-sm text-ink-soft">មើលឃើញនៅលើគេហទំព័រ និងកម្មវិធីទូរស័ព្ទ Aura</span>
              </span>
              <Switch checked={draft.live} onCheckedChange={(live) => setDraft({ ...draft, live })} className="data-checked:bg-forest" />
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-oat-light p-3">
                <Label htmlFor="size-price-1" className="text-label-md text-ink-soft">
                  តម្លៃទំហំតូច
                </Label>
                <Input
                  id="size-price-1"
                  inputMode="decimal"
                  value={draft.size1}
                  onChange={(e) => setDraft({ ...draft, size1: e.target.value.replace(/[^0-9.]/g, "") })}
                  placeholder="6.00"
                  className="mt-1.5 h-9 bg-white text-title-md tabular focus-visible:border-amber-bright"
                />
              </div>
              <div className="rounded-xl bg-oat-light p-3">
                <Label htmlFor="size-price-2" className="text-label-md text-ink-soft">
                  តម្លៃទំហំធម្មតា
                </Label>
                <Input
                  id="size-price-2"
                  inputMode="decimal"
                  value={draft.size2}
                  onChange={(e) => setDraft({ ...draft, size2: e.target.value.replace(/[^0-9.]/g, "") })}
                  className="mt-1.5 h-9 bg-white text-title-md tabular focus-visible:border-amber-bright"
                />
              </div>
              <div className="rounded-xl bg-oat-light p-3">
                <Label htmlFor="size-price-3" className="text-label-md text-ink-soft">
                  តម្លៃទំហំធំ
                </Label>
                <Input
                  id="size-price-3"
                  inputMode="decimal"
                  value={draft.size3}
                  onChange={(e) => setDraft({ ...draft, size3: e.target.value.replace(/[^0-9.]/g, "") })}
                  placeholder="7.00"
                  className="mt-1.5 h-9 bg-white text-title-md tabular focus-visible:border-amber-bright"
                />
              </div>
            </div>
            <div>
              <p className="eyebrow">គ្រឿងលម្អ និងសារធាតុបន្ថែម</p>
              <div className="mt-2 flex flex-col gap-1.5">
                {STANDARD_TOPPINGS.map((t) => {
                  const checked = draft.mods.includes(t.id)
                  return (
                    <Label
                      key={t.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-body-sm font-normal",
                        checked ? "bg-amber-soft/40" : "bg-oat-light hover:bg-oat"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(on) =>
                          setDraft({ ...draft, mods: on ? [...draft.mods, t.id] : draft.mods.filter((x) => x !== t.id) })
                        }
                        className="data-checked:border-amber data-checked:bg-amber"
                      />
                      <span className="flex-1 text-ink">{t.labelKm ?? t.label}</span>
                      <span className="text-label-sm font-bold text-amber">{t.delta ? `+${formatPrice(t.delta)}` : "រួមបញ្ចូល"}</span>
                    </Label>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={push} className="h-10 flex-1 gap-2 rounded-lg hover:bg-amber">
                <RefreshCw className="size-4" /> ផ្ញើការផ្លាស់ប្តូរទៅ POS
              </Button>
              <Button variant="secondary" className="h-10 rounded-lg" onClick={() => select(current.slug)}>
                លុបចោល
              </Button>
            </div>
            {isCustom(current) ? (
              <Button
                variant="ghost"
                className="h-9 gap-1.5 rounded-lg text-danger hover:bg-danger-soft hover:text-danger"
                onClick={() => removeItem(current)}
              >
                <Trash2 className="size-4" /> ដកទំនិញចេញពីម៉ឺនុយ
              </Button>
            ) : null}
          </aside>
        ) : (
          <div className="rounded-3xl border border-dashed border-espresso/15 p-8 text-center text-body-md text-ink-soft">
            ជ្រើសរើសទំនិញមួយ ដើម្បីបើកផ្ទាំងកែសម្រួលរហ័ស។
          </div>
        )}
      </div>
    </div>
  )
}
