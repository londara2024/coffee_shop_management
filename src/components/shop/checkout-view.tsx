"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BellRing,
  Car,
  Check,
  CreditCard,
  Gift,
  Heart,
  Leaf,
  ListChecks,
  Lock,
  Minus,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  Store,
  Timer,
  Trash2,
  UserRound,
  Wallet,
} from "lucide-react"

import { Tag } from "@/components/shop/tag"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { customer, formatPrice } from "@/lib/data"
import { cart, useCart } from "@/lib/cart"
import { saveOrder } from "@/lib/order"
import { cn } from "@/lib/utils"

const TAX_RATE = 0.0825
const tips = [
  { id: "1", label: "$1.00", value: 1 },
  { id: "2", label: "$2.00", value: 2 },
  { id: "3", label: "$3.00", value: 3 },
  { id: "custom", label: "Custom", value: 4 },
  { id: "none", label: "Tip in person", value: 0 },
]
const payments = [
  { id: "apple", label: "Apple Pay", hint: "Default device", sub: "Connected to default wallet", icon: Wallet },
  { id: "visa", label: "Visa ending in 4289", hint: "Preferred", sub: `Exp 09/27 • ${customer.name}`, icon: CreditCard },
  { id: "gift", label: "Aura Botanical Gift Card", sub: "$15.00 available balance", icon: Gift },
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
  const [method, setMethod] = useState("store")
  const [timing, setTiming] = useState("asap")
  const [lowWaste, setLowWaste] = useState(true)
  const [tip, setTip] = useState("2")
  const [payment, setPayment] = useState("visa")
  const [promo, setPromo] = useState("AURAWARMTH")

  const tipValue = tips.find((t) => t.id === tip)?.value ?? 0
  const tax = subtotal * TAX_RATE
  const credit = lowWaste && count > 0 ? -0.5 : 0
  const total = count > 0 ? subtotal + tipValue + tax + credit : 0

  function placeOrder() {
    saveOrder({
      id: "ACR-8942",
      items,
      subtotal,
      tax,
      tip: tipValue,
      credit,
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
            Review Your Order <span className="text-ink-soft">({count} items)</span>
          </h1>
        </div>
        <ol className="flex items-center gap-2 overflow-x-auto rounded-full bg-oat-light p-1.5 text-label-md font-semibold ring-1 ring-espresso/5 scrollbar-none">
          {["Cart & Items", "Pickup Details", "Payment & Tip"].map((step, i) => (
            <li key={step} className="flex items-center gap-2 whitespace-nowrap">
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
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex flex-col gap-6">
          <Panel
            icon={Store}
            title="Pickup Method & Timing"
            aside={<Badge className="bg-forest-soft text-label-sm font-bold text-forest uppercase">Kitchen Open</Badge>}
          >
            <ToggleGroup
              value={[method]}
              onValueChange={(v) => v[0] && setMethod(v[0] as string)}
              className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <ToggleGroupItem value="store" className={tile}>
                <span className="text-title-md text-ink">In-Store Pickup</span>
                <span className="text-body-sm text-ink-soft">Downtown Roastery • 452 Elm St</span>
                <span className="flex items-center gap-1 text-label-md font-semibold text-amber">
                  <Timer className="size-3.5" /> Ready in 10–15 min
                </span>
              </ToggleGroupItem>
              <ToggleGroupItem value="curbside" className={tile}>
                <span className="text-title-md text-ink">Curbside Delivery</span>
                <span className="text-body-sm text-ink-soft">Boutique bay loading zone</span>
                <span className="flex items-center gap-1 text-label-md font-semibold text-ink-soft">
                  <Car className="size-3.5" /> Requires vehicle plate
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-label-md text-ink-soft">Timing Preference:</span>
              <ToggleGroup value={[timing]} onValueChange={(v) => v[0] && setTiming(v[0] as string)} spacing={1}>
                <ToggleGroupItem
                  value="asap"
                  className="h-8 rounded-full px-4 text-label-md font-bold aria-pressed:bg-espresso aria-pressed:text-milk"
                >
                  ASAP (10–15 min)
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="later"
                  className="h-8 rounded-full px-4 text-label-md font-semibold aria-pressed:bg-espresso aria-pressed:text-milk"
                >
                  Schedule for later today
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </Panel>

          <Panel
            icon={ListChecks}
            title="Prepared Line Items"
            aside={
              <Link href="/" className="text-label-md font-semibold text-amber hover:underline">
                Add more items
              </Link>
            }
          >
            <div className="flex flex-col gap-3">
              {items.length === 0 ? (
                <div className="rounded-2xl bg-white p-8 text-center">
                  <p className="font-serif text-headline-sm text-ink">Your bag is empty</p>
                  <Button nativeButton={false} render={<Link href="/" />} className="mt-4 hover:bg-amber">
                    Browse the menu
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
                    <p className="truncate text-body-sm text-ink-soft">{line.details}</p>
                    <Link
                      href={`/product/${line.slug}`}
                      className="mt-0.5 inline-flex items-center gap-1 text-label-sm font-bold text-amber"
                    >
                      <SlidersHorizontal className="size-3" /> Customize
                    </Link>
                  </div>
                  <div className="ml-auto flex items-center gap-3 max-sm:w-full max-sm:justify-end max-sm:border-t max-sm:border-border max-sm:pt-2">
                    <div className="flex items-center gap-0.5 rounded-full bg-oat p-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="rounded-full"
                        aria-label="Decrease"
                        onClick={() => cart.setQty(line.id, line.qty - 1)}
                      >
                        <Minus />
                      </Button>
                      <span className="w-5 text-center text-label-lg tabular">{line.qty}</span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="rounded-full"
                        aria-label="Increase"
                        onClick={() => cart.setQty(line.id, line.qty + 1)}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <span className="w-14 text-right text-title-md text-ink tabular">
                      {formatPrice(line.unitPrice * line.qty)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${line.name}`}
                      onClick={() => cart.remove(line.id)}
                      className="text-ink-soft hover:bg-danger-soft hover:text-danger"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}

              <Label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-forest-soft/60 p-4 font-normal">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-forest text-white">
                  <Leaf className="size-4" />
                </span>
                <span className="flex-1">
                  <span className="block text-title-md text-ink">Low-Waste Preparation</span>
                  <span className="block text-body-sm text-ink-soft">
                    Skip disposable stirrers, plastic stoppers, and extra paper napkins.
                  </span>
                </span>
                <Switch
                  checked={lowWaste}
                  onCheckedChange={setLowWaste}
                  className="data-checked:bg-amber"
                  aria-label="Low-waste preparation"
                />
              </Label>
            </div>
          </Panel>

          <Panel
            icon={UserRound}
            title="Pickup Patron & Membership"
            aside={<span className="eyebrow">{customer.tier}</span>}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                <Image src={customer.avatar} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
                <div>
                  <p className="eyebrow text-ink-soft">Registered Patron</p>
                  <p className="text-title-md text-ink">{customer.name}</p>
                  <p className="text-body-sm text-ink-soft">{customer.phone}</p>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="eyebrow text-ink-soft">Aura Stars Status</p>
                  <span className="text-label-md font-bold text-amber">+22 Stars Earned</span>
                </div>
                <Progress
                  value={(customer.stars / customer.starsGoal) * 100}
                  className="mt-3 [&_[data-slot=progress-indicator]]:bg-amber [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-oat-deep"
                />
                <p className="mt-2 text-body-sm text-ink-soft">
                  {customer.stars} / {customer.starsGoal} stars towards your next reserved Geisha brew.
                </p>
              </div>
            </div>
          </Panel>

          <Panel icon={Wallet} title="Payment Selection">
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
                      {label} {hint ? <Tag tone="amber">{hint}</Tag> : null}
                    </span>
                    <span className="block text-body-sm text-ink-soft">{sub}</span>
                  </span>
                  <Icon className="size-5 text-ink-soft" />
                </Label>
              ))}
            </RadioGroup>
          </Panel>

          <Panel
            icon={Heart}
            title="Barista Love & Gratuity"
            aside={<span className="eyebrow">100% Shared</span>}
          >
            <p className="-mt-2 mb-4 text-body-sm text-ink-soft">
              Directly distributed to the morning roasting & extraction team.
            </p>
            <ToggleGroup
              value={[tip]}
              onValueChange={(v) => v[0] && setTip(v[0] as string)}
              className="grid w-full grid-cols-3 gap-2 sm:grid-cols-5"
            >
              {tips.map((t) => (
                <ToggleGroupItem
                  key={t.id}
                  value={t.id}
                  className="h-10 rounded-lg bg-white text-label-md font-semibold ring-1 ring-border aria-pressed:bg-espresso aria-pressed:text-milk aria-pressed:ring-espresso"
                >
                  {t.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </Panel>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-3xl bg-white p-5 shadow-warm-lg ring-1 ring-espresso/5 sm:p-6">
            <span className="eyebrow">Downtown Workshop Ledger</span>
            <h2 className="mt-1 font-serif text-headline-sm text-ink">Order Summary</h2>
            <dl className="mt-5 flex flex-col gap-2.5 text-body-md">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Line Items Subtotal</dt>
                <dd className="tabular">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex items-center gap-1 text-ink-soft">
                  Barista Love <Heart className="size-3.5 text-amber" />
                </dt>
                <dd className="tabular">{formatPrice(tipValue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-soft">Estimated Tax (8.25%)</dt>
                <dd className="tabular">{formatPrice(tax)}</dd>
              </div>
              {credit ? (
                <div className="flex justify-between text-amber">
                  <dt className="flex items-center gap-1">
                    Eco Low-Waste Credit <Sprout className="size-3.5" />
                  </dt>
                  <dd className="tabular">{formatPrice(credit)}</dd>
                </div>
              ) : null}
            </dl>
            <Separator className="my-4" />
            <div className="flex items-baseline justify-between">
              <span className="text-title-lg text-ink">Total Amount</span>
              <span className="font-serif text-headline-md font-semibold text-ink tabular">{formatPrice(total)}</span>
            </div>

            <div className="mt-5">
              <Label htmlFor="promo" className="eyebrow text-ink-soft">
                Promotional Tasting Code
              </Label>
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-oat-light p-1 ring-1 ring-border">
                <Input
                  id="promo"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  className="h-8 border-0 bg-transparent font-semibold tracking-wider shadow-none focus-visible:ring-0"
                />
                <Badge variant="secondary" className="mr-1 bg-oat-deep text-label-sm">
                  {promo === "AURAWARMTH" ? "Applied" : "Apply"}
                </Badge>
              </div>
              {promo === "AURAWARMTH" ? (
                <p className="mt-1.5 flex items-center gap-1 text-label-sm font-semibold text-amber">
                  <Check className="size-3" /> Code &apos;AURAWARMTH&apos; applied — $0.50 complimentary deduction.
                </p>
              ) : null}
            </div>

            <Button
              onClick={placeOrder}
              disabled={count === 0}
              className="mt-5 h-12 w-full gap-2 rounded-xl text-title-md hover:bg-amber"
            >
              <Lock className="size-4" /> Place Order & Pay {formatPrice(total)}
            </Button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-label-sm font-semibold text-ink-soft">
              <ShieldCheck className="size-3.5 text-amber" /> 256-bit Encrypted Aura SafePay • Instant SMS Confirmation
            </p>

            <div className="mt-5 rounded-2xl bg-oat-light p-4">
              <p className="flex items-center gap-2 text-title-md text-ink">
                <BellRing className="size-4 text-amber" /> Pickup Protocol
              </p>
              <p className="mt-1.5 text-body-sm text-ink-soft">
                Show your confirmation SMS at the Express Botanical Bar counter. Baristas will have your espresso pulled
                fresh within 90 seconds of your arrival.
              </p>
              <div className="mt-3 flex justify-between text-label-sm font-semibold text-ink-soft">
                <span>
                  Roastery Desk: <span className="text-amber underline">(555) 490-1234</span>
                </span>
                <span>Ref: #AR-8942</span>
              </div>
            </div>
          </section>

          <div className="flex gap-3 rounded-2xl bg-oat-light p-4 ring-1 ring-espresso/5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest-soft text-forest">
              <Sprout className="size-5" />
            </span>
            <div>
              <p className="text-title-md text-ink">Origin & Freshness Pledge</p>
              <p className="text-body-sm text-ink-soft">
                Single-lot coffees freshly roasted within 7 days. If your extraction is not flawless, we re-craft with
                pleasure.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
