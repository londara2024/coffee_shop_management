import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRight,
  Banknote,
  BookMarked,
  CakeSlice,
  Car,
  ClipboardList,
  Coffee,
  Package,
  Settings2,
  Sparkles,
  Star,
  Store,
  Timer,
  TrendingUp,
  TriangleAlert,
  Wine,
} from "lucide-react"

import { Meter, PageHeader, Panel, PanelTitle, StatCard } from "@/components/admin/blocks"
import { VolumeChart } from "@/components/admin/volume-chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export const metadata: Metadata = { title: "Today's Roastery Overview" }

const stations = [
  { icon: Coffee, name: "Bar A • Espresso & Lattes", crew: "Slayer 3-Group", count: 6, noun: "orders handcrafting", wait: "2.0 min", waitLabel: "average wait", load: 62, tone: "amber" as const },
  { icon: Wine, name: "Bar B • Slow Bar & Cold Brew", crew: "Marco Jet + V60", count: 4, noun: "infusions queuing", wait: "On Pace", waitLabel: "3.5 min drip pace", load: 40, tone: "forest" as const },
  { icon: CakeSlice, name: "Culinary • Bakery & Tartines", crew: "1 Expedited", count: 8, noun: "tickets toasting", wait: "4.8 min", waitLabel: "oven capacity 80%", load: 80, tone: "amber" as const },
]

const topItems = [
  { name: "Honey Cinnamon Oat Latte", meta: "112 orders • Double washed", revenue: "$700.00", delta: "+18%" },
  { name: "Brown Sugar Shaken Espresso", meta: "84 orders • Single origin Huila", revenue: "$575.40", delta: "+9%" },
  { name: "Whipped Avocado Tartine", meta: "46 orders • Sourdough brioche", revenue: "$437.00", delta: "+14%" },
  { name: "Basque Burnt Cheesecake", meta: "38 orders • Madagascar vanilla", revenue: "$247.00", delta: "Steady" },
]

const tickets = [
  { id: "#1048", guest: "Elena Rostova", tier: "Gold VIP · Regular (148 pts)", items: "2× Honey Cinnamon Oat Latte, 1× Basque Burnt Cheesecake", note: "Oat milk, extra foam, heated pastry", channel: "Express In-Store", icon: Store, status: "Brewing", tone: "amber" },
  { id: "#1049", guest: "Marcus Chen", tier: "Mobile Prepaid Order", items: "1× Brown Sugar Shaken Espresso, 1× Avocado Tartine", note: "Light ice, chili crunch on side", channel: "Curbside Bay 2", icon: Car, status: "Queued", tone: "neutral" },
  { id: "#1050", guest: "Sophia Vance", tier: "Subscription Member", items: "1× Geisha Pour Over (Filter Bar), 1× Almond Biscotti", note: "Warm ceramic cup, whole bean bag packaged", channel: "Tasting Bar Pick", icon: Coffee, status: "Ready", tone: "forest" },
]

const statusCls: Record<string, string> = {
  amber: "bg-amber-soft text-amber",
  neutral: "bg-oat-deep text-ink-soft",
  forest: "bg-forest-soft text-forest",
}

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <PageHeader
        eyebrow={
          <>
            Store Intelligence & Operations • <span className="text-ink-soft normal-case tracking-normal">Telemetry Synchronized • Live</span>
          </>
        }
        title="Today's Roastery Overview"
        description="Real-time throughput, ticket progression, and botanical menu velocity across all counters."
        actions={
          <>
            <Badge className="h-8 gap-1.5 rounded-full bg-oat px-3 text-label-md text-ink">
              <span className="size-2 rounded-full bg-forest" /> Rush Protocol: Active Balancing
            </Badge>
            <Badge className="h-8 gap-1.5 rounded-full bg-amber-soft/60 px-3 text-label-md text-amber">
              <Timer /> +5 Min Buffer
            </Badge>
            <Button className="h-9 gap-2 rounded-lg px-4 hover:bg-amber">
              <Settings2 className="size-4" /> Station Controls
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Net Revenue"
          icon={Banknote}
          value="$4,892.50"
          foot={
            <span className="text-forest">
              <TrendingUp className="mr-1 inline size-3.5 align-[-2px]" /> +14.2% vs yesterday <span className="text-ink-soft">($4,284.10)</span>
            </span>
          }
        />
        <StatCard
          label="Active Queue"
          icon={Timer}
          value="18"
          unit="tickets in flight"
          accent
          foot={<span className="text-amber">Avg. prep time: 6.4 mins</span>}
        />
        <StatCard label="Roastery Orders" icon={ClipboardList} value="342" unit="tickets today" foot="Peak rate: 52 orders/hr at 08:30 AM" />
        <StatCard
          label="Loyalty & CSAT"
          icon={Star}
          value="88%"
          unit="Gold Members"
          accent
          foot={
            <span>
              <b className="text-amber">4.9 ★</b> • 312 guest ratings today
            </span>
          }
        />
      </div>

      <Panel>
        <PanelTitle
          title="Live Counter Pulse & Queue Balancing"
          description="Real-time load division between extraction bars and culinary station."
          aside={
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-label-sm font-semibold text-ink-soft">
              <span className="size-2 rounded-full bg-forest" /> All Stations Nominal
            </span>
          }
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {stations.map(({ icon: Icon, ...s }) => (
            <div key={s.name} className="rounded-2xl bg-white p-4 shadow-warm">
              <div className="flex items-start justify-between gap-2">
                <p className="flex items-start gap-2 text-title-md text-ink">
                  <Icon className="mt-0.5 size-4 shrink-0 text-amber" /> {s.name}
                </p>
                <span className="shrink-0 rounded-full bg-oat px-2 py-0.5 text-label-sm text-ink-soft">{s.crew}</span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="font-serif text-headline-md text-ink">{s.count}</p>
                  <p className="text-label-sm font-semibold text-ink-soft">{s.noun}</p>
                </div>
                <div className="text-right">
                  <p className={s.tone === "forest" ? "text-label-lg text-forest" : "text-label-lg text-amber"}>{s.wait}</p>
                  <p className="text-label-sm text-ink-soft">{s.waitLabel}</p>
                </div>
              </div>
              <Meter value={s.load} tone={s.tone} className="mt-3" />
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel>
          <PanelTitle eyebrow="Rhythm of Service" title="Hourly Order Volume & Sales Velocity" />
          <VolumeChart />
          <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-white p-3 text-body-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <p>
              <Sparkles className="mr-1.5 inline size-4 align-[-3px] text-amber" /> Machine throughput is running <b className="text-ink">8.4% faster</b> than
              average Monday cycles.
            </p>
            <Link href="/admin/kds" className="text-label-md font-semibold text-amber">
              View Granular Station Telemetry →
            </Link>
          </div>
        </Panel>

        <Panel>
          <PanelTitle
            eyebrow="Catalog Velocity"
            title="Top Botanical Items"
            description="Real-time demand across our signature house botanicals and bakery craft."
            aside={<Badge variant="secondary" className="bg-oat-deep">Today</Badge>}
          />
          <ol className="flex flex-col gap-2">
            {topItems.map((item, i) => (
              <li key={item.name} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-soft text-label-lg text-amber">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-title-md text-ink">{item.name}</p>
                  <p className="truncate text-label-sm text-ink-soft">{item.meta}</p>
                </div>
                <div className="text-right">
                  <p className="text-title-md text-ink tabular">{item.revenue}</p>
                  <p className={item.delta.startsWith("+") ? "text-label-sm font-bold text-forest" : "text-label-sm text-ink-soft"}>
                    {item.delta}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-3 flex justify-between text-label-sm text-ink-soft">
            <span>Showing top 4 of 32 items</span>
            <Link href="/admin/menu" className="font-semibold text-amber">
              Explore Full Velocity →
            </Link>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel>
          <PanelTitle
            eyebrow="Express KDS Live Flow"
            title="Recent High-Priority Tickets"
            aside={
              <span className="flex items-center gap-1.5 text-label-sm font-semibold text-ink-soft">
                <span className="size-2 animate-pulse rounded-full bg-amber-glow" /> Auto-Sync (3s)
              </span>
            }
          />
          <div className="overflow-hidden rounded-2xl bg-white">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-label-sm uppercase">Ticket / Guest</TableHead>
                  <TableHead className="text-label-sm uppercase">Handcrafted Items</TableHead>
                  <TableHead className="text-label-sm uppercase max-md:hidden">Channel</TableHead>
                  <TableHead className="text-right text-label-sm uppercase">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map(({ icon: Icon, ...t }) => (
                  <TableRow key={t.id} className="hover:bg-oat-light">
                    <TableCell className="py-3 align-top">
                      <p className="text-title-md text-ink">{t.id}</p>
                      <p className="text-body-sm font-semibold text-ink">{t.guest}</p>
                      <p className="text-label-sm text-amber">{t.tier}</p>
                    </TableCell>
                    <TableCell className="max-w-72 py-3 align-top whitespace-normal">
                      <p className="text-body-sm text-ink">{t.items}</p>
                      <p className="text-label-sm text-ink-soft">{t.note}</p>
                    </TableCell>
                    <TableCell className="py-3 align-top max-md:hidden">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-oat px-2.5 py-1 text-label-sm font-semibold">
                        <Icon className="size-3.5 text-amber" /> {t.channel}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-right align-top">
                      <span className={`rounded-full px-2.5 py-1 text-label-sm font-bold ${statusCls[t.tone]}`}>{t.status}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 flex flex-col justify-between gap-1 text-label-sm text-ink-soft sm:flex-row">
            <span>Showing 3 high-priority items • 15 standard tickets in secondary queue</span>
            <Link href="/admin/kds" className="font-semibold text-amber">
              Launch Full Screen KDS Mode →
            </Link>
          </div>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel>
            <PanelTitle
              eyebrow="Barista Supply Watch"
              title="Critical Inventory Thresholds"
              description="Real-time depletion based on current register speed and extraction quotas."
              aside={<TriangleAlert className="size-5 text-danger" />}
            />
            <div className="flex flex-col gap-3">
              {[
                { name: "Minor Figures Oat Milk", level: "Low Reserve: 4 cases remaining", tone: "danger" as const, pct: 18, a: "Depletion rate: 2.1 cases/hr", b: "Restock arrives tomorrow 06:00 AM" },
                { name: "Colombian Pink Bourbon", level: "Running Low: 2.0 kg remaining", tone: "glow" as const, pct: 30, a: "Single origin lot • 12 batches left", b: "Batch #982 roasted 3 days ago" },
              ].map((s) => (
                <div key={s.name} className="rounded-2xl bg-white p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-title-md text-ink">{s.name}</p>
                      <p className={s.tone === "danger" ? "text-label-sm font-semibold text-danger" : "text-label-sm font-semibold text-amber"}>
                        {s.level}
                      </p>
                    </div>
                    <Button variant="secondary" size="xs" className="bg-oat-deep">
                      Restock
                    </Button>
                  </div>
                  <Meter value={s.pct} tone={s.tone} className="my-3" />
                  <div className="grid grid-cols-2 gap-2 text-label-sm text-ink-soft">
                    <span>{s.a}</span>
                    <span>{s.b}</span>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between rounded-2xl bg-oat p-3 text-label-sm">
                <span className="flex items-center gap-2 font-semibold text-ink">
                  <Package className="size-4 text-amber" /> All packaging & cups at 92% capacity
                </span>
                <Link href="/admin/inventory" className="font-semibold text-amber">
                  Manage Stock
                </Link>
              </div>
            </div>
          </Panel>

          <Link href="/admin/inventory" className="group flex items-center gap-4 rounded-3xl bg-oat-light p-5 ring-1 ring-espresso/5 transition-shadow hover:shadow-warm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-oat-deep text-amber">
              <BookMarked className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-title-md text-ink">Head Roaster&apos;s Cupping Note</p>
              <p className="text-body-sm text-ink-soft">Batch #983 Pink Bourbon cupping scored 88.5 — sweeter at day 4.</p>
            </div>
            <ArrowRight className="size-4 text-amber transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
