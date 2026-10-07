"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  BadgePercent,
  Check,
  Coffee,
  Footprints,
  MapPin,
  MessageSquare,
  Navigation,
  Percent,
  Phone,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Timer,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"

import { QrCode } from "@/components/shop/qr-code"
import { Tag } from "@/components/shop/tag"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/data"
import type { CartLine } from "@/lib/cart"
import { useLastOrder } from "@/lib/order"
import { cn } from "@/lib/utils"

const stages = [
  {
    id: "received",
    title: "ទទួលបានការបញ្ជាទិញ",
    text: "ត្រូវបានផ្ញើដោយផ្ទាល់ទៅកាន់ហាង",
    time: "7:31 AM",
    icon: Check,
  },
  {
    id: "handcrafting",
    title: "កំពុងផលិត",
    text: "ហាងកំពុងផលិតសម្រាប់ការកាម៉ងរបស់អ្នក",
    time: "កំពុងស្ងោរ",
    icon: RefreshCw,
  },
  {
    id: "audit",
    title: "ត្រួតពិនិត្យ",
    text: "កំពុងពិនិត្យគុណភាពនិងចំនួនកាម៉ង",
    time: "~7:40 AM",
    icon: Sparkles,
  },
  {
    id: "pickup",
    title: "ការកាម៉ងរបស់អ្នកធ្វើរួចរាល់",
    text: "កំពុងរង់ចាំការទទួលយកអីវ៉ាន",
    time: "ប៉ាន់ស្មាន 7:42 AM",
    icon: ShoppingBag,
  },
]

const fallbackItems: CartLine[] = [
  {
    id: "a",
    slug: "honey-cinnamon-oat-latte",
    name: "Honey Cinnamon Oat Latte",
    image: "/images/latte-cup.jpg",
    unitPrice: 6.75,
    qty: 1,
    details: "12 oz · Hot · Minor Figures Oat Milk · Extra Wildflower Honey",
    tag: "Barista Handcrafted",
  },
  {
    id: "b",
    slug: "avocado-jammy-egg-sourdough",
    name: "Avocado & Soft Boiled Egg Sourdough Tartine",
    image: "/images/avocado-tartine.jpg",
    unitPrice: 11.5,
    qty: 1,
    details: "Country sourdough loaf · Organic avocado mash · Maldon sea salt · Micro cilantro",
  },
  {
    id: "c",
    slug: "basque-burnt-cheesecake",
    name: "Basque Burnt Cheesecake",
    image: "/images/cheesecake-slice.jpg",
    unitPrice: 7.0,
    qty: 1,
    details: "Single slice · Madagascar vanilla bean · Served room temperature",
  },
]

export function OrderStatusView({ id }: { id: string }) {
  const order = useLastOrder()
  const [stage, setStage] = useState(1)

  // Demo progression: the ticket advances through the kitchen sequence every 12s.
  useEffect(() => {
    if (stage >= stages.length - 1) return
    const timer = setTimeout(() => setStage((s) => s + 1), 12000)
    return () => clearTimeout(timer)
  }, [stage])

  const items = order?.items.length ? order.items : fallbackItems
  const subtotal = order ? order.subtotal : 25.25
  const tax = order ? order.tax : 2.34
  const total = order ? order.total : 25.59
  const pickup = order?.pickup ?? "Pick-Up Bar A"
  const ready = stage === stages.length - 1

  const paymentLabel = order?.payment ?? "ABA ឬស្កេន QR"

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-espresso via-espresso-soft to-espresso text-milk">
        <div className="absolute inset-0 opacity-20">
          <Image src="/images/espresso-extraction.jpg" alt="" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 md:px-6 md:py-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex flex-wrap items-center gap-2 text-label-md font-semibold">
              <Badge className="bg-amber text-label-sm font-bold uppercase">
                <span className="size-1.5 animate-pulse rounded-full bg-white" /> ការផ្សាយផ្ទាល់ពីផ្ទះបាយ
              </Badge>
              ការបញ្ជាទិញ #{id} បានបញ្ជាក់
            </p>
            <h1 className="mt-3 font-serif text-display-sm md:text-display">
              {ready
                ? "កាហ្វេរបស់អ្នករួចរាល់ហើយ។"
                : "កំពុងរៀបចំកាហ្វេរបស់អ្នកឥឡូវនេះ។"}
            </h1>
            <p className="mt-2 text-body-lg text-milk/85">
              រំពឹងទុកនឹងប្រគល់ជូននៅម៉ោង <b className="text-milk">7:42 AM</b>{" "}
              {ready ? "(ឥឡូវនេះ)" : "(ក្នុងរយៈពេលប្រមាណ ១ នាទីទៀត)"} · {pickup},
              Downtown Roastery
            </p>
          </div>
          <div className="hidden flex-col gap-2 sm:flex-row">
            <Button
              onClick={() =>
                toast.success("បានជូនដំណឹងទៅបារីស្តាហើយ", {
                  description: "កាហ្វេរបស់អ្នកនឹងនៅត្រង់បញ្ជរក្នុងរយៈពេលតិចជាង ៩០ វិនាទី។",
                })
              }
              className="h-11 gap-2 rounded-full bg-amber px-5 text-title-md text-white hover:bg-amber-bright"
            >
              <Footprints className="size-4" /> ខ្ញុំបានមកដល់ Roastery ហើយ
            </Button>
            <Button
              variant="secondary"
              className="h-11 gap-2 rounded-full bg-milk/15 px-5 text-title-md text-milk hover:bg-milk/25"
            >
              <Wallet className="size-4" /> Apple Wallet
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6">
        <section className="rounded-3xl bg-oat-light p-4 ring-1 ring-espresso/5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
            <div>
              <span className="eyebrow">លំដាប់ការងារផ្ទះបាយ</span>
              <h2 className="mt-1 font-serif text-headline-sm text-ink">ដំណាក់កាលរៀបចំដ៏ល្អិតល្អន់</h2>
            </div>
            <span className="flex items-center gap-1.5 text-label-md font-semibold text-ink-soft">
              <Timer className="size-4 text-amber" /> ជួររង់ចាំ៖ មានការបញ្ជាទិញ ២ មុនអ្នក
            </span>
          </div>
          <ol className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {stages.map((s, i) => {
              const done = i < stage
              const current = i === stage
              const Icon = done ? Check : s.icon
              return (
                <li
                  key={s.id}
                  className={cn(
                    "flex flex-col gap-1.5 rounded-2xl border-l-4 p-4 transition-all",
                    done && "border-amber bg-white",
                    current && "border-amber-bright bg-amber-soft/40 shadow-warm",
                    !done && !current && "border-transparent bg-transparent opacity-70"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full",
                        done && "bg-amber text-white",
                        current && "bg-amber-bright text-white",
                        !done && !current && "bg-oat-deep text-ink-soft"
                      )}
                    >
                      <Icon className={cn("size-3.5", current && !ready && "animate-spin [animation-duration:3s]")} />
                    </span>
                    <span className={cn("text-label-sm font-bold", current ? "text-amber" : "text-ink-soft")}>
                      {current && i !== 1 ? "ដំណើរការរួចរាល់" : s.time}
                    </span>
                  </div>
                  <p className="text-title-md text-ink">
                    {i + 1}. {s.title}
                  </p>
                  <p className="text-body-sm text-ink-soft">{s.text}</p>
                </li>
              )
            })}
          </ol>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <section className="hidden flex-col gap-4 rounded-3xl bg-white p-4 shadow-warm ring-1 ring-espresso/5 sm:flex-row sm:p-5">
              <div className="relative h-44 shrink-0 overflow-hidden rounded-2xl sm:h-auto sm:w-44">
                <Image src="/images/espresso-extraction.jpg" alt="Espresso extraction" fill sizes="176px" className="object-cover" />
                <span className="absolute bottom-2 left-2 rounded-full bg-espresso/80 px-2 py-0.5 text-[10px] font-bold text-milk">
                  ● 93.5°C · 9 Bar
                </span>
              </div>
              <div className="flex flex-col justify-center gap-2">
                <span className="flex items-center gap-1.5 eyebrow">
                  <Coffee className="size-3.5" /> ទម្រង់ការស្រង់ផ្ទាល់
                </span>
                <h2 className="font-serif text-headline-sm text-ink">Synesso MVP Hydra Extraction</h2>
                <p className="text-body-sm text-ink-soft">
                  កាហ្វេ Honey Cinnamon Latte របស់អ្នកកំពុងស្ថិតក្នុងដំណាក់កាលទី ២ នៃការគ្រប់គ្រងសម្ពាធ ដោយប្រើគ្រាប់កាហ្វេអាំងស្រស់{" "}
                  <b className="text-body-md text-ink">Colombian Pink Bourbon</b> ។
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Tag tone="forest">កែច្នៃដោយវិធីអសមុទ្រ</Tag>
                  <Tag tone="amber">រសជាតិ៖ ផ្លែប៉េស និងស្ករអំពៅ</Tag>
                  <Tag>ទឹកឃ្មុំពីកសិដ្ឋានក្នុងស្រុក</Tag>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-4 shadow-warm ring-1 ring-espresso/5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h2 className="font-serif text-headline-sm text-ink">ទំនិញក្នុងកញ្ចប់របស់អ្នក</h2>
                <span className="text-label-md text-ink-soft">
                  {items.reduce((n, l) => n + l.qty, 0)} ទំនិញ ·{" "}
                  លេខបង្កាន់ដៃ #{id}
                </span>
              </div>
              <ul className="flex flex-col gap-3">
                {items.map((l) => (
                  <li key={l.id} className="flex items-center gap-3 rounded-2xl bg-oat-light p-3">
                    <Image src={l.image} alt={l.name} width={56} height={56} className="size-14 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-1.5 text-title-md text-ink">
                        {l.qty > 1 ? `${l.qty}× ` : ""}
                        {l.name}
                        {l.tag ? <Tag tone="amber">{l.tag}</Tag> : null}
                      </p>
                      <p className="text-body-sm text-ink-soft">{l.details}</p>
                    </div>
                    <span className="text-title-md text-ink tabular">{formatPrice(l.unitPrice * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 flex flex-col gap-1.5 text-body-sm">
                <div className="flex justify-between text-ink-soft">
                  <dt>សរុបរង</dt>
                  <dd className="tabular">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ink-soft">
                  <dt>ពន្ធមូលដ្ឋាន និងកញ្ចប់អេកូ</dt>
                  <dd className="tabular">{formatPrice(tax)}</dd>
                </div>
                {order?.tip ? (
                  <div className="flex justify-between text-ink-soft">
                    <dt>ថ្លៃទឹកតែ</dt>
                    <dd className="tabular">{formatPrice(order.tip)}</dd>
                  </div>
                ) : null}
                {order?.promoDiscount ? (
                  <div className="flex justify-between text-ink-soft">
                    <dt className="flex items-center gap-1">
                      ការបញ្ចុះតម្លៃពីកូដប្រូម៉ូសិន <BadgePercent className="size-3.5 text-amber" />
                    </dt>
                    <dd className="font-semibold text-amber tabular">{formatPrice(-order.promoDiscount)}</dd>
                  </div>
                ) : null}
                {order?.discount ? (
                  <div className="flex justify-between text-ink-soft">
                    <dt className="flex items-center gap-1">
                      ការបញ្ចុះតម្លៃដោយផ្ទាល់ <Percent className="size-3.5 text-amber" />
                    </dt>
                    <dd className="font-semibold text-amber tabular">{formatPrice(-order.discount)}</dd>
                  </div>
                ) : null}
              </dl>
              <Separator className="my-3" />
              <div className="flex items-baseline justify-between">
                <span className="flex items-center gap-2 text-title-md text-ink">
                  សរុបបានទូទាត់{" "}
                  <Tag>{paymentLabel}</Tag>
                </span>
                <span className="font-serif text-headline-sm font-semibold text-ink tabular">{formatPrice(total)}</span>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section className="hidden rounded-3xl bg-oat-deep p-5 ring-1 ring-espresso/5">
              <div className="flex items-center justify-between">
                <Badge className="bg-espresso text-label-sm font-bold">សំបុត្រអាទិភាព</Badge>
                <span className="text-label-sm font-semibold text-ink-soft">កូដស្កេនសម្រាប់បារីស្តា</span>
              </div>
              <div className="mx-auto mt-4 w-fit rounded-2xl bg-white p-4 shadow-warm">
                <QrCode seed={`${id}-ELENA`} className="size-40" />
                <p className="mt-2 text-center text-label-sm font-bold tracking-widest text-ink-soft">#{id}-ELENA</p>
              </div>
              <p className="mt-4 text-center font-serif text-headline-sm text-ink">Elena R.</p>
              <p className="text-center text-body-sm text-ink-soft">ឈ្មោះបានបោះពុម្ពនៅលើកែវ</p>
              <div className="mt-4 rounded-2xl bg-white/70 p-4">
                <p className="flex items-center gap-1.5 eyebrow">
                  <Navigation className="size-3.5" /> ចំណុចកំណត់ការទទួល
                </p>
                <p className="mt-1 text-title-md text-ink">{pickup}</p>
                <p className="text-body-sm text-ink-soft">Downtown Roastery · Right adjacent to the brass pour-over drip stand</p>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-5 shadow-warm ring-1 ring-espresso/5">
              <h2 className="text-title-lg text-ink">ទីតាំង និងទំនាក់ទំនង Roastery</h2>
              <div className="relative mt-4 h-40 overflow-hidden rounded-2xl ring-1 ring-border">
                <Image src="/images/map.png" alt="Map of Downtown Flagship" fill sizes="400px" className="object-cover" />
                <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-espresso text-milk shadow-warm-lg">
                  <MapPin className="size-4" />
                </span>
                <span className="absolute bottom-2 left-2 rounded-md bg-white px-2 py-1 text-label-sm font-semibold text-ink shadow-sm">
                  បើកនៅក្នុង Apple Maps
                </span>
              </div>
              <p className="mt-3 text-title-md text-ink">Aura Downtown Flagship</p>
              <p className="text-body-sm text-ink-soft">742 Pine Hill Court, Suite 100 · 0.2 miles away</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button variant="secondary" className="h-9 gap-1.5 rounded-full hover:bg-oat-deep">
                  <Phone className="size-4 text-amber" /> ទូរស័ព្ទទៅ Roastery
                </Button>
                <Button variant="secondary" className="h-9 gap-1.5 rounded-full hover:bg-oat-deep">
                  <MessageSquare className="size-4 text-amber" /> ជជែកជាមួយផ្នែកជំនួយ
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
