"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Coffee, CupSoda, Flame, Heart, Minus, Plus, ShoppingBag, Snowflake, Star, Timer } from "lucide-react"
import { toast } from "sonner"

import { Tag } from "@/components/shop/tag"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatPrice, type Product } from "@/lib/data"
import { cart } from "@/lib/cart"
import { cn } from "@/lib/utils"

const sizes = [
  { id: "small", label: "Small", oz: "8 oz", delta: -0.5 },
  { id: "regular", label: "Regular", oz: "12 oz", delta: 0 },
  { id: "large", label: "Large", oz: "16 oz", delta: 0.6 },
]
const temps = [
  { id: "hot", label: "Steamed Hot (145°F)", icon: Flame },
  { id: "iced", label: "Iced Craft", icon: Snowflake },
]
const milks = [
  { id: "oat", label: "Oat Milk", delta: 0 },
  { id: "whole", label: "Whole Milk", delta: 0 },
  { id: "almond", label: "Almond Milk", delta: 0.6 },
  { id: "coconut", label: "Coconut Milk", delta: 0.6 },
  { id: "breve", label: "Organic Breve Half & Half", delta: 0.8 },
]
const toppings = [
  { id: "cinnamon", label: "Ceylon Cinnamon Dusting", delta: 0, locked: true },
  { id: "honey", label: "Extra Wildflower Honey Drizzle", delta: 0.5 },
  { id: "caramel", label: "Salted Caramel Drizzle", delta: 0.75 },
  { id: "foam", label: "Whipped Vanilla Sweet Foam", delta: 1.0 },
  { id: "pecans", label: "Crushed Toasted Pecans", delta: 0.85 },
  { id: "boba", label: "Brown Sugar Boba Pearls", delta: 1.2 },
]
const shots = [
  { id: "double", label: "Double (2)", note: "Included", delta: 0 },
  { id: "triple", label: "Triple (3)", note: "+$1.00", delta: 1 },
]
const sweetness = ["None", "50% Half", "100% Std"]

/** Pill/tile selected state shared by every option group. */
const option =
  "h-auto rounded-lg border-0 bg-oat text-ink hover:bg-oat-deep aria-pressed:bg-espresso aria-pressed:text-milk aria-pressed:shadow-warm"

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-title-md text-ink">{title}</h3>
        {hint ? <span className="text-label-sm font-semibold text-amber">{hint}</span> : null}
      </div>
      {children}
    </div>
  )
}

export function ProductConfigurator({ product }: { product: Product }) {
  const router = useRouter()
  // Admin-created items can opt out of drink options; built-in items leave `customizable` unset.
  const drink = product.category !== "food" && product.category !== "desserts" && product.customizable !== false
  const [size, setSize] = useState("regular")
  const [temp, setTemp] = useState("hot")
  const [milk, setMilk] = useState("oat")
  const [extras, setExtras] = useState<string[]>(["cinnamon", "honey"])
  const [shot, setShot] = useState("double")
  const [sweet, setSweet] = useState("100% Std")
  const [notes, setNotes] = useState("")
  const [qty, setQty] = useState(1)
  const [saved, setSaved] = useState(false)

  const base = product.price
  const unit = drink
    ? base +
      (sizes.find((s) => s.id === size)?.delta ?? 0) +
      (milks.find((m) => m.id === milk)?.delta ?? 0) +
      (shots.find((s) => s.id === shot)?.delta ?? 0) +
      extras.reduce((n, id) => n + (toppings.find((t) => t.id === id)?.delta ?? 0), 0)
    : base
  const total = unit * qty

  function addToOrder() {
    const details = drink
      ? [
          `${sizes.find((s) => s.id === size)!.label} ${sizes.find((s) => s.id === size)!.oz}`,
          temp === "hot" ? "Hot" : "Iced",
          milks.find((m) => m.id === milk)!.label,
          ...extras.filter((e) => e !== "cinnamon").map((e) => toppings.find((t) => t.id === e)!.label),
        ].join(" · ")
      : notes || "House standard preparation"
    cart.add(
      {
        id: `${product.slug}|${size}-${temp}-${milk}-${shot}-${sweet}-${[...extras].sort().join(".")}`,
        slug: product.slug,
        name: product.name,
        image: product.image,
        unitPrice: unit,
        details,
        tag: product.kicker.split(" ")[0],
      },
      qty
    )
    toast.success(`${qty}× ${product.name} added`, {
      description: "Ready for pickup in ~12 mins at Downtown Roastery",
      action: { label: "Review", onClick: () => router.push("/checkout") },
    })
  }

  const stepper = (
    <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-border">
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        aria-label="Decrease quantity"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
      >
        <Minus />
      </Button>
      <span className="w-6 text-center text-title-md tabular">{qty}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        aria-label="Increase quantity"
        onClick={() => setQty((q) => q + 1)}
      >
        <Plus />
      </Button>
    </div>
  )

  return (
    <>
      <div className="flex flex-col gap-6 rounded-3xl bg-white p-5 shadow-warm ring-1 ring-espresso/5 sm:p-7">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-body-sm text-ink-soft">
              <Star className="size-4 fill-amber-bright text-amber-bright" />
              <b className="text-ink">4.9</b> (184 verified reviews)
            </span>
            <Tag tone="amber">Seasonal Harvest</Tag>
          </div>
          <h1 className="font-serif text-display-sm text-ink md:text-headline-lg lg:text-[44px] lg:leading-[52px]">
            {product.name}
          </h1>
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-headline-md font-semibold text-ink tabular">{formatPrice(unit)}</span>
            <span className="text-body-sm text-ink-soft">Tax included • Prepared fresh to order</span>
          </p>
        </div>

        {drink ? (
          <>
            <Section title="Cup Size" hint="Regular (12 oz)">
              <ToggleGroup
                value={[size]}
                onValueChange={(v) => v[0] && setSize(v[0] as string)}
                className="grid w-full grid-cols-3 gap-2"
              >
                {sizes.map((s) => (
                  <ToggleGroupItem key={s.id} value={s.id} className={cn(option, "flex-col gap-0.5 py-3")}>
                    <Coffee className={cn(s.id === "small" ? "size-4" : s.id === "regular" ? "size-5" : "size-6")} />
                    <span className="text-title-md">{s.label}</span>
                    <span className="text-label-sm opacity-75">
                      {s.oz} • {formatPrice(base + s.delta)}
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Section>

            <Section title="Temperature & Ice">
              <ToggleGroup
                value={[temp]}
                onValueChange={(v) => v[0] && setTemp(v[0] as string)}
                className="grid w-full grid-cols-2 gap-2"
              >
                {temps.map(({ id, label, icon: Icon }) => (
                  <ToggleGroupItem key={id} value={id} className={cn(option, "min-h-10 py-2 text-label-lg whitespace-normal")}>
                    <Icon className="size-4" /> {label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Section>

            <Section title="Milk Foundation" hint="House Favorite: Minor Figures Oat">
              <ToggleGroup
                value={[milk]}
                onValueChange={(v) => v[0] && setMilk(v[0] as string)}
                className="grid w-full grid-cols-2 gap-2"
              >
                {milks.map((m) => (
                  <ToggleGroupItem
                    key={m.id}
                    value={m.id}
                    className={cn(option, "justify-between px-3 py-2.5 text-body-md whitespace-normal text-left", m.id === "breve" && "col-span-2")}
                  >
                    <span className="font-semibold">{m.label}</span>
                    <span className="text-label-sm font-semibold opacity-80">
                      {m.delta ? `+${formatPrice(m.delta)}` : "Included"}
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Section>

            <Section title="Toppings & Extra Infusions" hint="Craft add-ons">
              <div className="flex flex-col gap-1.5">
                {toppings.map((t) => {
                  const checked = extras.includes(t.id)
                  return (
                    <Label
                      key={t.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-body-md font-normal transition-colors",
                        checked ? "bg-amber-soft/40" : "bg-oat-light hover:bg-oat"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={t.locked}
                        onCheckedChange={(on) =>
                          setExtras((xs) => (on ? [...xs, t.id] : xs.filter((x) => x !== t.id)))
                        }
                        className="data-checked:border-amber data-checked:bg-amber"
                      />
                      <span className="flex-1 text-ink">{t.label}</span>
                      <span className="text-label-sm font-bold text-amber">
                        {t.locked ? "Signature Standard" : `+${formatPrice(t.delta)}`}
                      </span>
                    </Label>
                  )
                })}
              </div>
            </Section>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Section title="Espresso Dosage">
                <ToggleGroup
                  value={[shot]}
                  onValueChange={(v) => v[0] && setShot(v[0] as string)}
                  className="grid w-full grid-cols-2 gap-2"
                >
                  {shots.map((s) => (
                    <ToggleGroupItem key={s.id} value={s.id} className={cn(option, "flex-col gap-0 py-2")}>
                      <span className="text-label-lg">{s.label}</span>
                      <span className="text-label-sm opacity-75">{s.note}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Section>
              <Section title="Honey Sweetness">
                <ToggleGroup
                  value={[sweet]}
                  onValueChange={(v) => v[0] && setSweet(v[0] as string)}
                  className="grid w-full grid-cols-3 gap-2"
                >
                  {sweetness.map((s) => (
                    <ToggleGroupItem key={s} value={s} className={cn(option, "py-3 text-label-md font-bold")}>
                      {s}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </Section>
            </div>
          </>
        ) : null}

        <Section title="Barista Craft Notes" hint="Optional">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Extra hot 155°F, leave space for ceramic lid, pour into personal thermos…"
            className="min-h-20 rounded-lg bg-oat-light focus-visible:border-amber-bright"
          />
        </Section>

        <div className="hidden flex-col gap-3 rounded-2xl bg-oat-light p-4 ring-1 ring-border lg:flex">
          <div className="flex items-center justify-between">
            {stepper}
            <div className="text-right">
              <p className="eyebrow text-ink-soft">Total amount</p>
              <p className="font-serif text-headline-md font-semibold text-ink tabular">{formatPrice(total)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addToOrder} className="h-11 flex-1 gap-2 rounded-lg text-title-md hover:bg-amber">
              <ShoppingBag className="size-4" /> Add to Order • {formatPrice(total)}
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="Save to favorites"
              onClick={() => setSaved((s) => !s)}
              className="size-11 text-amber hover:bg-amber-soft/40"
            >
              <Heart className={cn("size-5", saved && "fill-amber")} />
            </Button>
          </div>
          <p className="flex items-center gap-1.5 text-label-sm font-semibold text-ink-soft">
            <Timer className="size-3.5 text-amber" /> Ready for pickup in ~12 mins at Downtown Roastery
          </p>
        </div>
      </div>

      {/* Mobile sticky add bar (from the mobile mockup), sits above the tab bar */}
      <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 border-t bg-milk/95 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          {stepper}
          <Button onClick={addToOrder} className="h-11 flex-1 justify-between rounded-xl px-4 text-title-md hover:bg-amber">
            <span className="flex items-center gap-2">
              <CupSoda className="size-4" /> Add to Order
            </span>
            <span className="tabular">{formatPrice(total)}</span>
          </Button>
        </div>
      </div>
    </>
  )
}
