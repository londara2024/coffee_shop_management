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
    where: "បន្ទប់ភ្លក្សរសជាតិក្នុងហាង • តុ 04",
    channel: "អាទិភាពរហ័ស",
    status: "brewing",
    elapsed: 222,
    slaMin: 6,
    items: [
      { qty: 1, name: "Honey Cinnamon Oat Latte", station: "Bar A", notes: ["ពែងសេរ៉ាមិច 12oz ចំហុយក្តៅ 145°F", "Minor Figures Barista Oat Milk", "បាញ់ Ristretto ទ្វេដង (Aura Seasonal Blend)", "រោយម្សៅស៊ីណាមុន Ceylon + ទឹកឃ្មុំផ្កាព្រៃបន្ថែម"] },
      { qty: 1, name: "Avocado Tartine", station: "Hearth", notes: ["នំបុ័ង Sourdough ជនបទ ស៊ុតទឹកកណ្ដាល អំបិល Maldon កំទេចម្ទេសក្រហម"] },
      { qty: 1, name: "Basque Burnt Cheesecake", station: "Bakery", notes: ["ចំណិតត្រជាក់ លាបជាមួយផលិតផលកក់ក្រូចឆ្មារ Meyer"] },
    ],
    flag: { tone: "neutral", text: "ចំណង់ចំណូលចិត្តអតិថិជនអេកូ៖ កញ្ចប់អេកូកាត់បន្ថយសំណល់ — មិនប្រើគម្របឧបករណ៍ និងក្រដាសអត់ដៃបន្ថែម។" },
  },
  {
    id: "ACR-8943",
    guest: "Marcus Chen",
    where: "Silver Polestar 2 • ភ្លើងសញ្ញាអាសន្ន",
    channel: "ចំណតទទួលក្រៅរថយន្ត #3",
    status: "brewing",
    elapsed: 375,
    slaMin: 5,
    items: [
      { qty: 2, name: "Brown Sugar Oat Shaken Espresso", station: "Bar A", notes: ["4 បាញ់ Blonde Roast កូរដោយដៃជាមួយស្ករត្នោតសរីរាង្គ", "ទឹកដោះគោអូតសរីរាង្គ រោយម្សៅស៊ីណាមុនខាងលើ", "កែវត្រជាក់ 16oz ជាមួយគម្របផឹករលាយបាន"] },
      { qty: 1, name: "Cardamom Morning Bun", station: "Hearth", notes: ["ដុតក្តៅក្នុងឡ Hearth (30s) • វេចក្នុងថង់នំបិទជិត"] },
    ],
    flag: { tone: "amber", text: "អតិថិជនបានមកដល់ចំណត 3 នាទីមុន។ កំពុងរៀបចំភេសជ្ជៈ។" },
  },
  {
    id: "ACR-8944",
    guest: "Sophia Vance",
    where: "បញ្ជាទិញតាមរយៈ App Barista Bar",
    channel: "ទទួលនៅកន្លែងបញ្ជរ",
    status: "new",
    elapsed: 65,
    slaMin: 8,
    items: [
      { qty: 1, name: "Ethiopian Yirgacheffe Pour Over", station: "Bar B", notes: ["វិធីស្រង់៖ Chemex 3-Cup Classic", "ប្រភពគ្រាប់៖ Washed Gedeo Zone, 2,100m", "កំណត់ចំណាំរសជាតិ៖ White Jasmine, Peach Nectar, Bergamot"] },
      { qty: 1, name: "Açaí Protein Botanical Blast", station: "Cold Lab", notes: ["ប្រូតេអ៊ីនសណ្ដែក 22g ផ្លែប៊្លូបឺរីព្រៃ ទឹកដូង គ្រាប់ Hemp"] },
    ],
    flag: { tone: "neutral", text: "កន្លែងព្រុះកាហ្វេ Chemex កំពុងទំនេរ។ អាចរួចរាល់លឿន។" },
  },
  {
    id: "ACR-8945",
    guest: "David Kim",
    where: "កំណត់ពេលម៉ោង 8:15 AM (ក្នុងប្រមាណ 12 នាទីទៀត)",
    channel: "ការកម្ម៉ង់តាមកាលវិភាគ",
    status: "scheduled",
    elapsed: 0,
    slaMin: 10,
    items: [
      { qty: 1, name: "Ceremonial Matcha Botanical Fusion", station: "Tea Bar", notes: ["ថ្នាក់ពិធីការ ច្រូតកាត់ដំបូង Uji", "ផ្អែមជាមួយទឹកអាហ្កាវីឆៅ", "លាយទឹកដូង និងទឹកដោះគោអូតចំហុយ ស្រោចទឹកឡាវេនឌឺរ"] },
      { qty: 1, name: "Prosciutto & Gruyère Croissant", station: "Bakery", notes: ["ដុតក្តៅឲ្យក្រូបនៅឡ Hearth មុនពេលដល់កាលកំណត់ទទួល"] },
    ],
  },
  {
    id: "ACR-8940",
    guest: "Liam Patel",
    where: "ដាក់នៅតំបន់ធ្នើ៖ បញ្ជរ Bar A",
    channel: "រួចរាល់នៅលើធ្នើ",
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
  { id: "all", label: "សកម្មទាំងអស់" },
  { id: "new", label: "ថ្មី / កំពុងតម្រង់ជួរ" },
  { id: "brewing", label: "កំពុងធ្វើ និងស្រង់" },
  { id: "ready", label: "រួចរាល់សម្រាប់ទទួល" },
]
const stationFilters = ["All Stations", "Espresso Bar A", "Pour-Over Bar B", "Hearth & Bakery"]
const stationMatch: Record<string, Station[]> = {
  "Espresso Bar A": ["Bar A"],
  "Pour-Over Bar B": ["Bar B", "Cold Lab", "Tea Bar"],
  "Hearth & Bakery": ["Hearth", "Bakery"],
}

const stationLabel: Record<Station, string> = {
  "Bar A": "បារ A",
  "Bar B": "បារ B",
  Hearth: "ឡដុត",
  Bakery: "នំបុ័ង",
  "Cold Lab": "ភេសជ្ជៈត្រជាក់",
  "Tea Bar": "បារតែ",
}

const statusStyle: Record<Status, { bar: string; label: string }> = {
  new: { bar: "bg-forest", label: "ថ្មី" },
  brewing: { bar: "bg-amber-bright", label: "កំពុងធ្វើ" },
  ready: { bar: "bg-forest", label: "រួចរាល់នៅលើធ្នើ" },
  scheduled: { bar: "bg-oat-deeper", label: "បានកំណត់ពេល" },
}

function mmss(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

export function KdsBoard() {
  const [tickets, setTickets] = useState(initial)
  const [filter, setFilter] = useState<"all" | Exclude<Status, "scheduled">>("all")
  const station = stationFilters[0]
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
      toast.success(`#${t.id} បានបញ្ចប់ និងទុកក្នុងប័ណ្ណសារ`)
      return
    }
    const next: Status = t.status === "brewing" ? "ready" : "brewing"
    update(t.id, (x) => ({ ...x, status: next, items: next === "ready" ? x.items.map((i) => ({ ...i, done: true })) : x.items }))
    toast(`#${t.id} → ${statusStyle[next].label}`, { description: chime ? "សំឡេងជូនដំណឹងបានលឺនៅកន្លែងទទួល" : undefined })
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="h-8 gap-1.5 rounded-full bg-oat px-3 text-label-sm font-bold text-ink uppercase">
          <span className="size-2 animate-pulse rounded-full bg-forest" /> ធ្វើសមកាលកម្មផ្ទាល់ • 2 វិនាទីមុន
        </Badge>
        <span className="flex items-center gap-1.5 text-body-sm text-ink-soft">
          <Gauge className="size-4 text-amber" /> បន្ទុកកន្លែងដុត៖ <b className="text-title-md text-ink">មធ្យម</b>
          <span className="rounded bg-amber-soft px-1.5 text-label-md font-semibold text-amber">រង់ចាំប្រមាណ 8–10 នាទី</span>
        </span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Label className="flex h-8 items-center gap-2 rounded-full bg-oat px-3 text-label-md font-semibold">
            <Bell className="size-3.5 text-amber" /> សំឡេងជូនដំណឹង
            <Switch checked={chime} onCheckedChange={setChime} size="sm" className="data-checked:bg-amber" />
          </Label>
          <Button variant="secondary" size="sm" className="h-8 gap-1.5 rounded-full bg-oat">
            <Pause className="size-3.5 text-amber" /> គ្រប់គ្រងល្បឿនស្ថានីយ៍
          </Button>
          <Button size="sm" className="h-8 gap-1.5 rounded-full hover:bg-amber">
            <Printer className="size-3.5" /> បោះពុម្ពស្លីបជាបាច់
          </Button>
        </div>
      </div>

      {/* Phones: status filter collapses into a dropdown so nothing runs off-screen */}
      <div className="grid grid-cols-1 gap-2 rounded-2xl bg-oat-light p-2 ring-1 ring-espresso/5 md:hidden">
        <Select
          value={filter}
          items={Object.fromEntries(filters.map((f) => [f.id, `${f.label} (${counts[f.id]})`]))}
          onValueChange={(v) => v && setFilter(v as typeof filter)}
        >
          <SelectTrigger aria-label="ស្ថានភាពសំបុត្រ" className="h-10 w-full rounded-xl border-0 bg-espresso px-3 text-label-md font-semibold text-milk [&_svg]:text-milk">
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
      </div>

      <section className="hidden relative overflow-hidden rounded-3xl bg-oat-deep">
        <div className="relative z-10 max-w-xl p-6 md:p-8">
          <p className="eyebrow">● Aura KDS Engine • លំហូរផលិតកម្ម</p>
          <h1 className="mt-2 font-serif text-headline-lg-sm text-ink md:text-headline-lg">ជួរផលិតកម្មសំខាន់នៃកន្លែងដុតគ្រាប់</h1>
          <p className="mt-2 text-body-md text-ink-soft">
            តាមដានប្រូហ្វាយកម្ដៅ ការស្រង់កាហ្វេប្រភពដើមតែមួយ និងពេលវេលាដុតនំកិនដោយថ្មតាមពេលវេលាជាក់ស្តែង។
            ការតម្រង់ទិសអាទិភាពកំពុងដំណើរការសម្រាប់តំបន់ទទួល និងសេវាតុ។
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
                    {over ? `លើស SLA (គោលដៅ ${t.slaMin} នាទី)` : statusStyle[t.status].label}
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
                        {i.done ? "រួចរាល់" : stationLabel[i.station]}
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
                      <p className="eyebrow text-ink-soft">កូដទទួល</p>
                      <p className="font-mono text-headline-sm tracking-widest text-ink">AUR-40P</p>
                    </div>
                    <span className="text-label-sm text-ink-soft">SMS បានផ្ញើនៅម៉ោង 08:01</span>
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
                    <Button variant="secondary" size="sm" className="h-8 w-full bg-white" onClick={() => toast("បានពន្យារពេល 5 នាទី")}>
                      ពន្យារពេល +5 នាទី
                    </Button>
                    <Button
                      className="h-10 w-full gap-1.5 hover:bg-amber"
                      onClick={() => update(t.id, (x) => ({ ...x, status: "new", elapsed: 0 }))}
                    >
                      <Play className="size-4" /> ចេញផ្សាយឥឡូវនេះ
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" size="icon-sm" className="size-8 shrink-0 bg-white" aria-label="ហៅទូរស័ព្ទទៅភ្ញៀវ">
                        <Phone />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 flex-1 gap-1.5 bg-white"
                        onClick={() => toast(t.status === "ready" ? "បានផ្ញើសារជូនដំណឹងទទួលម្ដងទៀត" : "ស្លាកត្រូវបានផ្ញើទៅម៉ាស៊ីនបោះពុម្ព")}
                      >
                        {t.status === "ready" ? <Send className="size-3.5" /> : <Printer className="size-3.5" />}
                        {t.status === "ready" ? "ផ្ញើសារជូនដំណឹងម្ដងទៀត" : "បោះពុម្ពស្លាក"}
                      </Button>
                      {t.status === "brewing" ? (
                        <Button
                          variant="secondary"
                          size="icon-sm"
                          className="size-8 shrink-0 bg-white"
                          aria-label="ផ្ញើត្រឡប់ទៅជួរវិញ"
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
                          <Flame className="size-4" /> ចាប់ផ្តើមស្រង់
                        </>
                      )}
                      {t.status === "brewing" && (
                        <>
                          <BadgeCheck className="size-4" /> សម្គាល់ថារួចរាល់ និងបញ្ជូន
                        </>
                      )}
                      {t.status === "ready" && (
                        <>
                          <Archive className="size-4" /> បញ្ចប់ និងទុកក្នុងប័ណ្ណសារ
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </article>
          )
        })}

        <Panel className="hidden flex-col gap-4">
          <div>
            <p className="eyebrow">ម៉ែត្រិកពេលវេលាជាក់ស្តែង</p>
            <h2 className="mt-0.5 text-title-lg text-ink">កម្ដៅស្ថានីយ៍ និង SLA ស្រង់</h2>
          </div>
          {[
            { name: "Espresso Bar A (La Marzocco Strada)", pct: 82, tone: "amber" as const },
            { name: "Slow Bar B (Origami & Chemex Racks)", pct: 35, tone: "forest" as const },
            { name: "Bakery Hearth Oven", pct: 60, tone: "glow" as const },
          ].map((s) => (
            <div key={s.name}>
              <div className="mb-1.5 flex justify-between text-label-md">
                <span className="text-ink">{s.name}</span>
                <span className="font-semibold text-amber tabular">{s.pct}% សមត្ថភាព</span>
              </div>
              <Meter value={s.pct} tone={s.tone} />
            </div>
          ))}
          <div className="rounded-2xl bg-white p-3">
            <p className="mb-2 text-label-md text-ink-soft">អន្តរាគមន៍ជួរលឿន</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Pause, label: "ផ្អាកកម្មវិធីទូរស័ព្ទ" },
                { icon: Users, label: "សម្អាតក្រុម 2" },
                { icon: ShieldAlert, label: "បដិសេធ SLA" },
                { icon: Repeat, label: "ហៅការកម្ម៉ង់ត្រឡប់" },
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
          <p className="text-title-md text-ink">ប្រូហ្វាយស្ថានីយ៍ទាំងអស់មានតុល្យភាព</p>
          <p className="text-body-sm text-ink-soft">
            រយៈពេលស្រង់ជាមធ្យម៖ 4m 12s • សំបុត្របានដំណើរការប្រចាំថ្ងៃ៖ <b className="tabular">{processed}</b>
          </p>
        </div>
        <span className="text-label-md text-ink-soft">ប្រធានវេនបារីស្តា៖ Mateo Silva</span>
        <Button size="sm" className="hover:bg-amber">
          របាយការណ៍ត្រួតពិនិត្យបញ្ចប់វេន
        </Button>
      </div>
    </div>
  )
}
