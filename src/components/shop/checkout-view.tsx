"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Banknote,
  BadgePercent,
  BellRing,
  Car,
  Check,
  Heart,
  ListChecks,
  Lock,
  Minus,
  Percent,
  Plus,
  QrCode,
  SlidersHorizontal,
  Store,
  Timer,
  Trash2,
  Wallet,
} from "lucide-react"

import { Tag } from "@/components/shop/tag"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { customer, formatPrice, formatRiel } from "@/lib/data"
import { cart, useCart } from "@/lib/cart"
import { saveOrder } from "@/lib/order"
import { useShopSettings } from "@/lib/shop-settings"
import { cn } from "@/lib/utils"

const TAX_RATE = 0
const tips = [
  { id: "1", label: "$1.00", value: 1 },
  { id: "2", label: "$2.00", value: 2 },
  { id: "3", label: "$3.00", value: 3 },
  { id: "custom", label: "កំណត់ដោយខ្លួនឯង", value: 4 },
  { id: "none", label: "ជូនរង្វាន់ដោយផ្ទាល់", value: 0 },
]
const promos = [
  { id: "AURAWARMTH", label: "AURAWARMTH", amount: 0.5 },
  { id: "WELCOME5", label: "WELCOME5", amount: 0.75 },
  { id: "FIRSTCUP", label: "FIRSTCUP", amount: 1 },
  { id: "custom", label: "កំណត់ដោយខ្លួនឯង", amount: 0 },
  { id: "none", label: "គ្មានកូដ", amount: 0 },
]
const discounts = [
  { id: "1", label: "បញ្ចុះតម្លៃ $1.00", amount: 1 },
  { id: "2", label: "បញ្ចុះតម្លៃ $2.00", amount: 2 },
  { id: "5", label: "បញ្ចុះតម្លៃ $5.00", amount: 5 },
  { id: "custom", label: "កំណត់ដោយខ្លួនឯង", amount: 0 },
  { id: "none", label: "គ្មានការបញ្ចុះតម្លៃ", amount: 0 },
]
const payments = [
  { id: "aba", label: "ABA ឬស្កេន QR", hint: "ពេញនិយម", sub: "ស្កេនតាមរយៈ ABA Mobile, Wing ឬកម្មវិធី KHQR ណាមួយ", icon: QrCode },
  { id: "cash", label: "សាច់ប្រាក់", sub: "បង់ដោយផ្ទាល់ពេលមកទទួល", icon: Banknote },
]

const orderSteps = [
  { key: "checkout.steps.cart", label: "កន្ត្រក និងទំនិញ" },
  { key: "checkout.steps.pickup", label: "ព័ត៌មានលម្អិតការទទួល" },
  { key: "checkout.steps.payment", label: "ការទូទាត់ និងថ្លៃទឹកតែ" },
]

function Panel({
  icon: Icon,
  title,
  aside,
  className,
  children,
}: {
  icon: typeof Store
  title: string
  aside?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("rounded-3xl bg-oat-light p-4 ring-1 ring-espresso/5 sm:p-6", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-title-lg text-ink">
          <Icon className="size-5 text-amber" /> {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  )
}

const tile =
  "h-auto flex-col items-start gap-1 rounded-2xl border-0 bg-oat p-4 text-left whitespace-normal hover:bg-oat-deep aria-pressed:bg-white aria-pressed:shadow-warm aria-pressed:ring-1 aria-pressed:ring-amber-bright/50"

export function CheckoutView() {
  const router = useRouter()
  const { items, count, subtotal } = useCart()
  const shopSettings = useShopSettings()
  const [method, setMethod] = useState("store")
  const [timing, setTiming] = useState("asap")
  const [tip, setTip] = useState("none")
  const [customTip, setCustomTip] = useState("")
  const [payment, setPayment] = useState("aba")
  const [promo, setPromo] = useState("none")
  const [customPromo, setCustomPromo] = useState("")
  const [discount, setDiscount] = useState("none")
  const [customDiscount, setCustomDiscount] = useState("")

  const tipValue = tip === "custom" ? Number(customTip) || 0 : (tips.find((opt) => opt.id === tip)?.value ?? 0)
  const tax = subtotal * TAX_RATE
  const promoAmount = promo === "custom" ? Number(customPromo) || 0 : (promos.find((p) => p.id === promo)?.amount ?? 0)
  const discountValue =
    discount === "custom" ? Number(customDiscount) || 0 : (discounts.find((d) => d.id === discount)?.amount ?? 0)
  const total = count > 0 ? Math.max(0, subtotal + tipValue + tax - discountValue - promoAmount) : 0

  function placeOrder() {
    saveOrder({
      id: "ACR-8942",
      items,
      subtotal,
      tax,
      tip: tipValue,
      discount: discountValue,
      promoDiscount: promoAmount,
      total,
      payment: payments.find((p) => p.id === payment)!.label,
      pickup: method === "store" ? "Pick-Up Bar A" : "Curbside Bay 2",
    })
    cart.clear()
    router.push("/order/ACR-8942")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="flex items-center gap-1.5 eyebrow">
            <Store className="size-3.5" /> Aura Botanical Express
          </span>
          <h1 className="mt-1 font-serif text-headline-lg-sm text-ink md:text-headline-lg">
            ពិនិត្យមើលការបញ្ជាទិញរបស់អ្នក{" "}
            <span className="text-ink-soft">
              ({count} ធាតុ)
            </span>
          </h1>
        </div>
        <ol className="flex items-center gap-2 overflow-x-auto rounded-full bg-oat-light p-1.5 text-label-md font-semibold ring-1 ring-espresso/5 scrollbar-none">
          {orderSteps.map((step, i) => (
            <li key={step.key} className="flex items-center gap-2 whitespace-nowrap">
              {i > 0 ? <span className="text-ink-mute">/</span> : null}
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full text-[10px]",
                  i === 0 && "bg-amber text-white",
                  i === 1 && "bg-espresso text-milk",
                  i === 2 && "bg-oat-deep text-ink-soft"
                )}
              >
                {i === 0 ? <Check className="size-3" /> : i + 1}
              </span>
              <span className={cn("pr-2", i === 0 ? "text-amber" : i === 1 ? "text-ink" : "text-ink-soft")}>
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex flex-col gap-6">
          <Panel
            icon={Store}
            title="វិធីទទួល និងពេលវេលា"
            aside={
              <Badge
                className={cn(
                  "text-label-sm font-bold uppercase",
                  shopSettings.isOpen ? "bg-forest-soft text-forest" : "bg-danger-soft text-danger"
                )}
              >
                {shopSettings.isOpen ? "ផ្ទះបាយកំពុងបើក" : "ផ្ទះបាយបានបិទ"}
              </Badge>
            }
          >
            <ToggleGroup
              value={[method]}
              onValueChange={(v) => v[0] && setMethod(v[0] as string)}
              disabled
              className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <ToggleGroupItem value="store" className={tile}>
                <span className="text-title-md text-ink">ទទួលនៅហាង</span>
                <span className="text-body-sm text-ink-soft">
                  Downtown Roastery • 452 Elm St
                </span>
                <span className="flex items-center gap-1 text-label-md font-semibold text-amber">
                  <Timer className="size-3.5" /> ត្រៀមរួចក្នុងរយៈពេល ១០–១៥ នាទី
                </span>
              </ToggleGroupItem>
              <ToggleGroupItem value="curbside" className={tile}>
                <span className="text-title-md text-ink">ដឹកជញ្ជូនតាមផ្លូវ</span>
                <span className="text-body-sm text-ink-soft">
                  តំបន់ចតរថយន្តសម្រាប់ទទួលទំនិញ
                </span>
                <span className="flex items-center gap-1 text-label-md font-semibold text-ink-soft">
                  <Car className="size-3.5" /> ត្រូវការស្លាកលេខរថយន្ត
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-label-md text-ink-soft">ពេលវេលាដែលចង់ទទួល៖</span>
              <ToggleGroup value={[timing]} onValueChange={(v) => v[0] && setTiming(v[0] as string)} disabled spacing={1}>
                <ToggleGroupItem
                  value="asap"
                  className="h-8 rounded-full px-4 text-label-md font-bold aria-pressed:bg-espresso aria-pressed:text-milk"
                >
                  ភ្លាមៗ (១០–១៥ នាទី)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="later"
                  className="h-8 rounded-full px-4 text-label-md font-semibold aria-pressed:bg-espresso aria-pressed:text-milk"
                >
                  កំណត់ពេលក្រោយថ្ងៃនេះ
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </Panel>

          <Panel
            icon={ListChecks}
            title="ទំនិញដែលបានរៀបចំ"
            aside={
              <Link href="/" className="text-label-md font-semibold text-amber hover:underline">
                បន្ថែមទំនិញទៀត
              </Link>
            }
          >
            <div className="flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="rounded-2xl bg-white p-8 text-center">
                  <p className="font-serif text-headline-sm text-ink">កន្ត្រករបស់អ្នកនៅទទេ</p>
                  <Button nativeButton={false} render={<Link href="/" />} className="mt-4 hover:bg-amber">
                    មើលម៉ឺនុយ
                  </Button>
                </div>
              ) : null}
              {items.map((line) => (
                <div
                  key={line.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-warm sm:flex-nowrap sm:gap-4"
                >
                  <Image
                    src={line.image}
                    alt={line.name}
                    width={72}
                    height={72}
                    className="size-16 shrink-0 rounded-xl object-cover sm:size-18"
                  />
                  <div className="min-w-0 flex-1 basis-[calc(100%-5.5rem)] sm:basis-auto">
                    <p className="flex flex-wrap items-center gap-1.5 text-title-md text-ink">
                      {line.name}
                      {line.tag ? <Tag tone={line.tag === "Kitchen" ? "forest" : "amber"}>{line.tag}</Tag> : null}
                    </p>
                    <p className="text-body-sm text-ink-soft">{line.details}</p>
                    <Link
                      href={`/product/${line.slug}`}
                      className="mt-0.5 inline-flex items-center gap-1 text-label-sm font-bold text-amber"
                    >
                      <SlidersHorizontal className="size-3" /> កែសម្រួល
                    </Link>
                  </div>
                  <div className="ml-auto flex items-center gap-3 max-sm:w-full max-sm:justify-end max-sm:border-t max-sm:border-border max-sm:pt-2">
                    <div className="flex items-center gap-0.5 rounded-full bg-oat p-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="rounded-full"
                        aria-label="បន្ថយចំនួន"
                        onClick={() => cart.setQty(line.id, line.qty - 1)}
                      >
                        <Minus />
                      </Button>
                      <span className="w-5 text-center text-label-lg tabular">{line.qty}</span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="rounded-full"
                        aria-label="បន្ថែមចំនួន"
                        onClick={() => cart.setQty(line.id, line.qty + 1)}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <span className="flex w-20 flex-col items-end">
                      <span className="text-title-md text-ink tabular">{formatPrice(line.unitPrice * line.qty)}</span>
                      <span className="text-label-sm text-ink-soft tabular">{formatRiel(line.unitPrice * line.qty)}</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`លុប ${line.name}`}
                      onClick={() => cart.remove(line.id)}
                      className="text-ink-soft hover:bg-danger-soft hover:text-danger"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel icon={Wallet} title="ជម្រើសការទូទាត់">
            <RadioGroup value={payment} onValueChange={(v) => setPayment(v as string)} className="gap-3">
              {payments.map(({ id, label, hint, sub, icon: Icon }) => (
                <Label
                  key={id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-2xl bg-white p-4 font-normal ring-1 transition-shadow",
                    payment === id ? "shadow-warm ring-amber-bright/60" : "ring-transparent hover:ring-border"
                  )}
                >
                  <RadioGroupItem value={id} className="data-checked:border-amber data-checked:bg-amber" />
                  <span className="flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-title-md text-ink">
                      {label}{" "}
                      {hint ? <Tag tone="amber">{hint}</Tag> : null}
                    </span>
                    <span className="block text-body-sm text-ink-soft">
                      {sub}
                      {id === "cash" ? ` • ${customer.name}` : null}
                    </span>
                  </span>
                  <Icon className="size-5 text-ink-soft" />
                </Label>
              ))}
            </RadioGroup>
          </Panel>

          <Panel
            icon={Heart}
            title="ថ្លៃទឹកតែ"
            aside={<span className="eyebrow">ចែកចាយ ១០០%</span>}
          >
            <p className="-mt-2 mb-4 text-body-sm text-ink-soft">
              ចែកជូនផ្ទាល់ដល់ក្រុមបារីស្តាដែលចាំបុរាំង និងស្រង់កាហ្វេពេលព្រឹក។
            </p>
            <ToggleGroup
              value={[tip]}
              onValueChange={(v) => v[0] && setTip(v[0] as string)}
              className="grid w-full grid-cols-3 gap-2 sm:grid-cols-5"
            >
              {tips.map((opt) => (
                <ToggleGroupItem
                  key={opt.id}
                  value={opt.id}
                  className="h-10 rounded-lg bg-white text-label-md font-semibold ring-1 ring-border aria-pressed:bg-espresso aria-pressed:text-milk aria-pressed:ring-espresso"
                >
                  {opt.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {tip === "custom" ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white p-1 ring-1 ring-border">
                <span className="pl-2 text-label-md font-semibold text-ink-soft">$</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.01}
                  autoFocus
                  value={customTip}
                  onChange={(e) => setCustomTip(e.target.value)}
                  placeholder="0.00"
                  className="h-8 border-0 bg-transparent px-1 font-semibold shadow-none focus-visible:ring-0"
                />
              </div>
            ) : null}
          </Panel>

          <Panel
            icon={BadgePercent}
            title="ការបញ្ចុះតម្លៃពីកូដប្រូម៉ូសិន"
            aside={
              <span className="eyebrow">
                {promoAmount ? "បានអនុវត្ត" : "គ្មានកូដ"}
              </span>
            }
          >
            <p className="-mt-2 mb-4 text-body-sm text-ink-soft">
              បញ្ចូលកូដប្រូម៉ូសិនដើម្បីសន្សំលើការបញ្ជាទិញរបស់អ្នក។
            </p>
            <ToggleGroup
              value={[promo]}
              onValueChange={(v) => v[0] && setPromo(v[0] as string)}
              className="grid w-full grid-cols-3 gap-2 sm:grid-cols-5"
            >
              {promos.map((p) => (
                <ToggleGroupItem
                  key={p.id}
                  value={p.id}
                  className="h-10 rounded-lg bg-white text-label-md font-semibold ring-1 ring-border aria-pressed:bg-espresso aria-pressed:text-milk aria-pressed:ring-espresso"
                >
                  {p.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {promo === "custom" ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white p-1 ring-1 ring-border">
                <span className="pl-2 text-label-md font-semibold text-ink-soft">$</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.01}
                  autoFocus
                  value={customPromo}
                  onChange={(e) => setCustomPromo(e.target.value)}
                  placeholder="0.00"
                  className="h-8 border-0 bg-transparent px-1 font-semibold shadow-none focus-visible:ring-0"
                />
              </div>
            ) : null}
            {promoAmount ? (
              <p className="mt-1.5 flex items-center gap-1 text-label-sm font-semibold text-amber">
                <Check className="size-3" /> កូដ &apos;
                {promo === "custom" ? "កំណត់ដោយខ្លួនឯង" : promo}&apos;{" "}
                ត្រូវបានអនុវត្ត — {formatPrice(promoAmount)}{" "}
                ជាការបញ្ចុះតម្លៃពិសេស។
              </p>
            ) : null}
          </Panel>

          <Panel
            icon={Percent}
            title="ការបញ្ចុះតម្លៃដោយផ្ទាល់"
            aside={
              <span className="eyebrow">
                {discountValue ? "បានអនុវត្ត" : "គ្មានការបញ្ចុះតម្លៃ"}
              </span>
            }
          >
            <p className="-mt-2 mb-4 text-body-sm text-ink-soft">
              គ្មានកូដប្រូម៉ូសិនមែនទេ? យកការបញ្ចុះតម្លៃដកចេញពីសរុបរបស់អ្នកបានតែម្តង។
            </p>
            <ToggleGroup
              value={[discount]}
              onValueChange={(v) => v[0] && setDiscount(v[0] as string)}
              className="grid w-full grid-cols-3 gap-2 sm:grid-cols-5"
            >
              {discounts.map((d) => (
                <ToggleGroupItem
                  key={d.id}
                  value={d.id}
                  className="h-10 rounded-lg bg-white text-label-md font-semibold ring-1 ring-border aria-pressed:bg-espresso aria-pressed:text-milk aria-pressed:ring-espresso"
                >
                  {d.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {discount === "custom" ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-white p-1 ring-1 ring-border">
                <span className="pl-2 text-label-md font-semibold text-ink-soft">$</span>
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.01}
                  autoFocus
                  value={customDiscount}
                  onChange={(e) => setCustomDiscount(e.target.value)}
                  placeholder="0.00"
                  className="h-8 border-0 bg-transparent px-1 font-semibold shadow-none focus-visible:ring-0"
                />
              </div>
            ) : null}
            {discountValue ? (
              <p className="mt-1.5 flex items-center gap-1 text-label-sm font-semibold text-amber">
                <Check className="size-3" /> {formatPrice(discountValue)}{" "}
                ត្រូវបានកាត់ចេញដោយផ្ទាល់ពីសរុបរបស់អ្នក។
              </p>
            ) : null}
          </Panel>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-3xl bg-white p-5 shadow-warm-lg ring-1 ring-espresso/5 sm:p-6">
            <span className="eyebrow">បញ្ជីកិច្ចការ Downtown Workshop</span>
            <h2 className="mt-1 font-serif text-headline-sm text-ink">សេចក្តីសង្ខេបការបញ្ជាទិញ</h2>
            <dl className="mt-5 flex flex-col gap-2.5 text-body-md">
              <div className="flex justify-between">
                <dt className="text-ink-soft">សរុបរងតម្លៃទំនិញ</dt>
                <dd className="flex flex-col items-end">
                  <span className="tabular">{formatPrice(subtotal)}</span>
                  <span className="text-label-sm text-ink-soft tabular">{formatRiel(subtotal)}</span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-ink-soft">
                  ថ្លៃទឹកតែ <Heart className="size-3.5 text-amber" />
                </dt>
                <dd className="flex flex-col items-end">
                  <span className="tabular">{formatPrice(tipValue)}</span>
                  <span className="text-label-sm text-ink-soft tabular">{formatRiel(tipValue)}</span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">ពន្ធប៉ាន់ស្មាន (0%)</dt>
                <dd className="flex flex-col items-end">
                  <span className="tabular">{formatPrice(tax)}</span>
                  <span className="text-label-sm text-ink-soft tabular">{formatRiel(tax)}</span>
                </dd>
              </div>
              {promoAmount ? (
                <div className="flex justify-between text-amber">
                  <dt className="flex items-center gap-1">
                    ការបញ្ចុះតម្លៃពីកូដប្រូម៉ូសិន <BadgePercent className="size-3.5" />
                  </dt>
                  <dd className="flex flex-col items-end">
                    <span className="tabular">{formatPrice(-promoAmount)}</span>
                    <span className="text-label-sm tabular">{formatRiel(-promoAmount)}</span>
                  </dd>
                </div>
              ) : null}
              {discountValue ? (
                <div className="flex justify-between text-amber">
                  <dt className="flex items-center gap-1">
                    ការបញ្ចុះតម្លៃដោយផ្ទាល់ <Percent className="size-3.5" />
                  </dt>
                  <dd className="flex flex-col items-end">
                    <span className="tabular">{formatPrice(-discountValue)}</span>
                    <span className="text-label-sm tabular">{formatRiel(-discountValue)}</span>
                  </dd>
                </div>
              ) : null}
            </dl>
            <Separator className="my-4" />
            <div className="flex items-baseline justify-between">
              <span className="text-title-lg text-ink">ចំនួនទឹកប្រាក់សរុប</span>
              <span className="flex flex-col items-end">
                <span className="font-serif text-headline-md font-semibold text-ink tabular">{formatPrice(total)}</span>
                <span className="text-label-sm text-ink-soft tabular">{formatRiel(total)}</span>
              </span>
            </div>

            <Button
              onClick={placeOrder}
              disabled={count === 0}
              className="mt-5 h-12 w-full gap-2 rounded-xl text-title-md hover:bg-amber"
            >
              <Lock className="size-4" /> ដាក់ការបញ្ជាទិញ និងទូទាត់ប្រាក់ {formatPrice(total)} (
              {formatRiel(total)})
            </Button>
            <div className="mt-5 rounded-2xl bg-oat-light p-4">
              <p className="flex items-center gap-2 text-title-md text-ink">
                <BellRing className="size-4 text-amber" /> គោលការណ៍ទទួលទំនិញ
              </p>
              <p className="mt-1.5 text-body-sm text-ink-soft">
                បង្ហាញសារ SMS បញ្ជាក់របស់អ្នកនៅកន្លែងបញ្ជរ Express Botanical Bar។ បារីស្តានឹងស្រង់កាហ្វេថ្មីៗជូនអ្នកក្នុងរយៈពេល ៩០ វិនាទីបន្ទាប់ពីអ្នកមកដល់។
              </p>
              <div className="mt-3 flex justify-between text-label-sm font-semibold text-ink-soft">
                <span>
                  ការិយាល័យ Roastery៖ <span className="text-amber underline">(555) 490-1234</span>
                </span>
                <span>
                  លេខយោង៖ #AR-8942
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
