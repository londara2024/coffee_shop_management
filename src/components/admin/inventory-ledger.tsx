"use client"

import { useState } from "react"
import Image from "next/image"
import {
  BellRing,
  Check,
  CircleAlert,
  ClipboardCheck,
  Clock,
  CupSoda,
  Download,
  FilePlus2,
  Flower2,
  Milk,
  Package,
  Recycle,
  Search,
  Send,
  Sprout,
  Thermometer,
  Truck,
  Wheat,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { toast } from "sonner"

import { Meter, PageHeader, Panel } from "@/components/admin/blocks"
import { CreatePoSheet, type PoLine } from "@/components/admin/create-po-sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCustomMaterials } from "@/lib/inventory-store"
import { cn } from "@/lib/utils"

type State = "low" | "critical" | "healthy" | "fresh" | "adequate"
type Group = "Single Origin Beans" | "Milk & Dairy" | "Syrups & Botanicals" | "Bakery" | "Packaging"

const items: {
  name: string
  meta: string
  group: Group
  supplier: string
  supplierNote: string
  onHand: string
  par: string
  pct: number
  state: State
  image?: string
  icon?: LucideIcon
}[] = [
  { name: "Colombian Pink Bourbon", meta: "Huila · Anaerobic Washed · Lot #248", group: "Single Origin Beans", supplier: "Finca La Esperanza", supplierNote: "ជួញដូរផ្ទាល់ បានចុះហត្ថលេខា", onHand: "14 kg", par: "/ 25 kg គោលដៅ", pct: 56, state: "low", image: "/images/green-beans.jpg" },
  { name: "Minor Figures Barista Oat", meta: "កេស Tetra Pak ស្ងួតគ្មានមេរោគ 6× 1L", group: "Milk & Dairy", supplier: "Minor Figures Dist.", supplierNote: "ខ្សែសង្វាក់ត្រជាក់ក្នុងតំបន់", onHand: "6 កេស (36L)", par: "គោលដៅ៖ 15 កេស (90L)", pct: 40, state: "critical", image: "/images/oat-milk-carton.jpg" },
  { name: "Wildflower Honey Reserve", meta: "ដកស្រង់ដោយដៃ មិនច្រោះ ច្រូតកាត់ក្នុងស្រុក (500g)", group: "Syrups & Botanicals", supplier: "Local Bee Guild", supplierNote: "Sonoma សរីរាង្គ", onHand: "18 ដប (9 kg)", par: "គោលដៅ៖ 10 ដប", pct: 100, state: "healthy", icon: Flower2 },
  { name: "Ceylon Cinnamon Bark", meta: "កិនដោយថ្ម សរីរាង្គ · ថ្នាក់ 'Alba'", group: "Syrups & Botanicals", supplier: "Spice Collective Direct", supplierNote: "ចម្ការតែមួយ Sri Lanka", onHand: "4.5 kg", par: "គោលដៅ៖ 3.0 kg", pct: 100, state: "healthy", icon: Sprout },
  { name: "Country Sourdough Batards", meta: "ដម្កល់ត្រជាក់ 48 ម៉ោង · ដុតស្រស់រាល់ថ្ងៃ", group: "Bakery", supplier: "Heritage Bakehouse", supplierNote: "បញ្ជាទិញប្រចាំថ្ងៃ", onHand: "12 ដុំ", par: "គោលដៅ៖ 10 ដុំ", pct: 100, state: "fresh", icon: Wheat },
  { name: "12oz & 16oz Compostable Cups", meta: "ជាតិសរសៃឫស្សី ស្រោបជាមួយ PLA ស្នាមឡូហ្គោចាំង", group: "Packaging", supplier: "EcoWare Global", supplierNote: "បានទទួលវិញ្ញាបនបត្រ B-Corp", onHand: "850 ឯកតា", par: "គោលដៅ៖ 1,000 ឯកតា", pct: 85, state: "adequate", icon: CupSoda },
]

const stateStyle: Record<State, { label: string; cls: string; tone: "danger" | "forest" | "amber" | "glow" }> = {
  low: { label: "ស្តុកទាប", cls: "bg-danger-soft text-danger", tone: "danger" },
  critical: { label: "ត្រូវបញ្ជាទិញបន្ទាន់", cls: "bg-danger-soft text-danger", tone: "danger" },
  healthy: { label: "ស្តុកគ្រប់គ្រាន់", cls: "bg-forest-soft text-forest", tone: "forest" },
  fresh: { label: "ស្រស់ម៉ោង 6:00 AM", cls: "bg-oat text-ink-soft", tone: "forest" },
  adequate: { label: "ល្មម", cls: "bg-oat text-ink-soft", tone: "glow" },
}

const groups: ("All Inventory" | Group)[] = ["All Inventory", "Single Origin Beans", "Milk & Dairy", "Syrups & Botanicals", "Bakery", "Packaging"]
const suppliers = ["All Suppliers (Direct & Dist.)", "Direct-Trade Only", "Distributors"]

/** Khmer display labels, keyed by the English value which stays the internal identity/filter state. */
const groupLabel: Record<"All Inventory" | Group, string> = {
  "All Inventory": "ស្តុកទាំងអស់",
  "Single Origin Beans": "គ្រាប់កាហ្វេប្រភពដើមតែមួយ",
  "Milk & Dairy": "ទឹកដោះគោ",
  "Syrups & Botanicals": "ទឹកស៊ីរ៉ូ និងសារធាតុរុក្ខជាតិ",
  Bakery: "នំបុ័ង",
  Packaging: "គ្រឿងវេចខ្ចប់",
}
const supplierLabel: Record<string, string> = {
  "All Suppliers (Direct & Dist.)": "អ្នកផ្គត់ផ្គង់ទាំងអស់ (ផ្ទាល់ & អ្នកចែកចាយ)",
  "Direct-Trade Only": "ជួញដូរផ្ទាល់ប៉ុណ្ណោះ",
  Distributors: "អ្នកចែកចាយ",
}

const initialPo: PoLine[] = [
  { name: "Minor Figures Barista Oat (12cs)", vendor: "អ្នកផ្គត់ផ្គង់៖ Minor Figures Dist.", price: 336 },
  { name: "House Espresso Blend Green (20kg)", vendor: "អ្នកផ្គត់ផ្គង់៖ Aura Central Roastery Lot #91", price: 304 },
]

export function InventoryLedger() {
  const [group, setGroup] = useState<(typeof groups)[number]>("All Inventory")
  const [query, setQuery] = useState("")
  const [supplier, setSupplier] = useState(suppliers[0])
  const [approved, setApproved] = useState(false)
  const [po, setPo] = useState<PoLine[]>(initialPo)
  const [createPoOpen, setCreatePoOpen] = useState(false)
  const customMaterials = useCustomMaterials()

  const shown = items.filter(
    (i) =>
      (group === "All Inventory" || i.group === group) &&
      `${i.name} ${i.meta} ${i.supplier}`.toLowerCase().includes(query.toLowerCase()) &&
      (supplier === suppliers[0] || (supplier === "Direct-Trade Only" ? /direct/i.test(i.supplierNote + i.supplier) : !/direct/i.test(i.supplierNote + i.supplier)))
  )
  const poTotal = po.reduce((n, p) => n + p.price, 0)

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        eyebrow="ប្រតិបត្តិការហាងកាហ្វេ › ខ្សែសង្វាក់ផ្គត់ផ្គង់ និងឃ្លាំងសម្ភារៈរុក្ខជាតិ"
        title="ស្តុក និងសារពើភ័ណ្ឌឃ្លាំង"
        actions={
          <>
            <Badge variant="secondary" className="h-8 rounded-full bg-oat px-3 text-label-md">
              ធ្វើសមកាលកម្មផ្ទាល់៖ 4 នាទីមុន
            </Badge>
            <Button variant="secondary" className="h-9 gap-1.5 rounded-lg bg-oat">
              <ClipboardCheck className="size-4 text-amber" /> ត្រួតពិនិត្យកម្រិតគោលដៅស្តុក
            </Button>
            <Button variant="secondary" className="h-9 gap-1.5 rounded-lg bg-oat">
              <Download className="size-4 text-amber" /> នាំចេញ CSV
            </Button>
            <Button className="h-9 gap-1.5 rounded-lg px-4 hover:bg-amber" onClick={() => setCreatePoOpen(true)}>
              <FilePlus2 className="size-4" /> បង្កើតលិខិតបញ្ជាទិញ
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Package, chip: "ស្តុកបម្រុង 3 ថ្ងៃ", chipCls: "bg-amber-soft/70 text-amber", value: "184", unit: "គីឡូក្រាមសរុប", sub: "គ្រាប់ឆៅ៖ 110 kg · ឃ្លាំងគ្រាប់ដុត៖ 74 kg", pct: 62, tone: "amber" as const, a: "អត្រាប្រើប្រាស់បច្ចុប្បន្ន", b: "ជាមធ្យម 28 kg/ថ្ងៃ" },
          { icon: Milk, chip: "អូតបន្ទាន់", chipCls: "bg-danger-soft text-danger", value: "92", unit: "កេស", sub: "Minor Figures Oat: 36L · Clover Whole: 56L", pct: 28, tone: "danger" as const, a: "ហានិភ័យអស់ស្តុកអូត", b: "អស់ស្តុកក្នុងប្រមាណ 18 ម៉ោង" },
          { icon: Recycle, chip: "ល្អប្រសើរ 88%", chipCls: "bg-forest-soft text-forest", value: "1,420", unit: "ឯកតា", sub: "កែវ 12oz, 16oz និងគម្របអំពៅ", pct: 88, tone: "forest" as const, a: "រឹមសុវត្ថិភាព", b: "+4 ថ្ងៃបន្ថែម" },
        ].map(({ icon: Icon, ...k }) => (
          <div key={k.chip} className="flex flex-col gap-3 rounded-3xl bg-oat-light p-5 ring-1 ring-espresso/5">
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-oat-deep text-amber">
                <Icon className="size-4" />
              </span>
              <span className={cn("rounded-md px-2 py-1 text-label-sm font-bold uppercase", k.chipCls)}>{k.chip}</span>
            </div>
            <p className="flex items-baseline gap-2">
              <span className="font-serif text-headline-lg-sm text-ink tabular">{k.value}</span>
              <span className="text-body-md text-ink-soft">{k.unit}</span>
            </p>
            <p className="text-body-sm text-ink-soft">{k.sub}</p>
            <Meter value={k.pct} tone={k.tone} />
            <div className={cn("flex justify-between text-label-sm font-semibold", k.tone === "danger" ? "text-danger" : "text-ink-soft")}>
              <span>{k.a}</span>
              <span>{k.b}</span>
            </div>
          </div>
        ))}
        <div className="hidden flex-col gap-3 rounded-3xl bg-gradient-to-br from-amber-soft/60 to-oat-light p-5 ring-1 ring-amber-bright/20">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-lg bg-amber text-white">
              <BellRing className="size-4" />
            </span>
            <span className="rounded-md bg-amber-soft px-2 py-1 text-label-sm font-bold text-amber uppercase">ត្រូវការសកម្មភាព</span>
          </div>
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-headline-lg-sm text-ink">3</span>
            <span className="text-title-md text-ink">ធាតុរង់ចាំលិខិតបញ្ជាទិញ</span>
          </p>
          <p className="text-body-sm text-ink-soft">គ្រាប់ Huila, អូតបារីស្តា, ស៊ីលកែវត្រជាក់</p>
          <Button size="sm" className="mt-auto gap-1.5 bg-amber hover:bg-amber-bright" onClick={() => toast.success("បានបង្កើតលិខិតបញ្ជាទិញចំនួន 3")}>
            បង្កើតលិខិតបញ្ជាទិញជាបាច់ →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-2xl bg-oat-light p-3 ring-1 ring-espresso/5">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ស្វែងរកគ្រាប់ដើមតែមួយ ទឹកដោះគោ គ្រឿងវេចខ្ចប់…" className="h-10 rounded-xl border-transparent bg-white pl-9" />
              </div>
              <Select value={supplier} onValueChange={(v) => v && setSupplier(v as string)}>
                <SelectTrigger className="h-10 w-full rounded-xl border-0 bg-white text-label-md md:w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s} value={s}>
                      {supplierLabel[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {groups.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-label-md font-semibold whitespace-nowrap",
                    group === g ? "bg-espresso text-milk" : "bg-oat text-ink hover:bg-oat-deep"
                  )}
                >
                  {groupLabel[g]} ({g === "All Inventory" ? 48 : items.filter((i) => i.group === g).length})
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-warm ring-1 ring-espresso/5">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-oat-light px-4 py-4 sm:px-5">
              <h2 className="font-serif text-headline-sm text-ink">ការទិញសម្ភារៈជំនាញ &amp; បញ្ជីស្តុក</h2>
              <span className="rounded-md bg-amber-soft/70 px-2 py-0.5 text-label-md font-semibold text-amber">ធាតុសំខាន់ៗ 6 បានបន្លិច</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 text-label-sm uppercase sm:pl-5">សម្ភារៈ / SKU</TableHead>
                  <TableHead className="text-label-sm uppercase max-md:hidden">អ្នកផ្គត់ផ្គង់ &amp; ប្រភពដើម</TableHead>
                  <TableHead className="text-label-sm uppercase">ស្តុកមាន / គោលដៅ</TableHead>
                  <TableHead className="pr-4 text-right text-label-sm uppercase sm:pr-5">ស្ថានភាព</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shown.map(({ icon: Icon, ...i }) => {
                  const s = stateStyle[i.state]
                  const alert = i.state === "low" || i.state === "critical"
                  return (
                    <TableRow key={i.name} className={cn("hover:bg-oat-light", alert && "bg-danger-soft/15")}>
                      <TableCell className="py-3 pl-4 sm:pl-5">
                        <div className="flex items-center gap-3">
                          {i.image ? (
                            <Image src={i.image} alt="" width={40} height={40} className="size-10 rounded-lg object-cover" />
                          ) : Icon ? (
                            <span className="flex size-10 items-center justify-center rounded-lg bg-amber-soft/50 text-amber">
                              <Icon className="size-5" />
                            </span>
                          ) : null}
                          <div className="min-w-0 whitespace-normal">
                            <p className="text-title-md text-ink">{i.name}</p>
                            <p className="text-body-sm text-ink-soft">{i.meta}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-normal max-md:hidden">
                        <p className="text-body-sm text-ink">{i.supplier}</p>
                        <p className="text-label-sm font-bold text-amber">{i.supplierNote}</p>
                      </TableCell>
                      <TableCell className="min-w-32 whitespace-normal">
                        <p className={cn("text-label-lg", alert ? "text-danger" : "text-ink")}>{i.onHand}</p>
                        <p className="text-label-sm text-ink-soft">{i.par}</p>
                        <Meter value={i.pct} tone={s.tone} className="mt-1.5 h-1" />
                      </TableCell>
                      <TableCell className="pr-4 text-right sm:pr-5">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-label-sm font-bold whitespace-nowrap", s.cls)}>
                          {alert ? <CircleAlert className="size-3" /> : <Check className="size-3" />}
                          {s.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {shown.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-body-md text-ink-soft">
                      គ្មានធាតុស្តុកត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ។
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
            <div className="flex flex-col items-center justify-between gap-2 border-t px-4 py-3 text-label-sm text-ink-soft sm:flex-row sm:px-5">
              <span>កំពុងបង្ហាញធាតុអាទិភាពសកម្ម {shown.length} ក្នុងចំណោមធាតុស្តុកដែលបានចុះឈ្មោះសរុប 48</span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="xs" className="bg-oat">
                  មុន
                </Button>
                <span>ទំព័រ 1 នៃ 8</span>
                <Button variant="secondary" size="xs" className="bg-oat">
                  បន្ទាប់
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 2xl:grid-cols-1">
          <Panel>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="eyebrow">លិខិតបញ្ជាទិញព្រាងស្វ័យប្រវត្តិ</p>
                <p className="mt-1 text-title-lg text-ink">ការបញ្ជាទិញ #PO-2025-084</p>
              </div>
              <span className={cn("rounded-md px-2 py-0.5 text-label-md font-semibold", approved ? "bg-forest-soft text-forest" : "bg-amber-soft text-amber")}>
                {approved ? "បានផ្ញើ" : "សេចក្ដីព្រាងកំពុងរង់ចាំ"}
              </span>
            </div>
            <ul className="mt-4 divide-y divide-border rounded-2xl bg-white">
              {po.map((p) => (
                <li key={p.name} className="flex items-start justify-between gap-3 p-3">
                  <div>
                    <p className="text-title-md text-ink">{p.name}</p>
                    <p className="text-body-sm text-ink-soft">{p.vendor}</p>
                  </div>
                  <span className="text-title-md tabular">${p.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-body-md text-ink-soft">ការប្តេជ្ញាចិត្តសរុប៖</span>
              <span className="font-serif text-headline-sm text-ink tabular">${poTotal.toFixed(2)}</span>
            </div>
            <Button
              disabled={approved}
              onClick={() => {
                setApproved(true)
                toast.success("PO-2025-084 បានផ្ញើទៅអ្នកដុតគ្រាប់", { description: `$${poTotal.toFixed(2)} បានគិតទៅគណនី Flagship Operating Fund` })
              }}
              className="mt-3 h-12 w-full gap-2 rounded-xl text-title-md hover:bg-amber"
            >
              {approved ? <Check className="size-4" /> : <Send className="size-4" />}
              {approved ? "អនុម័ត និងបានផ្ញើ" : `អនុម័ត និងផ្ញើទៅអ្នកដុតគ្រាប់ ($${poTotal.toFixed(2)})`}
            </Button>
            <p className="mt-2 text-center text-label-sm text-ink-soft/70">គិតប្រាក់ពីគណនី៖ Flagship Roastery Operating Fund (#***849)</p>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-title-lg text-ink">
                <Truck className="size-5 text-amber" /> ការដឹកជញ្ជូនចូលថ្ងៃនេះ
              </p>
              <Badge className="bg-forest-soft text-forest">ត្រូវពេលវេលា</Badge>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3">
              <Clock className="size-6 text-amber" />
              <div>
                <p className="eyebrow text-ink-soft">ពេលវេលាមកដល់ប៉ាន់ស្មាន</p>
                <p className="font-serif text-headline-sm text-ink">2:00 PM ថ្ងៃនេះ</p>
                <p className="text-label-sm text-ink-soft">ក្រុមហ៊ុនដឹកជញ្ជូន៖ Metro Cold Express</p>
              </div>
            </div>
            <ol className="mt-4 flex flex-col gap-4 border-l-2 border-oat-deeper pl-5">
              {[
                { title: "បានចេញពីឃ្លាំងតំបន់", sub: "08:30 AM · បានផ្ទៀងផ្ទាត់ត្រជាក់នៅ 3.4°C", state: "done" },
                { title: "កំពុងធ្វើដំណើរ · ផ្លូវទី 4 ចូលទីក្រុង", sub: "បច្ចុប្បន្នមាន 3 ចំណតទៀត (~35 នាទី)", state: "now" },
                { title: "ការទទួលនៅច្រកចត & ការផ្ទៀងផ្ទាត់សីតុណ្ហភាព QC", sub: "កន្លែងផ្ទុកទំនិញ Flagship #1 · Elena Vasquez", state: "next" },
              ].map((s) => (
                <li key={s.title} className="relative">
                  <span
                    className={cn(
                      "absolute top-0.5 -left-[29px] flex size-4 items-center justify-center rounded-full ring-4 ring-oat-light",
                      s.state === "done" && "bg-forest text-white",
                      s.state === "now" && "bg-amber",
                      s.state === "next" && "bg-oat-deeper"
                    )}
                  >
                    {s.state === "done" ? <Check className="size-2.5" /> : null}
                  </span>
                  <p className="text-title-md text-ink">{s.title}</p>
                  <p className={cn("text-label-sm", s.state === "now" ? "font-semibold text-amber" : "text-ink-soft")}>{s.sub}</p>
                </li>
              ))}
            </ol>
            <Separator className="my-4" />
            <Button variant="secondary" className="w-full gap-1.5 bg-white" onClick={() => toast("ប្រធានវេននឹងទទួលបានការជូនដំណឹងពេលមកដល់")}>
              <BellRing className="size-4 text-amber" /> ជូនដំណឹងទៅប្រធានវេនបារីស្តាពេលមកដល់
            </Button>
          </Panel>

          <Panel className="hidden bg-oat-deep md:col-span-2 2xl:col-span-1">
            <p className="flex items-center gap-2 eyebrow">
              <Thermometer className="size-3.5" /> អាកាសធាតុឃ្លាំងផ្ទុក
            </p>
            <p className="mt-1 text-title-lg text-ink">18.2°C · សំណើមទាក់ទង 58%</p>
            <p className="mt-1 text-body-sm text-ink-soft">
              បរិយាកាសល្អបំផុតសម្រាប់ការរក្សាទុកគ្រាប់ឆៅ។ ឧបករណ៍ចាប់សញ្ញា #B-04 កំពុងដំណើរការ និងមានស្ថេរភាពសម្រាប់ធាតុគ្មានអុកស៊ីសែន។
            </p>
          </Panel>
        </div>
      </div>

      <CreatePoSheet
        open={createPoOpen}
        onOpenChange={setCreatePoOpen}
        stockItems={[...items.map((i) => ({ name: i.name, supplier: i.supplier })), ...customMaterials.map((m) => ({ name: m.name, supplier: m.supplier }))]}
        onCreated={(lines) => {
          setPo((prev) => [...prev, ...lines])
          setApproved(false)
        }}
      />
    </div>
  )
}
