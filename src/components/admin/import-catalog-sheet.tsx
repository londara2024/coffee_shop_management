"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { catalog, slugify, slugTaken } from "@/lib/catalog"
import { categories, type CategoryId } from "@/lib/data"

const PLACEHOLDER_IMAGE = "/images/emblem.jpg"
const EXAMPLE = "ទឹកក្រូចស្រស់, tea, 4.50\nនំខេកស្ករកៅស៊ូ, desserts, 5.25"

function matchCategory(raw: string): CategoryId | null {
  const needle = raw.trim().toLowerCase()
  const found = categories.find((c) => c.id.toLowerCase() === needle || c.label.toLowerCase() === needle || c.labelKm === raw.trim())
  return found ? found.id : null
}

type ParsedRow = { line: number; name: string; category: CategoryId; price: number }
type ErrorRow = { line: number; reason: string }

function parse(text: string): { rows: ParsedRow[]; errors: ErrorRow[] } {
  const rows: ParsedRow[] = []
  const errors: ErrorRow[] = []
  const seen = new Set<string>()
  text
    .split("\n")
    .map((l) => l.trim())
    .forEach((line, i) => {
      if (!line) return
      const n = i + 1
      const [nameRaw, categoryRaw, priceRaw] = line.split(",")
      const name = nameRaw?.trim() ?? ""
      if (name.length < 2) return errors.push({ line: n, reason: "ឈ្មោះខ្លីពេក" })
      const slug = slugify(name)
      if (seen.has(slug) || slugTaken(slug)) return errors.push({ line: n, reason: "ឈ្មោះស្ទួន ឬមានរួចហើយ" })
      const category = categoryRaw ? matchCategory(categoryRaw) : null
      if (!category) return errors.push({ line: n, reason: "ប្រភេទមិនត្រឹមត្រូវ" })
      const price = Number.parseFloat((priceRaw ?? "").trim())
      if (!Number.isFinite(price) || price <= 0) return errors.push({ line: n, reason: "តម្លៃមិនត្រឹមត្រូវ" })
      seen.add(slug)
      rows.push({ line: n, name, category, price })
    })
  return { rows, errors }
}

export function ImportCatalogSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [text, setText] = useState("")
  const { rows, errors } = parse(text)

  function doImport() {
    if (!rows.length) {
      toast.error("គ្មានជួរដែលត្រឹមត្រូវសម្រាប់នាំចូលទេ។")
      return
    }
    rows.forEach((r) => {
      const category = categories.find((c) => c.id === r.category)!
      catalog.add({
        slug: slugify(r.name),
        name: r.name,
        category: r.category,
        kicker: "ទំនិញនាំចូល",
        price: r.price,
        image: PLACEHOLDER_IMAGE,
        badge: category.labelKm ?? category.label,
        tags: [{ label: "នាំចូល", tone: "neutral" }],
        live: true,
      })
    })
    toast.success(`បាននាំចូលទំនិញ ${rows.length} ធាតុទៅកាតាឡុក`, {
      description: errors.length ? `រំលងជួរមិនត្រឹមត្រូវ ${errors.length}` : undefined,
    })
    setText("")
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 bg-milk p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
        <div className="border-b bg-white px-5 py-4 pr-12 sm:px-6">
          <p className="eyebrow">ប្រតិបត្តិការម៉ឺនុយហាង</p>
          <SheetTitle className="mt-0.5 font-serif text-headline-sm text-ink">នាំចូលកាតាឡុក</SheetTitle>
          <SheetDescription className="text-body-sm text-ink-soft">
            បិទភ្ជាប់ជួរទំនិញ មួយជួរក្នុងមួយបន្ទាត់ ក្នុងទម្រង់៖ ឈ្មោះ, ប្រភេទ, តម្លៃ
          </SheetDescription>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 sm:px-6">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={EXAMPLE}
            className="min-h-48 rounded-lg bg-oat-light font-mono text-label-md focus-visible:border-amber-bright"
          />
          <p className="text-label-sm text-ink-soft">
            ប្រភេទត្រឹមត្រូវ៖ {categories.map((c) => c.labelKm ?? c.label).join(" · ")}
          </p>

          {text.trim() ? (
            <div className="flex flex-col gap-2 rounded-lg bg-oat-light p-3">
              <p className="text-label-lg text-ink">
                រកឃើញត្រឹមត្រូវ <span className="font-bold text-forest">{rows.length}</span>
                {errors.length ? (
                  <>
                    {" "}
                    · មានបញ្ហា <span className="font-bold text-danger">{errors.length}</span>
                  </>
                ) : null}
              </p>
              {errors.length ? (
                <ul className="flex flex-col gap-1 text-label-sm text-danger">
                  {errors.map((e) => (
                    <li key={e.line}>
                      បន្ទាត់ {e.line}៖ {e.reason}
                    </li>
                  ))}
                </ul>
              ) : null}
              {rows.length ? (
                <ul className="flex flex-col gap-1 text-label-sm text-ink-soft">
                  {rows.map((r) => (
                    <li key={r.line}>
                      {r.name} — {categories.find((c) => c.id === r.category)?.labelKm} — ${r.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex gap-2 border-t bg-white px-5 py-4 sm:px-6">
          <Button type="button" variant="secondary" className="h-11 rounded-lg px-5" onClick={() => onOpenChange(false)}>
            បោះបង់
          </Button>
          <Button type="button" className="h-11 flex-1 gap-2 rounded-lg text-title-md hover:bg-amber" onClick={doImport}>
            <Upload className="size-4" /> នាំចូលកាតាឡុក
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
