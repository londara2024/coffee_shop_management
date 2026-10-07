"use client"

import { useState } from "react"
import { CirclePlus, FilePlus2, Minus, Plus, Save, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { customMaterials } from "@/lib/inventory-store"
import { cn } from "@/lib/utils"

export type PoLine = { name: string; vendor: string; price: number }

const input = "h-10 rounded-lg bg-oat-light focus-visible:border-amber-bright focus-visible:ring-amber-bright/20"
const NEW_ITEM = "+ បន្ថែមសម្ភារៈថ្មី"

export function CreatePoSheet({
  open,
  onOpenChange,
  stockItems,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  stockItems: { name: string; supplier: string }[]
  onCreated: (lines: PoLine[]) => void
}) {
  const [itemName, setItemName] = useState(stockItems[0]?.name ?? "")
  const [newName, setNewName] = useState("")
  const [newSupplier, setNewSupplier] = useState("")
  const [qty, setQty] = useState("1")
  const [price, setPrice] = useState("")
  const [quickNames, setQuickNames] = useState<string[]>([""])
  const [lines, setLines] = useState<PoLine[]>([])
  const isNew = itemName === NEW_ITEM

  function commit(name: string, supplier: string) {
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error("សូមបញ្ចូលឈ្មោះសម្ភារៈ។")
      return false
    }
    const p = Number.parseFloat(price)
    if (!Number.isFinite(p) || p <= 0) {
      toast.error("សូមបញ្ចូលតម្លៃលើសពី $0។")
      return false
    }
    const n = Number.parseInt(qty, 10) || 1
    setLines((ls) => [
      ...ls,
      { name: `${trimmed} (${n}× ឯកតា)`, vendor: supplier.trim() ? `អ្នកផ្គត់ផ្គង់៖ ${supplier.trim()}` : "អ្នកផ្គត់ផ្គង់៖ មិនទាន់កំណត់", price: p },
    ])
    setPrice("")
    setQty("1")
    return true
  }

  function addLine() {
    if (isNew) {
      if (commit(newName, newSupplier)) {
        setNewName("")
        setNewSupplier("")
      }
      return
    }
    const item = stockItems.find((s) => s.name === itemName)
    if (!item) return
    commit(item.name, item.supplier)
  }

  function updateQuickName(i: number, value: string) {
    setQuickNames((qs) => qs.map((q, x) => (x === i ? value : q)))
  }

  function addQuickRow(i: number) {
    commit(quickNames[i], "")
    setQuickNames((qs) => [...qs, ""])
  }

  function removeQuickRow(i: number) {
    setQuickNames((qs) => {
      const next = qs.filter((_, x) => x !== i)
      return next.length ? next : [""]
    })
  }

  function saveMaterialsToDatabase() {
    const names = quickNames.map((n) => n.trim()).filter(Boolean)
    if (!names.length) {
      toast.error("សូមវាយបញ្ចូលឈ្មោះសម្ភារៈយ៉ាងហោចណាស់មួយ។")
      return
    }
    names.forEach((n) => customMaterials.add(n))
    toast.success(`បានរក្សាទុកសម្ភារៈ ${names.length} ទៅមូលដ្ឋានទិន្នន័យ`)
    setQuickNames([""])
  }

  function submit() {
    if (!lines.length) {
      toast.error("សូមបន្ថែមសម្ភារៈយ៉ាងហោចណាស់មួយ។")
      return
    }
    onCreated(lines)
    toast.success(`បានបង្កើតលិខិតបញ្ជាទិញថ្មី (${lines.length} ធាតុ)`)
    setLines([])
    setPrice("")
    setQty("1")
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 bg-milk p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md">
        <div className="border-b bg-white px-5 py-4 pr-12 sm:px-6">
          <p className="eyebrow">ខ្សែសង្វាក់ផ្គត់ផ្គង់</p>
          <SheetTitle className="mt-0.5 font-serif text-headline-sm text-ink">បង្កើតលិខិតបញ្ជាទិញ</SheetTitle>
          <SheetDescription className="text-body-sm text-ink-soft">
            ជ្រើសរើសសម្ភារៈពីស្តុក កំណត់ចំនួន និងតម្លៃ រួចបន្ថែមទៅលិខិតបញ្ជាទិញព្រាង។
          </SheetDescription>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="po-item" className="text-label-lg text-ink">
              សម្ភារៈ
            </Label>
            <Select value={itemName} onValueChange={(v) => v && setItemName(v as string)}>
              <SelectTrigger id="po-item" className="h-10 w-full rounded-lg bg-oat-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stockItems.map((s) => (
                  <SelectItem key={s.name} value={s.name}>
                    {s.name}
                  </SelectItem>
                ))}
                <SelectItem value={NEW_ITEM} className="font-bold text-amber">
                  {NEW_ITEM}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isNew ? (
            <div className="grid grid-cols-1 gap-4 rounded-lg bg-oat-light/60 p-3 ring-1 ring-amber-bright/20 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="po-new-name" className="text-label-lg text-ink">
                  ឈ្មោះសម្ភារៈថ្មី
                </Label>
                <Input
                  id="po-new-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ឧ. Guatemala Huehuetenango"
                  className={cn(input, "bg-white")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="po-new-supplier" className="text-label-lg text-ink">
                  អ្នកផ្គត់ផ្គង់
                </Label>
                <Input
                  id="po-new-supplier"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  placeholder="ឧ. Highland Coop Direct"
                  className={cn(input, "bg-white")}
                />
              </div>
            </div>
          ) : null}

          {!isNew ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="po-qty" className="text-label-lg text-ink">
                    ចំនួន
                  </Label>
                  <Input
                    id="po-qty"
                    inputMode="numeric"
                    value={qty}
                    onChange={(e) => setQty(e.target.value.replace(/[^0-9]/g, ""))}
                    className={cn(input, "tabular")}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="po-price" className="text-label-lg text-ink">
                    តម្លៃសរុប ($)
                  </Label>
                  <Input
                    id="po-price"
                    inputMode="decimal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="250.00"
                    className={cn(input, "tabular")}
                  />
                </div>
              </div>

              <Button type="button" variant="secondary" className="h-10 gap-2 rounded-lg bg-oat" onClick={addLine}>
                <Plus className="size-4" /> បន្ថែមទៅលិខិតបញ្ជាទិញ
              </Button>
            </>
          ) : null}

          <div className="flex flex-col gap-2">
            <p className="text-label-lg text-ink">ធាតុដែលបានបន្ថែម ({lines.length})</p>
            {lines.length ? (
              <ul className="flex flex-col gap-1.5">
                {lines.map((l, i) => (
                  <li key={`${l.name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg bg-oat-light px-3 py-2 text-label-md">
                    <span className="min-w-0 flex-1 truncate text-ink">{l.name}</span>
                    <span className="font-bold text-amber tabular">${l.price.toFixed(2)}</span>
                    <button
                      type="button"
                      aria-label={`លុប ${l.name}`}
                      onClick={() => setLines((ls) => ls.filter((_, x) => x !== i))}
                      className="rounded p-0.5 hover:bg-black/5"
                    >
                      <X className="size-3" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-label-md text-ink-soft">មិនទាន់មានធាតុទេ — បន្ថែមសម្ភារៈខាងលើ។</p>
            )}
            <Label className="text-label-lg text-ink">បន្ថែមសម្ភារះ</Label>
            <div className="flex flex-col gap-2">
              {quickNames.map((name, i) => {
                const isLast = i === quickNames.length - 1
                return (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={name}
                      onChange={(e) => updateQuickName(i, e.target.value)}
                      placeholder="ឬវាយបញ្ចូលឈ្មោះសម្ភារៈផ្សេងទៀត…"
                      className={cn(input, "flex-1 bg-white")}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="h-10 gap-1.5 rounded-lg bg-oat px-3"
                      onClick={() => (isLast ? addQuickRow(i) : removeQuickRow(i))}
                    >
                      {isLast ? (
                        <>
                          <Plus className="size-4" /> បន្ថែម
                        </>
                      ) : (
                        <>
                          <Minus className="size-4" /> ដក
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
            <Button type="button" variant="secondary" className="h-10 gap-2 rounded-lg bg-oat" onClick={saveMaterialsToDatabase}>
              <Save className="size-4" /> បន្ថែមសម្ភារះ
            </Button>
          </div>
        </div>

        <div className="flex gap-2 border-t bg-white px-5 py-4 sm:px-6">
          <Button type="button" variant="secondary" className="h-11 rounded-lg px-5" onClick={() => onOpenChange(false)}>
            បោះបង់
          </Button>
          <Button type="button" className="h-11 flex-1 gap-2 rounded-lg text-title-md hover:bg-amber" onClick={submit}>
            <CirclePlus className="size-4" /> បង្កើតលិខិតបញ្ជាទិញ
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export { FilePlus2 }
