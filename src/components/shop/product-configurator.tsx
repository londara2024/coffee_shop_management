"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Coffee, CupSoda, Flame, Heart, Minus, Plus, ShoppingBag, Snowflake, Star, Timer } from "lucide-react"
import { toast } from "sonner"

import { Tag } from "@/components/shop/tag"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { formatPrice, type Product } from "@/lib/data"
import { cart } from "@/lib/cart"
import { cn } from "@/lib/utils"

const sizes = [
  { id: "small", label: "Small", labelKm: "តូច", oz: "8 oz", delta: -0.5 },
  { id: "regular", label: "Regular", labelKm: "ធម្មតា", oz: "12 oz", delta: 0 },
  { id: "large", label: "Large", labelKm: "ធំ", oz: "16 oz", delta: 0.6 },
]
const temps = [
  { id: "hot", label: "Steamed Hot (145°F)", labelKm: "ក្តៅ", icon: Flame },
  { id: "iced", label: "Iced Craft", labelKm: "ទឹកកក", icon: Snowflake },
]
const milks = [
  { id: "oat", label: "Oat Milk", labelKm: "ទឹកដោះគោអូត", delta: 0 },
  { id: "whole", label: "Whole Milk", labelKm: "ទឹកដោះគោសុទ្ធ", delta: 0 },
  { id: "almond", label: "Almond Milk", labelKm: "ទឹកដោះគោអាល់ម៉ុន", delta: 0.6 },
  { id: "coconut", label: "Coconut Milk", labelKm: "ទឹកដោះគោដូង", delta: 0.6 },
  { id: "breve", label: "Organic Breve Half & Half", labelKm: "ទឹកដោះគោសរីរាង្គ Breve កន្លះ", delta: 0.8 },
]
export const defaultToppings = [
  { id: "cinnamon", label: "Ceylon Cinnamon Dusting", labelKm: "រោយម្សៅស៊ីណាមុនស៊ីឡុង", delta: 0, locked: true },
  { id: "honey", label: "Extra Wildflower Honey Drizzle", labelKm: "ស្រោចទឹកឃ្មុំផ្កាព្រៃបន្ថែម", delta: 0.5 },
  { id: "caramel", label: "Salted Caramel Drizzle", labelKm: "ស្រោចការ៉ាមែលអំបិល", delta: 0.75 },
  { id: "foam", label: "Whipped Vanilla Sweet Foam", labelKm: "ពពុះវ៉ានីឡាផ្អែមវាយក្រែម", delta: 1.0 },
  { id: "pecans", label: "Crushed Toasted Pecans", labelKm: "គ្រាប់ភីខិនអាំងកិន", delta: 0.85 },
  { id: "boba", label: "Brown Sugar Boba Pearls", labelKm: "គុជពែលប៊ូបាស្ករត្នោត", delta: 1.2 },
]
const sweetness = [
  { id: "None", label: "None", labelKm: "គ្មាន" },
  { id: "50% Half", label: "50% Half", labelKm: "៥០% កន្លះ" },
  { id: "100% Std", label: "100% Std", labelKm: "១០០% ស្តង់ដារ" },
  { id: "custom", label: "Custom", labelKm: "កំណត់ដោយខ្លួនឯង" },
]

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
  const name = product.nameKm ?? product.name
  // Admin-created items can opt out of drink options; built-in items leave `customizable` unset.
  const drink = product.category !== "food" && product.category !== "desserts" && product.customizable !== false
  const toppings = product.toppings ?? defaultToppings
  const [size, setSize] = useState("regular")
  const [temp, setTemp] = useState("hot")
  const [milk, setMilk] = useState("oat")
  const [extras, setExtras] = useState<string[]>(() =>
    product.toppings ? toppings.filter((t) => t.locked).map((t) => t.id) : ["cinnamon", "honey"]
  )
  const [sweet, setSweet] = useState("100% Std")
  const [customSweet, setCustomSweet] = useState("")
  const [notes, setNotes] = useState("")
  const [qty, setQty] = useState(1)
  const [saved, setSaved] = useState(false)

  const base = product.price
  const unit = drink
    ? base +
      (sizes.find((s) => s.id === size)?.delta ?? 0) +
      (milks.find((m) => m.id === milk)?.delta ?? 0) +
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
        id: `${product.slug}|${size}-${temp}-${milk}-${sweet === "custom" ? customSweet : sweet}-${[...extras].sort().join(".")}`,
        slug: product.slug,
        name: product.name,
        image: product.image,
        unitPrice: unit,
        details,
        tag: product.kicker.split(" ")[0],
      },
      qty
    )
    toast.success(`បានបន្ថែម ${name} ចំនួន ${qty}×`, {
      description: "រួចរាល់សម្រាប់មករបស់ក្នុងរយៈពេលប្រហែល១២នាទី នៅ Downtown Roastery",
      action: { label: "ពិនិត្យមើល", onClick: () => router.push("/checkout") },
    })
  }

  const stepper = (
    <div className="flex items-center gap-1 rounded-full bg-white p-1 ring-1 ring-border">
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        aria-label="បន្ថយចំនួន"
        onClick={() => setQty((q) => Math.max(1, q - 1))}
      >
        <Minus />
      </Button>
      <span className="w-6 text-center text-title-md tabular">{qty}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        aria-label="បន្ថែមចំនួន"
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
              <b className="text-ink">4.9</b> (១៨៤ការវាយតម្លៃដែលបានផ្ទៀងផ្ទាត់)
            </span>
            <Tag tone="amber">ផលិតផលតាមរដូវ</Tag>
          </div>
          <h1 className="font-serif text-display-sm text-ink md:text-headline-lg lg:text-[44px] lg:leading-[52px]">
            {name}
          </h1>
          <p className="flex items-baseline gap-2">
            <span className="font-serif text-headline-md font-semibold text-ink tabular">{formatPrice(unit)}</span>
            <span className="text-body-sm text-ink-soft">រួមបញ្ចូលពន្ធ • រៀបចំឲ្យស្រស់តាមការកម្ម៉ង់</span>
          </p>
        </div>

        {drink ? (
          <>
            <Section title="ទំហំពែង">
              <ToggleGroup
                value={[size]}
                onValueChange={(v) => v[0] && setSize(v[0] as string)}
                className="grid w-full grid-cols-3 gap-2"
              >
                {sizes.map((s) => (
                  <ToggleGroupItem key={s.id} value={s.id} className={cn(option, "flex-col gap-0.5 py-3")}>
                    <Coffee className={cn(s.id === "small" ? "size-4" : s.id === "regular" ? "size-5" : "size-6")} />
                    <span className="text-title-md">{s.labelKm}</span>
                    <span className="text-label-sm opacity-75">
                      {s.oz} • {formatPrice(base + s.delta)}
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Section>

            <Section title="សីតុណ្ហភាព និងទឹកកក">
              <ToggleGroup
                value={[temp]}
                onValueChange={(v) => v[0] && setTemp(v[0] as string)}
                className="grid w-full grid-cols-2 gap-2"
              >
                {temps.map(({ id, labelKm, icon: Icon }) => (
                  <ToggleGroupItem key={id} value={id} className={cn(option, "min-h-10 py-2 text-label-lg whitespace-normal")}>
                    <Icon className="size-4" /> {labelKm}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Section>

            <Section title="ជម្រើសទឹកដោះគោ">
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
                    <span className="font-semibold">{m.labelKm}</span>
                    <span className="text-label-sm font-semibold opacity-80">
                      {m.delta ? `+${formatPrice(m.delta)}` : "រួមបញ្ចូល"}
                    </span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Section>

            <Section title="គ្រឿងលម្អ និងសារធាតុបន្ថែម">
              <div className="flex flex-col gap-1.5">
                {toppings.map((top) => {
                  const checked = extras.includes(top.id)
                  return (
                    <Label
                      key={top.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-body-md font-normal transition-colors",
                        checked ? "bg-amber-soft/40" : "bg-oat-light hover:bg-oat"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={top.locked}
                        onCheckedChange={(on) =>
                          setExtras((xs) => (on ? [...xs, top.id] : xs.filter((x) => x !== top.id)))
                        }
                        className="data-checked:border-amber data-checked:bg-amber"
                      />
                      <span className="flex-1 text-ink">{top.labelKm ?? top.label}</span>
                      <span className="text-label-sm font-bold text-amber">
                        {top.locked ? "ស្តង់ដារពិសេស" : `+${formatPrice(top.delta)}`}
                      </span>
                    </Label>
                  )
                })}
              </div>
            </Section>

            <Section title="កម្រិតផ្អែម">
              <ToggleGroup
                value={[sweet]}
                onValueChange={(v) => v[0] && setSweet(v[0] as string)}
                className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {sweetness.map((s) => (
                  <ToggleGroupItem key={s.id} value={s.id} className={cn(option, "py-3 text-label-md font-bold")}>
                    {s.labelKm}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {sweet === "custom" ? (
                <Input
                  value={customSweet}
                  onChange={(e) => setCustomSweet(e.target.value)}
                  placeholder="ឧទាហរណ៍៖ ៧៥% កន្លះ"
                  autoFocus
                  className="h-10 rounded-lg bg-oat-light focus-visible:border-amber-bright"
                />
              ) : null}
            </Section>
          </>
        ) : null}

        <Section title="កំណត់ចំណាំ" hint="ស្រេចចិត្ត">
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ឧទាហរណ៍៖ ក្តៅបន្ថែម១៥៥°F ទុកកន្លែងសម្រាប់គំរបសេរ៉ាមិច ចាក់ដាក់ក្នុងកែវទឹកក្តៅផ្ទាល់ខ្លួន…"
            className="min-h-20 rounded-lg bg-oat-light focus-visible:border-amber-bright"
          />
        </Section>

        <div className="hidden flex-col gap-3 rounded-2xl bg-oat-light p-4 ring-1 ring-border lg:flex">
          <div className="flex items-center justify-between">
            {stepper}
            <div className="text-right">
              <p className="eyebrow text-ink-soft">ចំនួនសរុប</p>
              <p className="font-serif text-headline-md font-semibold text-ink tabular">{formatPrice(total)}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={addToOrder} className="h-11 flex-1 gap-2 rounded-lg text-title-md hover:bg-amber">
              <ShoppingBag className="size-4" /> {`បន្ថែមទៅការកម្ម៉ង់ • ${formatPrice(total)}`}
            </Button>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label="រក្សាទុកជាចំណូលចិត្ត"
              onClick={() => setSaved((s) => !s)}
              className="size-11 text-amber hover:bg-amber-soft/40"
            >
              <Heart className={cn("size-5", saved && "fill-amber")} />
            </Button>
          </div>
          <p className="flex items-center gap-1.5 text-label-sm font-semibold text-ink-soft">
            <Timer className="size-3.5 text-amber" /> រួចរាល់សម្រាប់មករបស់ក្នុងរយៈពេលប្រហែល១២នាទី នៅ Downtown Roastery
          </p>
        </div>
      </div>

      {/* Mobile sticky add bar (from the mobile mockup), sits above the tab bar */}
      <div className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 border-t bg-milk/95 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          {stepper}
          <Button onClick={addToOrder} className="h-11 flex-1 justify-between rounded-xl px-4 text-title-md hover:bg-amber">
            <span className="flex items-center gap-2">
              <CupSoda className="size-4" /> បន្ថែមទៅការកម្ម៉ង់
            </span>
            <span className="tabular">{formatPrice(total)}</span>
          </Button>
        </div>
      </div>
    </>
  )
}
