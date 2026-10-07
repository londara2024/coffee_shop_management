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

export const metadata: Metadata = { title: "ទិដ្ឋភាពទូទៅប្រចាំថ្ងៃនៃហាងកាហ្វេ" }

const stations = [
  { icon: Coffee, name: "Bar A • អេស្ប្រេសសូ និងឡាតេ", crew: "Slayer 3-Group", count: 6, noun: "កំពុងច្នៃប្រឌិតការកម្ម៉ង់ដោយដៃ", wait: "2.0 នាទី", waitLabel: "រយៈពេលរង់ចាំជាមធ្យម", load: 62, tone: "amber" as const },
  { icon: Wine, name: "Bar B • បារយឺត និងកាហ្វេត្រជាក់", crew: "Marco Jet + V60", count: 4, noun: "កំពុងស្រក់ជាជួរ", wait: "ទាន់ពេល", waitLabel: "ល្បឿនស្រក់ 3.5 នាទី", load: 40, tone: "forest" as const },
  { icon: CakeSlice, name: "ផ្នែកម្ហូបចំអិន • នំបុ័ង និងតាទីន", crew: "លឿន 1", count: 8, noun: "សំបុត្រកំពុងក្រហល", wait: "4.8 នាទី", waitLabel: "សមត្ថភាពឡ 80%", load: 80, tone: "amber" as const },
]

const topItems = [
  { name: "Honey Cinnamon Oat Latte", meta: "112 ការកម្ម៉ង់ • លាងគ្រាប់ពីរដង", revenue: "$700.00", delta: "+18%" },
  { name: "Brown Sugar Shaken Espresso", meta: "84 ការកម្ម៉ង់ • ជាតិដើមតែមួយ Huila", revenue: "$575.40", delta: "+9%" },
  { name: "Whipped Avocado Tartine", meta: "46 ការកម្ម៉ង់ • នំប៉័ង Sourdough Brioche", revenue: "$437.00", delta: "+14%" },
  { name: "Basque Burnt Cheesecake", meta: "38 ការកម្ម៉ង់ • វ៉ានីល Madagascar", revenue: "$247.00", delta: "ស្ថិរភាព" },
]

const tickets = [
  { id: "#1048", guest: "Elena Rostova", tier: "VIP មាស · អតិថិជនទៀងទាត់ (148 ពិន្ទុ)", items: "2× Honey Cinnamon Oat Latte, 1× Basque Burnt Cheesecake", note: "ទឹកដោះគោអូត ដំបែបន្ថែម នំកំដៅ", channel: "ក្នុងហាងបន្ទាន់", icon: Store, status: "កំពុងស្រង់", tone: "amber" },
  { id: "#1049", guest: "Marcus Chen", tier: "ការកម្ម៉ង់បង់ប្រាក់ជាមុនតាមទូរស័ព្ទ", items: "1× Brown Sugar Shaken Espresso, 1× Avocado Tartine", note: "ទឹកកកតិច ម្ទេសក្រៀមដាក់ម្ខាង", channel: "កន្លែងទទួលក្រៅរថយន្ត ២", icon: Car, status: "ក្នុងជួរ", tone: "neutral" },
  { id: "#1050", guest: "Sophia Vance", tier: "សមាជិកជាវប្រចាំ", items: "1× Geisha Pour Over (Filter Bar), 1× Almond Biscotti", note: "ពែងសិរ៉ាមិកក្តៅ វេចខ្ចប់ថង់គ្រាប់កាហ្វេទាំងគ្រាប់", channel: "ជ្រើសរើសពីបារភ្លក់រស", icon: Coffee, status: "រួចរាល់", tone: "forest" },
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
            ការវិភាគ និងប្រតិបត្តិការហាង • <span className="text-ink-soft normal-case tracking-normal">ទិន្នន័យធ្វើសមកាលកម្ម • បន្តផ្ទាល់</span>
          </>
        }
        title="ទិដ្ឋភាពទូទៅប្រចាំថ្ងៃនៃហាងកាហ្វេ"
        description="ល្បឿនផលិតកម្ម វឌ្ឍនភាពសំបុត្របញ្ជាទិញ និងចរន្តលក់ គ្រប់ខ្សែរបារជាក់ស្តែង។"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="ចំណូលសុទ្ធ"
          icon={Banknote}
          value="$4,892.50"
          foot={
            <span className="text-forest">
              <TrendingUp className="mr-1 inline size-3.5 align-[-2px]" /> +14.2% ធៀបនឹងម្សិលមិញ <span className="text-ink-soft">($4,284.10)</span>
            </span>
          }
        />
        <StatCard
          label="ជួរកំពុងរង់ចាំ"
          icon={Timer}
          value="18"
          unit="សំបុត្រកំពុងដំណើរការ"
          accent
          foot={<span className="text-amber">រយៈពេលរៀបចំជាមធ្យម៖ 6.4 នាទី</span>}
        />
        <StatCard label="ការកម្ម៉ង់សរុប" icon={ClipboardList} value="342" unit="សំបុត្រថ្ងៃនេះ" foot="អត្រាកំពូល៖ 52 ការកម្ម៉ង់/ម៉ោង នៅម៉ោង 08:30 ព្រឹក" />
        <StatCard
          label="ភាពស្មោះត្រង់ និងការពេញចិត្ត"
          icon={Star}
          value="88%"
          unit="សមាជិកមាស"
          accent
          foot={
            <span>
              <b className="text-amber">4.9 ★</b> • ការវាយតម្លៃពីភ្ញៀវ 312 ថ្ងៃនេះ
            </span>
          }
        />
      </div>

      <Panel className="hidden">
        <PanelTitle
          title="ចង្វាក់បញ្ជាទិញផ្ទាល់ និងតុល្យភាពជួរ"
          description="ការបែងចែកបន្ទុកការងារជាក់ស្តែងរវាងបារស្រង់កាហ្វេ និងផ្នែកម្ហូបចំអិន។"
          aside={
            <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-label-sm font-semibold text-ink-soft">
              <span className="size-2 rounded-full bg-forest" /> គ្រប់ស្ថានីយដំណើរការធម្មតា
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
          <PanelTitle eyebrow="ចង្វាក់នៃសេវាកម្ម" title="បរិមាណការកម្ម៉ង់ និងល្បឿនលក់តាមម៉ោង" />
          <VolumeChart />
          <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-white p-3 text-body-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <p>
              <Sparkles className="mr-1.5 inline size-4 align-[-3px] text-amber" /> ល្បឿនម៉ាស៊ីនកំពុងដំណើរការលឿនជាង <b className="text-ink">8.4%</b> បើធៀបនឹងចង្វាក់ថ្ងៃច័ន្ទជាមធ្យម។
            </p>
            <Link href="/admin/kds" className="text-label-md font-semibold text-amber">
              មើលទិន្នន័យលម្អិតតាមស្ថានីយ →
            </Link>
          </div>
        </Panel>

        <Panel>
          <PanelTitle
            eyebrow="ល្បឿនលក់តាមកាតាឡុក"
            title="ទំនិញលក់ដាច់បំផុត"
            description="តម្រូវការជាក់ស្តែងលើទំនិញរុក្ខជាតិពិសេស និងនំធ្វើដោយដៃរបស់ហាង។"
            aside={<Badge variant="secondary" className="bg-oat-deep">ថ្ងៃនេះ</Badge>}
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
            <span>កំពុងបង្ហាញកំពូល 4 ក្នុងចំណោម 32 មុខទំនិញ</span>
            <Link href="/admin/menu" className="font-semibold text-amber">
              មើលទិន្នន័យពេញលេញ →
            </Link>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Panel>
          <PanelTitle
            eyebrow="លំហូរផ្ទាល់ KDS ដ៏លឿន"
            title="សំបុត្របញ្ជាទិញអាទិភាពខ្ពស់ថ្មីៗ"
            aside={
              <span className="flex items-center gap-1.5 text-label-sm font-semibold text-ink-soft">
                <span className="size-2 animate-pulse rounded-full bg-amber-glow" /> ធ្វើសមកាលកម្មស្វ័យប្រវត្តិ (3វិ)
              </span>
            }
          />
          <div className="overflow-hidden rounded-2xl bg-white">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-label-sm uppercase">សំបុត្រ / ភ្ញៀវ</TableHead>
                  <TableHead className="text-label-sm uppercase">ទំនិញធ្វើដោយដៃ</TableHead>
                  <TableHead className="text-label-sm uppercase max-md:hidden">ប្រភពការកម្ម៉ង់</TableHead>
                  <TableHead className="text-right text-label-sm uppercase">ស្ថានភាព</TableHead>
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
            <span>កំពុងបង្ហាញ 3 ធាតុអាទិភាពខ្ពស់ • 15 សំបុត្រធម្មតានៅក្នុងជួរទីពីរ</span>
            <Link href="/admin/kds" className="font-semibold text-amber">
              បើកម៉ូដ KDS ពេញអេក្រង់ →
            </Link>
          </div>
        </Panel>

        <div className="flex flex-col gap-6">
          <Panel>
            <PanelTitle
              eyebrow="ការតាមដានសម្ភារៈបារិស្តា"
              title="កម្រិតស្តុកគ្រោះថ្នាក់"
              description="អត្រាប្រើប្រាស់ជាក់ស្តែង ផ្អែកលើល្បឿនលក់បច្ចុប្បន្ន និងកូតាស្រង់កាហ្វេ។"
              aside={<TriangleAlert className="size-5 text-danger" />}
            />
            <div className="flex flex-col gap-3">
              {[
                { name: "Minor Figures Oat Milk", level: "ស្តុកទាប៖ នៅសល់ 4 ប្រអប់", tone: "danger" as const, pct: 18, a: "អត្រាប្រើប្រាស់៖ 2.1 ប្រអប់/ម៉ោង", b: "ស្តុកថ្មីមកដល់ថ្ងៃស្អែក ម៉ោង 06:00 ព្រឹក" },
                { name: "Colombian Pink Bourbon", level: "ជិតអស់៖ នៅសល់ 2.0 គីឡូក្រាម", tone: "glow" as const, pct: 30, a: "ជាតិដើមតែមួយ • នៅសល់ 12 ជុំ", b: "ជុំ #982 អាំងកាលពី 3 ថ្ងៃមុន" },
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
                      បញ្ជាទិញបន្ថែម
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
                  <Package className="size-4 text-amber" /> កញ្ចប់ និងកែវទាំងអស់មានស្តុក 92%
                </span>
                <Link href="/admin/inventory" className="font-semibold text-amber">
                  គ្រប់គ្រងស្តុក
                </Link>
              </div>
            </div>
          </Panel>

          <Link href="/admin/inventory" className="group flex items-center gap-4 rounded-3xl bg-oat-light p-5 ring-1 ring-espresso/5 transition-shadow hover:shadow-warm">
            <span className="flex size-11 items-center justify-center rounded-xl bg-oat-deep text-amber">
              <BookMarked className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-title-md text-ink">កំណត់ត្រាភ្លក់រសរបស់ប្រធានអ្នកអាំង</p>
              <p className="text-body-sm text-ink-soft">ជុំ #983 Pink Bourbon ទទួលពិន្ទុភ្លក់រស 88.5 — ផ្អែមជាងមុននៅថ្ងៃទី 4។</p>
            </div>
            <ArrowRight className="size-4 text-amber transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
