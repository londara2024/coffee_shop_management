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
import { categories, pairings, products, type CategoryId, type Product, type Tone } from "@/lib/data"
import { cn } from "@/lib/utils"

const DRINKS: CategoryId[] = ["coffee", "tea", "smoothies"]
const MAX_TAGS = 3
const PLACEHOLDER = "/images/emblem.jpg"

/** Photos already in /public/images that make sense as menu imagery. */
const library = [...new Set([...products.map((p) => p.image), ...pairings.map((p) => p.image), "/images/latte-hero.jpg"])]

const toneLabel: Record<Tone, string> = { forest: "Green", amber: "Amber", neutral: "Neutral" }

type Form = {
  name: string
  category: CategoryId
  kicker: string
  price: string
  kcal: string
  badge: string
  imageTag: string
  description: string
  image: string | null
  tags: { label: string; tone: Tone }[]
  live: boolean
  customizable: boolean
}
type Errors = Partial<Record<"name" | "price" | "kcal" | "image" | "tags", string>>

const blank = (category: CategoryId): Form => ({
  name: "",
  category,
  kicker: "",
  price: "",
  kcal: "",
  badge: "",
  imageTag: "",
  description: "",
  image: null,
  tags: [],
  live: true,
  customizable: DRINKS.includes(category),
})

/** Downscale an uploaded photo to ≤800px JPEG so it fits comfortably in localStorage. */
function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      const scale = Math.min(1, 800 / Math.max(img.width, img.height))
      const canvas = document.createElement("canvas")
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL("image/jpeg", 0.82))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("unreadable image"))
    }
    img.src = url
  })
}

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
  const fileRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
    // Editing a field clears its error; the rest stay until the next submit.
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }))
  }
  const drink = DRINKS.includes(form.category)

  function addTag() {
    const label = tagDraft.trim()
    if (!label) return
    if (form.tags.length >= MAX_TAGS) return setErrors((e) => ({ ...e, tags: `Up to ${MAX_TAGS} tags per item.` }))
    if (form.tags.some((t) => t.label.toLowerCase() === label.toLowerCase()))
      return setErrors((e) => ({ ...e, tags: "That tag is already added." }))
    set("tags", [...form.tags, { label, tone: tagTone }])
    setTagDraft("")
    setErrors((e) => ({ ...e, tags: undefined }))
  }

  async function onUpload(file: File | undefined) {
    if (!file) return
    if (!file.type.startsWith("image/")) return setErrors((e) => ({ ...e, image: "Choose an image file (JPG, PNG, WebP)." }))
    if (file.size > 8 * 1024 * 1024) return setErrors((e) => ({ ...e, image: "Keep photos under 8 MB." }))
    try {
      set("image", await resizeImage(file))
      setErrors((e) => ({ ...e, image: undefined }))
    } catch {
      setErrors((e) => ({ ...e, image: "That image couldn't be read — try another file." }))
    }
  }

  function validate(): Errors {
    const e: Errors = {}
    const name = form.name.trim()
    if (name.length < 3) e.name = "Give the item a name (at least 3 characters)."
    else if (slugTaken(slugify(name))) e.name = "An item with this name already exists."
    const price = Number(form.price)
    if (!form.price || !Number.isFinite(price) || price <= 0) e.price = "Enter a price above $0."
    else if (price > 999) e.price = "That price looks too high."
    if (form.kcal && (!Number.isInteger(Number(form.kcal)) || Number(form.kcal) < 0)) e.kcal = "Use a whole number."
    if (!form.image) e.image = "Pick a photo from the library or upload one."
    return e
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      toast.error("Check the highlighted fields")
      return
    }
    const category = categories.find((c) => c.id === form.category)!
    const item = catalog.add({
      slug: slugify(form.name.trim()),
      name: form.name.trim(),
      category: form.category,
      kicker: form.kicker.trim() || "New Arrival",
      price: Math.round(Number(form.price) * 100) / 100,
      kcal: form.kcal ? Number(form.kcal) : 0,
      image: form.image!,
      badge: form.badge.trim() || category.label,
      imageTag: form.imageTag.trim() || undefined,
      tags: form.tags.length ? form.tags : [{ label: "New", tone: "amber" }],
      description: form.description.trim() || undefined,
      customizable: drink && form.customizable,
      live: form.live,
    })
    toast.success(`${item.name} added to ${category.label}`, {
      description: item.live ? "Live on the web menu now." : "Saved as hidden (86'd) — switch it live when ready.",
    })
    onCreated(item)
    onOpenChange(false)
  }

  // Preview mirrors exactly what the customer menu card will render.
  const preview: Product = {
    slug: "preview",
    name: form.name.trim() || "New menu item",
    category: form.category,
    kicker: form.kicker.trim() || "New Arrival",
    price: Number(form.price) > 0 ? Number(form.price) : 0,
    kcal: Number(form.kcal) || 0,
    image: form.image ?? PLACEHOLDER,
    badge: form.badge.trim() || categories.find((c) => c.id === form.category)!.label,
    imageTag: form.imageTag.trim() || undefined,
    tags: form.tags.length ? form.tags : [{ label: "New", tone: "amber" }],
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 bg-milk p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
        <form noValidate onSubmit={submit} className="flex h-full flex-col">
          <div className="border-b bg-white px-5 py-4 pr-12 sm:px-6">
            <p className="eyebrow">Store Menu Operations</p>
            <SheetTitle className="mt-0.5 font-serif text-headline-sm text-ink">Add New Menu Item</SheetTitle>
            <SheetDescription className="text-body-sm text-ink-soft">
              Create a product card for the web menu & POS. Fields marked * are required.
            </SheetDescription>
          </div>

          <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-5 sm:px-6">
            <section className="flex flex-col gap-2">
              <p className="eyebrow text-ink-soft">Menu card preview</p>
              <div inert className="pointer-events-none">
                <ProductCard product={preview} />
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="item-name">Item name *</FieldLabel>
                <Input
                  id="item-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Maple Pecan Cold Brew"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby="item-name-error"
                  className={input}
                />
                <ErrorText id="item-name-error">{errors.name}</ErrorText>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FieldLabel>Category *</FieldLabel>
                  <Select
                    value={form.category}
                    items={Object.fromEntries(categories.map((c) => [c.id, c.label]))}
                    onValueChange={(v) => {
                      if (!v) return
                      const category = v as CategoryId
                      setForm((f) => ({ ...f, category, customizable: DRINKS.includes(category) }))
                    }}
                  >
                    <SelectTrigger aria-label="Category" className="h-10 w-full rounded-lg bg-oat-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="item-kicker" hint="Shown above the name">
                    Subtitle
                  </FieldLabel>
                  <Input
                    id="item-kicker"
                    value={form.kicker}
                    onChange={(e) => set("kicker", e.target.value)}
                    placeholder="e.g. Seasonal Brew"
                    className={input}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="item-price">Price ($) *</FieldLabel>
                  <Input
                    id="item-price"
                    inputMode="decimal"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="6.50"
                    aria-invalid={errors.price ? true : undefined}
                    aria-describedby="item-price-error"
                    className={cn(input, "tabular")}
                  />
                  <ErrorText id="item-price-error">{errors.price}</ErrorText>
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="item-kcal">Calories</FieldLabel>
                  <Input
                    id="item-kcal"
                    inputMode="numeric"
                    value={form.kcal}
                    onChange={(e) => set("kcal", e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="180"
                    aria-invalid={errors.kcal ? true : undefined}
                    aria-describedby="item-kcal-error"
                    className={cn(input, "tabular")}
                  />
                  <ErrorText id="item-kcal-error">{errors.kcal}</ErrorText>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <FieldLabel htmlFor="item-description" hint="Shown on the product page">
                  Description
                </FieldLabel>
                <Textarea
                  id="item-description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Tasting notes, origin, how it's prepared…"
                  className="min-h-20 rounded-lg bg-oat-light focus-visible:border-amber-bright"
                />
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <FieldLabel hint={errors.image ? undefined : "From the library, or upload"}>Photo *</FieldLabel>
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
                  {form.image?.startsWith("data:") ? "Uploaded" : "Upload"}
                </button>
                {library.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => {
                      set("image", src)
                      setErrors((e) => ({ ...e, image: undefined }))
                    }}
                    aria-label={`Use photo ${src.split("/").pop()}`}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="item-badge" hint="Top-left of photo">
                    Photo badge
                  </FieldLabel>
                  <Input
                    id="item-badge"
                    value={form.badge}
                    onChange={(e) => set("badge", e.target.value)}
                    placeholder="e.g. Hot / Iced"
                    className={input}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="item-imagetag" hint="Bottom-left of photo">
                    Photo note
                  </FieldLabel>
                  <Input
                    id="item-imagetag"
                    value={form.imageTag}
                    onChange={(e) => set("imageTag", e.target.value)}
                    placeholder="e.g. Single Origin"
                    className={input}
                  />
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <FieldLabel htmlFor="item-tag" hint={`${form.tags.length}/${MAX_TAGS}`}>
                Tasting & dietary tags
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
                  placeholder="e.g. Vegan, Signature"
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
                        aria-label={`${toneLabel[t]} tag`}
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
                  <Button type="button" variant="secondary" size="icon-lg" className="size-10 bg-oat" aria-label="Add tag" onClick={addTag}>
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
                        aria-label={`Remove ${t.label}`}
                        onClick={() => set("tags", form.tags.filter((x) => x.label !== t.label))}
                        className="rounded p-0.5 hover:bg-black/5"
                      >
                        <X className="size-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-label-md text-ink-soft">No tags yet — a “New” tag is shown until you add one.</p>
              )}
              <ErrorText id="item-tag-error">{errors.tags}</ErrorText>
            </section>

            <section className="flex flex-col gap-2">
              <Label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 font-normal ring-1 ring-border">
                <span className="flex-1">
                  <span className="block text-title-md text-ink">Live on web menu</span>
                  <span className="block text-body-sm text-ink-soft">Off saves it as 86&apos;d (hidden from customers).</span>
                </span>
                <Switch checked={form.live} onCheckedChange={(v) => set("live", v)} className="data-checked:bg-forest" />
              </Label>
              {drink ? (
                <Label className="flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 font-normal ring-1 ring-border">
                  <Checkbox
                    checked={form.customizable}
                    onCheckedChange={(v) => set("customizable", v)}
                    className="size-5 data-checked:border-amber data-checked:bg-amber"
                  />
                  <span className="flex-1">
                    <span className="block text-title-md text-ink">Offer drink options</span>
                    <span className="block text-body-sm text-ink-soft">Size, temperature, milk, toppings on the product page.</span>
                  </span>
                </Label>
              ) : null}
            </section>
          </div>

          <div className="flex gap-2 border-t bg-white px-5 py-4 sm:px-6">
            <Button type="button" variant="secondary" className="h-11 rounded-lg px-5" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="h-11 flex-1 gap-2 rounded-lg text-title-md hover:bg-amber">
              <CirclePlus className="size-4" /> Add to Menu
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
