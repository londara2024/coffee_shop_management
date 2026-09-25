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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  { name: "Colombian Pink Bourbon", meta: "Huila · Anaerobic Washed · Lot #248", group: "Single Origin Beans", supplier: "Finca La Esperanza", supplierNote: "Direct-Trade Signed", onHand: "14 kg", par: "/ 25 kg par", pct: 56, state: "low", image: "/images/green-beans.jpg" },
  { name: "Minor Figures Barista Oat", meta: "6× 1L aseptic tetra pack carton", group: "Milk & Dairy", supplier: "Minor Figures Dist.", supplierNote: "Regional Cold-Chain", onHand: "6 cases (36L)", par: "Par: 15 cases (90L)", pct: 40, state: "critical", image: "/images/oat-milk-carton.jpg" },
  { name: "Wildflower Honey Reserve", meta: "Raw, unfiltered local harvest (500g)", group: "Syrups & Botanicals", supplier: "Local Bee Guild", supplierNote: "Sonoma Organic", onHand: "18 jars (9 kg)", par: "Par: 10 jars", pct: 100, state: "healthy", icon: Flower2 },
  { name: "Ceylon Cinnamon Bark", meta: "Organic stone-ground · Grade 'Alba'", group: "Syrups & Botanicals", supplier: "Spice Collective Direct", supplierNote: "Single Estate Sri Lanka", onHand: "4.5 kg", par: "Par: 3.0 kg", pct: 100, state: "healthy", icon: Sprout },
  { name: "Country Sourdough Batards", meta: "48hr cold ferment · Fresh daily run", group: "Bakery", supplier: "Heritage Bakehouse", supplierNote: "Daily Standing Order", onHand: "12 loaves", par: "Par: 10 loaves", pct: 100, state: "fresh", icon: Wheat },
  { name: "12oz & 16oz Compostable Cups", meta: "PLA-lined bamboo fiber, debossed logo", group: "Packaging", supplier: "EcoWare Global", supplierNote: "B-Corp Certified", onHand: "850 units", par: "Par: 1,000 units", pct: 85, state: "adequate", icon: CupSoda },
]

const stateStyle: Record<State, { label: string; cls: string; tone: "danger" | "forest" | "amber" | "glow" }> = {
  low: { label: "Low Stock Alert", cls: "bg-danger-soft text-danger", tone: "danger" },
  critical: { label: "Critical Reorder", cls: "bg-danger-soft text-danger", tone: "danger" },
  healthy: { label: "Healthy", cls: "bg-forest-soft text-forest", tone: "forest" },
  fresh: { label: "Fresh 6:00 AM", cls: "bg-oat text-ink-soft", tone: "forest" },
  adequate: { label: "Adequate", cls: "bg-oat text-ink-soft", tone: "glow" },
}

const groups: ("All Inventory" | Group)[] = ["All Inventory", "Single Origin Beans", "Milk & Dairy", "Syrups & Botanicals", "Bakery", "Packaging"]
const suppliers = ["All Suppliers (Direct & Dist.)", "Direct-Trade Only", "Distributors"]

const po = [
  { name: "Minor Figures Barista Oat (12cs)", vendor: "Vendor: Minor Figures Dist.", price: 336 },
  { name: "House Espresso Blend Green (20kg)", vendor: "Vendor: Aura Central Roastery Lot #91", price: 304 },
]

export function InventoryLedger() {
  const [group, setGroup] = useState<(typeof groups)[number]>("All Inventory")
  const [query, setQuery] = useState("")
  const [supplier, setSupplier] = useState(suppliers[0])
  const [approved, setApproved] = useState(false)

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
        eyebrow="Café Operations › Supply Chain & Botanical Cellar"
        title="Stock & Cellar Inventory"
        actions={
          <>
            <Badge variant="secondary" className="h-8 rounded-full bg-oat px-3 text-label-md">
              Live Sync: 4m ago
            </Badge>
            <Button variant="secondary" className="h-9 gap-1.5 rounded-lg bg-oat">
              <ClipboardCheck className="size-4 text-amber" /> Audit Par Levels
            </Button>
            <Button variant="secondary" className="h-9 gap-1.5 rounded-lg bg-oat">
              <Download className="size-4 text-amber" /> Export CSV
            </Button>
            <Button className="h-9 gap-1.5 rounded-lg px-4 hover:bg-amber" onClick={() => toast("Purchase order draft created")}>
              <FilePlus2 className="size-4" /> Create Purchase Order
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Package, chip: "3 Days Reserve", chipCls: "bg-amber-soft/70 text-amber", value: "184", unit: "kg total", sub: "Green Lot: 110 kg · Roasted Vault: 74 kg", pct: 62, tone: "amber" as const, a: "Current usage rate", b: "28 kg/day avg" },
          { icon: Milk, chip: "Urgent Oat", chipCls: "bg-danger-soft text-danger", value: "92", unit: "cartons", sub: "Minor Figures Oat: 36L · Clover Whole: 56L", pct: 28, tone: "danger" as const, a: "Oat runout risk", b: "Depletes in ~18 hrs" },
          { icon: Recycle, chip: "Optimal 88%", chipCls: "bg-forest-soft text-forest", value: "1,420", unit: "units", sub: "12oz, 16oz Cups & Sugarcane Lids", pct: 88, tone: "forest" as const, a: "Safety buffer", b: "+4 days buffer" },
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
        <div className="flex flex-col gap-3 rounded-3xl bg-gradient-to-br from-amber-soft/60 to-oat-light p-5 ring-1 ring-amber-bright/20">
          <div className="flex items-center justify-between">
            <span className="flex size-9 items-center justify-center rounded-lg bg-amber text-white">
              <BellRing className="size-4" />
            </span>
            <span className="rounded-md bg-amber-soft px-2 py-1 text-label-sm font-bold text-amber uppercase">Action Required</span>
          </div>
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-headline-lg-sm text-ink">3</span>
            <span className="text-title-md text-ink">Items Pending PO</span>
          </p>
          <p className="text-body-sm text-ink-soft">Huila Beans, Barista Oat, Cold-Cup Seals</p>
          <Button size="sm" className="mt-auto gap-1.5 bg-amber hover:bg-amber-bright" onClick={() => toast.success("3 purchase orders generated")}>
            Batch Generate POs →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 2xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 rounded-2xl bg-oat-light p-3 ring-1 ring-espresso/5">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search single origins, dairy, packaging…" className="h-10 rounded-xl border-transparent bg-white pl-9" />
              </div>
              <Select value={supplier} onValueChange={(v) => v && setSupplier(v as string)}>
                <SelectTrigger className="h-10 w-full rounded-xl border-0 bg-white text-label-md md:w-60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
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
                  {g} ({g === "All Inventory" ? 48 : items.filter((i) => i.group === g).length})
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white shadow-warm ring-1 ring-espresso/5">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-oat-light px-4 py-4 sm:px-5">
              <h2 className="font-serif text-headline-sm text-ink">Artisanal Sourcing &amp; Stock Ledger</h2>
              <span className="rounded-md bg-amber-soft/70 px-2 py-0.5 text-label-md font-semibold text-amber">6 Key Lines Highlighted</span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4 text-label-sm uppercase sm:pl-5">Ingredient / SKU</TableHead>
                  <TableHead className="text-label-sm uppercase max-md:hidden">Supplier &amp; Origin</TableHead>
                  <TableHead className="text-label-sm uppercase">On Hand / Par</TableHead>
                  <TableHead className="pr-4 text-right text-label-sm uppercase sm:pr-5">Status</TableHead>
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
                      No stock lines match.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
            <div className="flex flex-col items-center justify-between gap-2 border-t px-4 py-3 text-label-sm text-ink-soft sm:flex-row sm:px-5">
              <span>Showing {shown.length} active priority lines from 48 total registered pantry lots</span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="xs" className="bg-oat">
                  Previous
                </Button>
                <span>Page 1 of 8</span>
                <Button variant="secondary" size="xs" className="bg-oat">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 2xl:grid-cols-1">
          <Panel>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="eyebrow">Auto-Draft PO</p>
                <p className="mt-1 text-title-lg text-ink">Order #PO-2025-084</p>
              </div>
              <span className={cn("rounded-md px-2 py-0.5 text-label-md font-semibold", approved ? "bg-forest-soft text-forest" : "bg-amber-soft text-amber")}>
                {approved ? "Sent" : "Draft Pending"}
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
              <span className="text-body-md text-ink-soft">Total Commitment:</span>
              <span className="font-serif text-headline-sm text-ink tabular">${poTotal.toFixed(2)}</span>
            </div>
            <Button
              disabled={approved}
              onClick={() => {
                setApproved(true)
                toast.success("PO-2025-084 sent to roaster", { description: `$${poTotal.toFixed(2)} charged to Flagship Operating Fund` })
              }}
              className="mt-3 h-12 w-full gap-2 rounded-xl text-title-md hover:bg-amber"
            >
              {approved ? <Check className="size-4" /> : <Send className="size-4" />}
              {approved ? "Approved & Sent" : `Approve & Send to Roaster ($${poTotal.toFixed(2)})`}
            </Button>
            <p className="mt-2 text-center text-label-sm text-ink-soft">Charges account: Flagship Roastery Operating Fund (#***849)</p>
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-title-lg text-ink">
                <Truck className="size-5 text-amber" /> Today&apos;s Inbound Delivery
              </p>
              <Badge className="bg-forest-soft text-forest">On Schedule</Badge>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-3">
              <Clock className="size-6 text-amber" />
              <div>
                <p className="eyebrow text-ink-soft">Estimated Arrival</p>
                <p className="font-serif text-headline-sm text-ink">2:00 PM Today</p>
                <p className="text-label-sm text-ink-soft">Carrier: Metro Cold Express</p>
              </div>
            </div>
            <ol className="mt-4 flex flex-col gap-4 border-l-2 border-oat-deeper pl-5">
              {[
                { title: "Dispatched from Regional Depot", sub: "08:30 AM · Verified chilled at 3.4°C", state: "done" },
                { title: "In Transit · Downtown Route 4", sub: "Currently 3 stops away (~35 mins)", state: "now" },
                { title: "Dock Intake & QC Temp Verification", sub: "Flagship Loading Bay #1 · Elena Vasquez", state: "next" },
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
            <Button variant="secondary" className="w-full gap-1.5 bg-white" onClick={() => toast("Shift lead will be notified on arrival")}>
              <BellRing className="size-4 text-amber" /> Notify Barista Shift Lead on Arrival
            </Button>
          </Panel>

          <Panel className="bg-oat-deep md:col-span-2 2xl:col-span-1">
            <p className="flex items-center gap-2 eyebrow">
              <Thermometer className="size-3.5" /> Cellar Vault Climate
            </p>
            <p className="mt-1 text-title-lg text-ink">18.2°C · 58% Rel Humidity</p>
            <p className="mt-1 text-body-sm text-ink-soft">
              Optimal green bean preservation environment. Sensor node #B-04 active and stable for anaerobic lots.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  )
}
