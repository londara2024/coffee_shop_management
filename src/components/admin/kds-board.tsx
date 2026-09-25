"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Archive,
  BadgeCheck,
  Bell,
  CircleCheck,
  Clock,
  Flame,
  Gauge,
  Leaf,
  ListFilter,
  MapPin,
  Pause,
  Phone,
  Play,
  Printer,
  Repeat,
  Send,
  Store,
  ShieldAlert,
  Undo2,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { Meter, Panel } from "@/components/admin/blocks"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type Status = "new" | "brewing" | "ready" | "scheduled"
type Station = "Bar A" | "Bar B" | "Hearth" | "Bakery" | "Cold Lab" | "Tea Bar"

type Ticket = {
  id: string
  guest: string
  where: string
  channel: string
  status: Status
  elapsed: number
  slaMin: number
  items: { qty: number; name: string; station: Station; notes: string[]; done?: boolean }[]
  flag?: { tone: "amber" | "neutral"; text: string }
}

const initial: Ticket[] = [
  {
    id: "ACR-8942",
    guest: "Elena Rostova",
    where: "In-Store Tasting Room • Table 04",
    channel: "Priority Express",
    status: "brewing",
    elapsed: 222,
    slaMin: 6,
    items: [
      { qty: 1, name: "Honey Cinnamon Oat Latte", station: "Bar A", notes: ["12oz Ceramic, Steamed Hot 145°F", "Minor Figures Barista Oat Milk", "Double Ristretto Shot (Aura Seasonal Blend)", "Ceylon Cinnamon Dusting + Extra Wildflower Honey"] },
      { qty: 1, name: "Avocado Tartine", station: "Hearth", notes: ["Country Sourdough, Jammy Egg, Maldon Salt, Chili Flakes"] },
      { qty: 1, name: "Basque Burnt Cheesecake", station: "Bakery", notes: ["Chilled slice, Meyer Lemon preserve accent"] },
    ],
    flag: { tone: "neutral", text: "Eco guest preference: Low-Waste Eco Pack — skip stoppers & extra paper napkins." },
  },
  {
    id: "ACR-8943",
    guest: "Marcus Chen",
    where: "Silver Polestar 2 • Hazard Lights",
    channel: "Curbside Bay #3",
    status: "brewing",
    elapsed: 375,
    slaMin: 5,
    items: [
      { qty: 2, name: "Brown Sugar Oat Shaken Espresso", station: "Bar A", notes: ["Quad shots, Blonde Roast, hand-shaken with organic brown sugar", "Organic Oat Milk, topped with cinnamon sprinkle", "16oz Cold Cups with compostable sip lids"] },
      { qty: 1, name: "Cardamom Morning Bun", station: "Hearth", notes: ["Warm Hearth Toasting (30s) • Sealed pastry bag"] },
    ],
    flag: { tone: "amber", text: "Guest arrived at stall 3 min ago. Drink staging in progress." },
  },
  {
    id: "ACR-8944",
    guest: "Sophia Vance",
    where: "Order placed via App Barista Bar",
    channel: "Counter Pickup",
    status: "new",
    elapsed: 65,
    slaMin: 8,
    items: [
      { qty: 1, name: "Ethiopian Yirgacheffe Pour Over", station: "Bar B", notes: ["Extraction Method: Chemex 3-Cup Classic", "Bean Origin: Washed Gedeo Zone, 2,100m", "Tasting notes: White Jasmine, Peach Nectar, Bergamot"] },
      { qty: 1, name: "Açaí Protein Botanical Blast", station: "Cold Lab", notes: ["22g Pea Protein, Wild Blueberries, Coconut Water, Hemp Seeds"] },
    ],
    flag: { tone: "neutral", text: "Chemex blooming station currently vacant. Fast-track ready." },
  },
  {
    id: "ACR-8945",
    guest: "David Kim",
    where: "Scheduled for 8:15 AM (in ~12 mins)",
    channel: "Scheduled Order",
    status: "scheduled",
    elapsed: 0,
    slaMin: 10,
    items: [
      { qty: 1, name: "Ceremonial Matcha Botanical Fusion", station: "Tea Bar", notes: ["Uji First Harvest Ceremonial Grade", "Sweetened with raw agave nectar", "Steamed coconut oat blend, lavender drizzle"] },
      { qty: 1, name: "Prosciutto & Gruyère Croissant", station: "Bakery", notes: ["Hearth warmed crisp before scheduled pickup"] },
    ],
  },
  {
    id: "ACR-8940",
    guest: "Liam Patel",
    where: "Placed at Shelf Zone: Counter Bar A",
    channel: "Ready on Shelf",
    status: "ready",
    elapsed: 240,
    slaMin: 6,
    items: [
      { qty: 1, name: "Flat White (Valrhona Mocha)", station: "Bar A", notes: [], done: true },
      { qty: 1, name: "Cardamom Pistachio Scone", station: "Bakery", notes: [], done: true },
    ],
  },
]

const filters: { id: "all" | Exclude<Status, "scheduled">; label: string }[] = [
  { id: "all", label: "All Active" },
  { id: "new", label: "New / In-Queue" },
  { id: "brewing", label: "Handcrafting & Brewing" },
  { id: "ready", label: "Ready for Pickup" },
]
const stationFilters = ["All Stations", "Espresso Bar A", "Pour-Over Bar B", "Hearth & Bakery"]
const stationMatch: Record<string, Station[]> = {
  "Espresso Bar A": ["Bar A"],
  "Pour-Over Bar B": ["Bar B", "Cold Lab", "Tea Bar"],
  "Hearth & Bakery": ["Hearth", "Bakery"],
}

const statusStyle: Record<Status, { bar: string; label: string }> = {
  new: { bar: "bg-forest", label: "New" },
  brewing: { bar: "bg-amber-bright", label: "Handcrafting" },
  ready: { bar: "bg-forest", label: "Ready on Shelf" },
  scheduled: { bar: "bg-oat-deeper", label: "Scheduled" },
}

function mmss(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

export function KdsBoard() {
  const [tickets, setTickets] = useState(initial)
  const [filter, setFilter] = useState<"all" | Exclude<Status, "scheduled">>("all")
  const [station, setStation] = useState(stationFilters[0])
  const [chime, setChime] = useState(true)
  const [processed, setProcessed] = useState(384)

  useEffect(() => {
    const t = setInterval(
      () => setTickets((ts) => ts.map((x) => (x.status === "new" || x.status === "brewing" ? { ...x, elapsed: x.elapsed + 1 } : x))),
      1000
    )
    return () => clearInterval(t)
  }, [])

  const counts = {
    all: tickets.length,
    new: tickets.filter((t) => t.status === "new" || t.status === "scheduled").length,
    brewing: tickets.filter((t) => t.status === "brewing").length,
    ready: tickets.filter((t) => t.status === "ready").length,
  }

  const shown = tickets.filter(
    (t) =>
      (filter === "all" || t.status === filter || (filter === "new" && t.status === "scheduled")) &&
      (station === "All Stations" || t.items.some((i) => stationMatch[station].includes(i.station)))
  )

  function update(id: string, fn: (t: Ticket) => Ticket | null) {
    setTickets((ts) =>
      ts.flatMap((t) => {
        if (t.id !== id) return [t]
        const next = fn(t)
        return next ? [next] : []
      })
    )
  }

  function bump(t: Ticket) {
    if (t.status === "ready") {
      update(t.id, () => null)
      setProcessed((n) => n + 1)
      toast.success(`#${t.id} completed & archived`)
      return
    }
    const next: Status = t.status === "brewing" ? "ready" : "brewing"
    update(t.id, (x) => ({ ...x, status: next, items: next === "ready" ? x.items.map((i) => ({ ...i, done: true })) : x.items }))
    toast(`#${t.id} → ${statusStyle[next].label}`, { description: chime ? "Chime played at pickup counter" : undefined })
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="h-8 gap-1.5 rounded-full bg-oat px-3 text-label-sm font-bold text-ink uppercase">
          <span className="size-2 animate-pulse rounded-full bg-forest" /> Live Feed Synced • 2s ago
        </Badge>
        <span className="flex items-center gap-1.5 text-body-sm text-ink-soft">
          <Gauge className="size-4 text-amber" /> Roastery Load: <b className="text-title-md text-ink">Moderate</b>
          <span className="rounded bg-amber-soft px-1.5 text-label-md font-semibold text-amber">Est. wait 8–10 mins</span>
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Label className="flex h-8 items-center gap-2 rounded-full bg-oat px-3 text-label-md font-semibold">
            <Bell className="size-3.5 text-amber" /> Audio Chime
            <Switch checked={chime} onCheckedChange={setChime} size="sm" className="data-checked:bg-amber" />
          </Label>
          <Button variant="secondary" size="sm" className="h-8 gap-1.5 rounded-full bg-oat">
            <Pause className="size-3.5 text-amber" /> Station Throttle
          </Button>
          <Button size="sm" className="h-8 gap-1.5 rounded-full hover:bg-amber">
            <Printer className="size-3.5" /> Batch Routing Slip
          </Button>
        </div>
      </div>

      {/* Phones: status & station filters collapse into dropdowns so nothing runs off-screen */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-oat-light p-2 ring-1 ring-espresso/5 md:hidden">
        <Select
          value={filter}
          items={Object.fromEntries(filters.map((f) => [f.id, `${f.label} (${counts[f.id]})`]))}
          onValueChange={(v) => v && setFilter(v as typeof filter)}
        >
          <SelectTrigger aria-label="Ticket status" className="h-10 w-full rounded-xl border-0 bg-espresso px-3 text-label-md font-semibold text-milk [&_svg]:text-milk">
            <ListFilter className="size-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filters.map((f) => (
              <SelectItem key={f.id} value={f.id} className="py-2">
                <span className="flex-1">{f.label}</span>
                <span className="rounded-full bg-oat-deeper px-1.5 text-label-sm text-ink-soft">{counts[f.id]}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={station} onValueChange={(v) => v && setStation(v as string)}>
          <SelectTrigger
            aria-label="Station"
            className={cn(
              "h-10 w-full rounded-xl border-0 px-3 text-label-md font-semibold",
              station === stationFilters[0] ? "bg-white text-ink" : "bg-amber-soft text-amber"
            )}
          >
            <Store className="size-4 text-amber" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stationFilters.map((st) => (
              <SelectItem key={st} value={st} className="py-2">
                {st}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="hidden flex-col gap-2 rounded-2xl bg-oat-light p-2 ring-1 ring-espresso/5 md:flex 2xl:flex-row 2xl:items-center">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-label-md font-semibold whitespace-nowrap transition-colors",
                filter === f.id ? "bg-espresso text-milk" : "text-ink-soft hover:bg-oat"
              )}
            >
              {f.label} ({counts[f.id]})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none 2xl:ml-auto">
          <span className="px-2 text-label-sm font-bold text-ink-soft uppercase">Station:</span>
          {stationFilters.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStation(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-label-md font-semibold whitespace-nowrap",
                station === s ? "bg-amber-soft text-amber" : "text-ink-soft hover:bg-oat"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-oat-deep">
        <div className="relative z-10 max-w-xl p-6 md:p-8">
          <p className="eyebrow">● Aura KDS Engine • Production Feed</p>
          <h1 className="mt-2 font-serif text-headline-lg-sm text-ink md:text-headline-lg">Master Roastery Production Queue</h1>
          <p className="mt-2 text-body-md text-ink-soft">
            Tracking thermal profiles, single-origin pour overs, and stone-ground hearth bake times in real-time. Priority
            routing is active for pickup bays and table service.
          </p>
        </div>
        <div className="absolute inset-y-0 right-0 hidden w-2/5 md:block">
          <Image src="/images/kds-hero.jpg" alt="" fill sizes="40vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-oat-deep via-oat-deep/30 to-transparent" />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((t) => {
          const over = (t.status === "brewing" || t.status === "new") && t.elapsed > t.slaMin * 60
          return (
            <article key={t.id} className="flex flex-col overflow-hidden rounded-3xl bg-oat-light shadow-warm ring-1 ring-espresso/5">
              <div className={cn("h-1.5", over ? "bg-danger" : statusStyle[t.status].bar)} />
              <div className="flex flex-col gap-1 p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-serif text-headline-sm text-ink">#{t.id}</p>
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-label-md font-bold tabular",
                      over ? "bg-danger-soft text-danger" : "bg-white text-ink"
                    )}
                  >
                    {over ? <ShieldAlert className="size-3.5" /> : <Clock className="size-3.5" />}
                    {t.status === "scheduled" ? "8:15" : mmss(t.elapsed)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge className="bg-amber-soft text-label-sm font-bold text-amber">{t.channel}</Badge>
                  <span className={cn("text-label-sm font-bold", over ? "text-danger" : "text-amber")}>
                    {over ? `Over SLA (${t.slaMin}m target)` : statusStyle[t.status].label}
                  </span>
                </div>
                <p className="mt-1 text-title-md text-ink">{t.guest}</p>
                <p className="text-body-sm text-ink-soft">{t.where}</p>
              </div>

              <ul className="flex flex-1 flex-col gap-2 px-5">
                {t.items.map((i) => (
                  <li key={i.name} className={cn("rounded-2xl bg-white p-3", i.done && "opacity-70")}>
                    <div className="flex items-start gap-2">
                      {i.done ? (
                        <CircleCheck className="mt-0.5 size-5 shrink-0 text-forest" />
                      ) : (
                        <span className="mt-0.5 flex h-5 min-w-6 items-center justify-center rounded bg-espresso px-1 text-label-sm font-bold text-milk">
                          {i.qty}×
                        </span>
                      )}
                      <p className={cn("flex-1 text-title-md text-ink", i.done && "line-through")}>{i.name}</p>
                      <span className="rounded bg-oat px-1.5 py-0.5 text-label-sm font-semibold text-ink-soft">
                        {i.done ? "Done" : i.station}
                      </span>
                    </div>
                    {i.notes.length && !i.done ? (
                      <ul className="mt-1.5 flex flex-col gap-0.5 pl-8 text-body-sm text-ink-soft">
                        {i.notes.map((n) => (
                          <li key={n}>• {n}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
                {t.status === "ready" ? (
                  <li className="flex items-center justify-between rounded-2xl bg-white p-3">
                    <div>
                      <p className="eyebrow text-ink-soft">Pickup Code</p>
                      <p className="font-mono text-headline-sm tracking-widest text-ink">AUR-40P</p>
                    </div>
                    <span className="text-label-sm text-ink-soft">SMS sent at 08:01</span>
                  </li>
                ) : null}
                {t.flag ? (
                  <li
                    className={cn(
                      "flex gap-2 rounded-2xl p-3 text-body-sm",
                      t.flag.tone === "amber" ? "bg-amber-soft/50 text-amber" : "bg-oat text-ink-soft"
                    )}
                  >
                    {t.flag.tone === "amber" ? <MapPin className="mt-0.5 size-4 shrink-0" /> : <Leaf className="mt-0.5 size-4 shrink-0 text-forest" />}
                    {t.flag.text}
                  </li>
                ) : null}
              </ul>

              {/* Secondary actions on top, the primary step full-width below — same layout at every width */}
              <div className="mt-4 flex flex-col gap-2 border-t border-espresso/5 p-4">
                {t.status === "scheduled" ? (
                  <>
                    <Button variant="secondary" size="sm" className="h-8 w-full bg-white" onClick={() => toast("Postponed 5 minutes")}>
                      Postpone +5m
                    </Button>
                    <Button
                      className="h-10 w-full gap-1.5 hover:bg-amber"
                      onClick={() => update(t.id, (x) => ({ ...x, status: "new", elapsed: 0 }))}
                    >
                      <Play className="size-4" /> Release Now
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="icon-sm" className="size-8 shrink-0 bg-white" aria-label="Call guest">
                        <Phone />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 flex-1 gap-1.5 bg-white"
                        onClick={() => toast(t.status === "ready" ? "Pickup ping resent" : "Label sent to printer")}
                      >
                        {t.status === "ready" ? <Send className="size-3.5" /> : <Printer className="size-3.5" />}
                        {t.status === "ready" ? "Resend Ping" : "Print Label"}
                      </Button>
                      {t.status === "brewing" ? (
                        <Button
                          variant="secondary"
                          size="icon-sm"
                          className="size-8 shrink-0 bg-white"
                          aria-label="Send back to queue"
                          onClick={() => update(t.id, (x) => ({ ...x, status: "new" }))}
                        >
                          <Undo2 />
                        </Button>
                      ) : null}
                    </div>
                    <Button
                      onClick={() => bump(t)}
                      className={cn(
                        "h-10 w-full gap-1.5",
                        t.status === "brewing" && over ? "bg-amber hover:bg-amber-bright" : "hover:bg-amber"
                      )}
                    >
                      {t.status === "new" && (
                        <>
                          <Flame className="size-4" /> Start Brew
                        </>
                      )}
                      {t.status === "brewing" && (
                        <>
                          <BadgeCheck className="size-4" /> Mark Ready & Dispatch
                        </>
                      )}
                      {t.status === "ready" && (
                        <>
                          <Archive className="size-4" /> Complete & Archive
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </article>
          )
        })}

        <Panel className="flex flex-col gap-4">
          <div>
            <p className="eyebrow">Real-Time Metrics</p>
            <h2 className="mt-0.5 text-title-lg text-ink">Station Heat & Extraction SLA</h2>
          </div>
          {[
            { name: "Espresso Bar A (La Marzocco Strada)", pct: 82, tone: "amber" as const },
            { name: "Slow Bar B (Origami & Chemex Racks)", pct: 35, tone: "forest" as const },
            { name: "Bakery Hearth Oven", pct: 60, tone: "glow" as const },
          ].map((s) => (
            <div key={s.name}>
              <div className="mb-1.5 flex justify-between text-label-md">
                <span className="text-ink">{s.name}</span>
                <span className="font-semibold text-amber tabular">{s.pct}% Cap</span>
              </div>
              <Meter value={s.pct} tone={s.tone} />
            </div>
          ))}
          <div className="rounded-2xl bg-white p-3">
            <p className="mb-2 text-label-md text-ink-soft">Quick Line Interventions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Pause, label: "Pause Mobile" },
                { icon: Users, label: "Purge Group 2" },
                { icon: ShieldAlert, label: "SLA Override" },
                { icon: Repeat, label: "Order Recall" },
              ].map(({ icon: Icon, label }) => (
                <Button key={label} variant="secondary" size="sm" className="gap-1.5 bg-oat" onClick={() => toast(label)}>
                  <Icon className="size-3.5 text-amber" /> {label}
                </Button>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="flex flex-col gap-3 rounded-3xl bg-oat-light p-4 ring-1 ring-espresso/5 md:flex-row md:items-center">
        <BadgeCheck className="size-6 text-amber" />
        <div className="flex-1">
          <p className="text-title-md text-ink">All Station Profiles Balanced</p>
          <p className="text-body-sm text-ink-soft">
            Average extraction turn-around: 4m 12s • Daily tickets processed: <b className="tabular">{processed}</b>
          </p>
        </div>
        <span className="text-label-md text-ink-soft">Barista Shift Lead: Mateo Silva</span>
        <Button size="sm" className="hover:bg-amber">
          End Shift Audit Report
        </Button>
      </div>
    </div>
  )
}
