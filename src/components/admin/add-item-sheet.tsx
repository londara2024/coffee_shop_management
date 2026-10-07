"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Check, CirclePlus, ImageUp, Plus, X } from "lucide-react"
import { toast } from "sonner"

import { ProductCard } from "@/components/shop/product-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { catalog, slugify, slugTaken, type CustomProduct } from "@/lib/catalog"
import { categories, formatPrice, pairings, products, type CategoryId, type Product, type Tone } from "@/lib/data"
import { resizeImage } from "@/lib/image"
import { cn } from "@/lib/utils"
import { defaultToppings as STANDARD_TOPPINGS } from "@/components/shop/product-configurator"

const DRINKS: CategoryId[] = ["coffee", "tea"]
const MAX_TAGS = 3
const PLACEHOLDER = "/images/emblem.jpg"

/** Photos already in /public/images that make sense as menu imagery. */
const library = [...new Set([...products.map((p) => p.image), ...pairings.map((p) => p.image), "/images/latte-hero.jpg"])]

const toneLabel: Record<Tone, string> = { forest: "បៃតង", amber: "លឿង", neutral: "ធម្មតា" }

type Form = {
  name: string
  category: CategoryId
  kicker: string
  size1: string
  size2: string
  size3: string
  badge: string
  description: string
  image: string | null
  tags: { label: string; tone: Tone }[]
  live: boolean
  customizable: boolean
}
type Errors = Partial<Record<"name" | "price" | "image" | "tags", string>>

const blank = (category: CategoryId): Form => ({
  name: "",
  category,
  kicker: "",
  size1: "",
  size2: "",
  size3: "",
  badge: "",
  description: "",
  image: null,
  tags: [],
  live: true,
  customizable: DRINKS.includes(category),
})


function FieldLabel({ htmlFor, children, hint }: { htmlFor?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <Label htmlFor={htmlFor} className="text-label-lg text-ink">
        {children}
      </Label>
      {hint ? <span className="text-label-sm text-ink-soft">{hint}</span> : null}
    </div>
  )
}

function ErrorText({ id, children }: { id: string; children?: string }) {
  return children ? (
    <p id={id} className="text-label-md font-semibold text-danger">
      {children}
    </p>
  ) : null
}

const input = "h-10 rounded-lg bg-oat-light focus-visible:border-amber-bright focus-visible:ring-amber-bright/20"

/** Mount with a fresh `key` per opening so every new item starts from a blank form. */
export function AddItemSheet({
  open,
  onOpenChange,
  defaultCategory,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultCategory: CategoryId
  onCreated: (item: CustomProduct) => void
}) {
  const [form, setForm] = useState<Form>(() => blank(defaultCategory))
  const [errors, setErrors] = useState<Errors>({})
  const [tagDraft, setTagDraft] = useState("")
  const [tagTone, setTagTone] = useState<Tone>("forest")
  const [standardToppings, setStandardToppings] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    // Editing a field clears its error; the rest stay until the next submit.
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }))
  }
  const drink = DRINKS.includes(form.category)
  const category = categories.find((c) => c.id === form.category)!
  const sizePriceNums = [Number(form.size1) || 0, Number(form.size2) || 0, Number(form.size3) || 0] as [number, number, number]
  const sizePrices = sizePriceNums.some(Boolean) ? sizePriceNums : undefined
  const toppingsForProduct = standardToppings.length
    ? STANDARD_TOPPINGS.filter((t) => standardToppings.includes(t.id))
    : undefined

  function addTag() {
    const label = tagDraft.trim()
    if (!label) return
    if (form.tags.length >= MAX_TAGS) return setErrors((e) => ({ ...e, tags: `អនុញ្ញាតតែ ${MAX_TAGS} ស្លាកក្នុងមួយទំនិញ។` }))
    if (form.tags.some((t) => t.label.toLowerCase() === label.toLowerCase()))
      return setErrors((e) => ({ ...e, tags: "ស្លាកនេះត្រូវបានបន្ថែមរួចហើយ។" }))
    set("tags", [...form.tags, { label, tone: tagTone }])
    setTagDraft("")
    setErrors((e) => ({ ...e, tags: undefined }))
  }

  async function onUpload(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith("image/")) return setErrors((e) => ({ ...e, image: "សូមជ្រើសរើសឯកសាររូបភាព (JPG, PNG, WebP)។" }))
    if (file.size > 8 * 1024 * 1024) return setErrors((e) => ({ ...e, image: "សូមប្រើរូបភាពទំហំក្រោម ៨ MB។" }))
    try {
      set("image", await resizeImage(file))
      setErrors((e) => ({ ...e, image: undefined }))
    } catch {
      setErrors((e) => ({ ...e, image: "មិនអាចអានរូបភាពនេះបានទេ — សូមសាកល្បងឯកសារផ្សេង។" }))
    }
  }

  function validate(): Errors {
    const e: Errors = {}
    const name = form.name.trim()
    if (name.length < 3) e.name = "សូមដាក់ឈ្មោះទំនិញ (យ៉ាងតិច ៣ តួអក្សរ)។"
    else if (slugTaken(slugify(name))) e.name = "មានទំនិញឈ្មោះនេះរួចហើយ។"
    const price = Number(form.size2)
    if (!form.size2 || !Number.isFinite(price) || price <= 0) e.price = "សូមបញ្ចូលតម្លៃធម្មតាលើសពី $0។"
    else if (price > 999) e.price = "តម្លៃនេះហាក់ដូចជាខ្ពស់ពេក។"
    if (!form.image) e.image = "សូមជ្រើសរើសរូបភាពពីបណ្ណាល័យ ឬបញ្ចូលថ្មី។"
    return e
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      toast.error("សូមពិនិត្យមើលចន្លោះដែលបានបញ្ជាក់")
      return
    }
    const item = catalog.add({
      slug: slugify(form.name.trim()),
      name: form.name.trim(),
      category: form.category,
      kicker: form.kicker.trim() || "ទំនិញថ្មី",
      price: Math.round(Number(form.size2) * 100) / 100,
      sizePrices,
      image: form.image!,
      badge: form.badge.trim() || (category.labelKm ?? category.label),
      tags: form.tags.length ? form.tags : [{ label: "ថ្មី", tone: "amber" }],
      toppings: toppingsForProduct,
      description: form.description.trim() || undefined,
      customizable: drink && form.customizable,
      live: form.live,
    })
    toast.success(`បានបន្ថែម ${item.name} ទៅក្នុង ${category.labelKm ?? category.label}`, {
      description: item.live ? "កំពុងបង្ហាញនៅលើម៉ឺនុយគេហទំព័រហើយឥឡូវនេះ។" : "បានរក្សាទុកជាលាក់ (ដកចេញ) — សូមបើកបង្ហាញនៅពេលត្រៀមរួច។",
    })
    onCreated(item)
    onOpenChange(false)
  }

  // Preview mirrors exactly what the customer menu card will render.
  const preview: Product = {
    slug: "preview",
    name: form.name.trim() || "ធាតុម៉ឺនុយថ្មី",
    category: form.category,
    kicker: form.kicker.trim() || "ទំនិញថ្មី",
    price: Number(form.size2) > 0 ? Number(form.size2) : 0,
    sizePrices,
    image: form.image ?? PLACEHOLDER,
    badge: form.badge.trim() || (category.labelKm ?? category.label),
    tags: form.tags.length ? form.tags : [{ label: "ថ្មី", tone: "amber" }],
    toppings: toppingsForProduct,
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 bg-milk p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
        <form noValidate onSubmit={submit} className="flex h-full flex-col">
          <div className="border-b bg-white px-5 py-4 pr-12 sm:px-6">
            <p className="eyebrow">ប្រតិបត្តិការម៉ឺនុយហាង</p>
            <SheetTitle className="mt-0.5 font-serif text-headline-sm text-ink">បន្ថែមម្ហូបថ្មី</SheetTitle>
            <SheetDescription className="text-body-sm text-ink-soft">
              បង្កើតកាតទំនិញសម្រាប់ម៉ឺនុយគេហទំព័រ និង POS។ វាលដែលមានសញ្ញា * ត្រូវបំពេញ។
            </SheetDescription>
          </div>

          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-5 sm:px-6">
            <section className="flex flex-col gap-2">
              <p className="eyebrow text-ink-soft">ការមើលជាមុនកាតម៉ឺនុយ</p>
              <div inert className="pointer-events-none">
                <ProductCard product={preview} />
              </div>
              <p className="text-label-sm text-ink-soft">
                ចំណងជើងរង និងទំហំតម្លៃ មិនបង្ហាញទីនេះទេ — ពួកវានឹងបង្ហាញនៅលើទំព័រលម្អិតរបស់ទំនិញ។
              </p>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="item-name">ឈ្មោះទំនិញ *</FieldLabel>
                <Input
                  id="item-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="ឧទាហរណ៍៖ កាហ្វេត្រជាក់ម្របល៍ភីខិន"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby="item-name-error"
                  className={input}
                />
                <ErrorText id="item-name-error">{errors.name}</ErrorText>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FieldLabel>ប្រភេទ *</FieldLabel>
                  <Select
                    value={form.category}
                    items={Object.fromEntries(categories.map((c) => [c.id, c.labelKm ?? c.label]))}
                    onValueChange={(v) => {
                      if (!v) return
                      const category = v as CategoryId
                      setForm((f) => ({ ...f, category, customizable: DRINKS.includes(category) }))
                    }}
                  >
                    <SelectTrigger aria-label="ប្រភេទ" className="h-10! w-full rounded-lg bg-oat-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.labelKm ?? c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="item-kicker" hint="បង្ហាញនៅលើទំព័រទំនិញ">
                    ចំណងជើងរង
                  </FieldLabel>
                  <Input
                    id="item-kicker"
                    value={form.kicker}
                    onChange={(e) => set("kicker", e.target.value)}
                    placeholder="ឧទាហរណ៍៖ កាហ្វេតាមរដូវ"
                    className={input}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="item-size2" hint="បង្ហាញនៅលើទំព័រទំនិញ">
                  ទំហំតម្លៃ ($) *
                </FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-label-sm text-ink-soft">តូច</span>
                    <Input
                      aria-label="តម្លៃ ទំហំតូច"
                      inputMode="decimal"
                      value={form.size1}
                      onChange={(e) => set("size1", e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="6.00"
                      className={cn(input, "tabular")}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-label-sm text-ink-soft">ធម្មតា</span>
                    <Input
                      id="item-size2"
                      inputMode="decimal"
                      value={form.size2}
                      onChange={(e) => set("size2", e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="6.50"
                      aria-invalid={errors.price ? true : undefined}
                      aria-describedby="item-price-error"
                      className={cn(input, "tabular")}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-label-sm text-ink-soft">ធំ</span>
                    <Input
                      aria-label="តម្លៃ ទំហំធំ"
                      inputMode="decimal"
                      value={form.size3}
                      onChange={(e) => set("size3", e.target.value.replace(/[^0-9.]/g, ""))}
                      placeholder="7.00"
                      className={cn(input, "tabular")}
                    />
                  </div>
                </div>
                <ErrorText id="item-price-error">{errors.price}</ErrorText>
              </div>

              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="item-description" hint="បង្ហាញនៅលើទំព័រទំនិញ">
                  ការពិពណ៌នា
                </FieldLabel>
                <Textarea
                  id="item-description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="កំណត់ចំណាំរសជាតិ ដើមកំណើត វិធីរៀបចំ…"
                  className="min-h-20 rounded-lg bg-oat-light focus-visible:border-amber-bright"
                />
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <FieldLabel hint={errors.image ? undefined : "ពីបណ្ណាល័យ ឬបញ្ចូលថ្មី"}>រូបភាព *</FieldLabel>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={cn(
                    "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-espresso/25 bg-white text-label-sm font-semibold text-ink-soft transition-colors hover:border-amber hover:text-amber",
                    form.image?.startsWith("data:") && "border-2 border-solid border-amber text-amber"
                  )}
                >
                  {form.image?.startsWith("data:") ? <Check className="size-5" /> : <ImageUp className="size-5" />}
                  {form.image?.startsWith("data:") ? "បានបញ្ចូល" : "បញ្ចូលរូបភាព"}
                </button>
                {library.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => {
                      set("image", src)
                      setErrors((e) => ({ ...e, image: undefined }))
                    }}
                    aria-label={`ប្រើរូបភាព ${src.split("/").pop()}`}
                    aria-pressed={form.image === src}
                    className={cn(
                      "relative aspect-square overflow-hidden rounded-lg ring-offset-2 ring-offset-milk transition",
                      form.image === src ? "ring-2 ring-amber" : "opacity-80 hover:opacity-100"
                    )}
                  >
                    <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                    {form.image === src ? (
                      <span className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-amber text-white">
                        <Check className="size-3" />
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void onUpload(e.target.files?.[0])
                  e.target.value = ""
                }}
              />
              <ErrorText id="item-image-error">{errors.image}</ErrorText>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="item-badge" hint="ជ្រុងឆ្វេងខាងលើរបស់រូបភាព">
                    សីតុណ្ហភាព
                  </FieldLabel>
                  <Select value={form.badge} onValueChange={(v) => v && set("badge", v as string)}>
                    <SelectTrigger id="item-badge" className="h-10! w-full rounded-lg bg-oat-light">
                      <SelectValue placeholder="ជ្រើសរើសសីតុណ្ហភាព" />
                    </SelectTrigger>
                    <SelectContent>
                      {["ក្ដៅ", "ត្រជាក់", "ក្ដៅ/ត្រជាក់"].map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <FieldLabel htmlFor="item-topping" hint="បង្ហាញក្នុងទំព័រទំនិញជាគ្រឿងលម្អជម្រើស">
                គ្រឿងលម្អ និងសារធាតុបន្ថែម
              </FieldLabel>
              <div className="flex flex-col gap-1.5">
                {STANDARD_TOPPINGS.map((t) => {
                  const checked = standardToppings.includes(t.id)
                  return (
                    <Label
                      key={t.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-label-md font-normal",
                        checked ? "bg-amber-soft/40" : "bg-oat-light hover:bg-oat"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(on) =>
                          setStandardToppings((xs) => (on ? [...xs, t.id] : xs.filter((x) => x !== t.id)))
                        }
                        className="data-checked:border-amber data-checked:bg-amber"
                      />
                      <span className="flex-1 text-ink">{t.labelKm ?? t.label}</span>
                      <span className="text-label-sm font-bold text-amber">{t.delta ? `+${formatPrice(t.delta)}` : "រួមបញ្ចូល"}</span>
                    </Label>
                  )
                })}
              </div>
            </section>

            <section className="hidden flex-col gap-3">
              <FieldLabel htmlFor="item-tag" hint={`${form.tags.length}/${MAX_TAGS}`}>
                ស្លាករសជាតិ និងរបបអាហារ
              </FieldLabel>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="item-tag"
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  placeholder="ឧទាហរណ៍៖ អាហារបួស, ពិសេស"
                  className={cn(input, "flex-1")}
                />
                <div className="flex gap-2">
                  <ToggleGroup
                    value={[tagTone]}
                    onValueChange={(v) => v[0] && setTagTone(v[0] as Tone)}
                    spacing={1}
                    className="rounded-lg bg-oat-light p-1"
                  >
                    {(Object.keys(toneLabel) as Tone[]).map((t) => (
                      <ToggleGroupItem
                        key={t}
                        value={t}
                        aria-label={`ស្លាក ${toneLabel[t]}`}
                        className="h-8 px-2 text-label-md aria-pressed:bg-white aria-pressed:shadow-sm"
                      >
                        <span
                          className={cn(
                            "size-3 rounded-full",
                            t === "forest" && "bg-forest",
                            t === "amber" && "bg-amber-bright",
                            t === "neutral" && "bg-oat-deeper ring-1 ring-espresso/20"
                          )}
                        />
                        {toneLabel[t]}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <Button type="button" variant="secondary" size="icon-lg" className="size-10 bg-oat" aria-label="បន្ថែមស្លាក" onClick={addTag}>
                    <Plus />
                  </Button>
                </div>
              </div>
              {form.tags.length ? (
                <ul className="flex flex-wrap gap-1.5">
                  {form.tags.map((t) => (
                    <li
                      key={t.label}
                      className={cn(
                        "flex items-center gap-1 rounded-md py-0.5 pr-1 pl-2 text-label-md font-semibold",
                        t.tone === "forest" && "bg-forest-soft text-forest",
                        t.tone === "amber" && "bg-amber-soft/70 text-amber",
                        t.tone === "neutral" && "bg-oat-deep text-ink-soft"
                      )}
                    >
                      {t.label}
                      <button
                        type="button"
                        aria-label={`លុប ${t.label}`}
                        onClick={() => set("tags", form.tags.filter((x) => x.label !== t.label))}
                        className="rounded p-0.5 hover:bg-black/5"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-label-md text-ink-soft">មិនទាន់មានស្លាកទេ — ស្លាក “ថ្មី” នឹងបង្ហាញរហូតទាល់តែអ្នកបន្ថែមមួយ។</p>
              )}
              <ErrorText id="item-tag-error">{errors.tags}</ErrorText>
            </section>

            <section className="flex flex-col gap-2">
              <Label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 font-normal ring-1 ring-border">
                <span className="flex-1">
                  <span className="block text-title-md text-ink">បង្ហាញនៅលើម៉ឺនុយគេហទំព័រ</span>
                  <span className="block text-body-sm text-ink-soft">បិទ នឹងរក្សាទុកជាដកចេញ (លាក់ពីអតិថិជន)។</span>
                </span>
                <Switch checked={form.live} onCheckedChange={(v) => set("live", v)} className="data-checked:bg-forest" />
              </Label>
              {drink ? (
                <Label className="hidden cursor-pointer items-center gap-3 rounded-xl bg-white p-3 font-normal ring-1 ring-border">
                  <Checkbox
                    checked={form.customizable}
                    onCheckedChange={(v) => set("customizable", v)}
                    className="size-5 data-checked:border-amber data-checked:bg-amber"
                  />
                  <span className="flex-1">
                    <span className="block text-title-md text-ink">ផ្តល់ជម្រើសភេសជ្ជៈ</span>
                    <span className="block text-body-sm text-ink-soft">ទំហំ សីតុណ្ហភាព ទឹកដោះគោ គ្រឿងលម្អ នៅលើទំព័រទំនិញ។</span>
                  </span>
                </Label>
              ) : null}
            </section>
          </div>

          <div className="flex gap-2 border-t bg-white px-5 py-4 sm:px-6">
            <Button type="button" variant="secondary" className="h-11 rounded-lg px-5" onClick={() => onOpenChange(false)}>
              បោះបង់
            </Button>
            <Button type="submit" className="h-11 flex-1 gap-2 rounded-lg text-title-md hover:bg-amber">
              <CirclePlus className="size-4" /> បន្ថែមទៅម៉ឺនុយ
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
