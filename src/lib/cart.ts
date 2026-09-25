"use client"

import { useSyncExternalStore } from "react"

export type CartLine = {
  id: string
  slug: string
  name: string
  image: string
  unitPrice: number
  qty: number
  details: string
  tag?: string
}

const STORAGE_KEY = "aura-cart-v1"

// The mockups open with these three items in the bag; new visitors start from the same state.
const SEED: CartLine[] = [
  {
    id: "honey-cinnamon-oat-latte|regular-hot-oat-honey",
    slug: "honey-cinnamon-oat-latte",
    name: "Honey Cinnamon Oat Latte",
    image: "/images/latte-cup.jpg",
    unitPrice: 6.25,
    qty: 1,
    details: "Regular 12 oz · Hot · Oat Milk · Extra Honey Drizzle",
    tag: "Signature",
  },
  {
    id: "avocado-jammy-egg-sourdough|default",
    slug: "avocado-jammy-egg-sourdough",
    name: "Avocado & Egg Sourdough Tartine",
    image: "/images/avocado-tartine.jpg",
    unitPrice: 9.5,
    qty: 1,
    details: "Organic sourdough · Chili flakes · Extra fresh herbs",
    tag: "Kitchen",
  },
  {
    id: "basque-burnt-cheesecake|default",
    slug: "basque-burnt-cheesecake",
    name: "Basque Burnt Cheesecake",
    image: "/images/cheesecake-slice.jpg",
    unitPrice: 6.5,
    qty: 1,
    details: "Custard center · Blackberry-elderberry coulis",
    tag: "Pastry",
  },
]

let lines: CartLine[] | null = null
const listeners = new Set<() => void>()

function read(): CartLine[] {
  if (lines) return lines
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    lines = raw ? (JSON.parse(raw) as CartLine[]) : SEED
  } catch {
    lines = SEED
  }
  return lines
}

function write(next: CartLine[]) {
  lines = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage unavailable (private mode) — keep in memory only
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const cart = {
  add(line: Omit<CartLine, "qty">, qty = 1) {
    const current = read()
    const existing = current.find((l) => l.id === line.id)
    write(
      existing
        ? current.map((l) => (l.id === line.id ? { ...l, qty: l.qty + qty } : l))
        : [...current, { ...line, qty }]
    )
  },
  setQty(id: string, qty: number) {
    write(
      qty <= 0
        ? read().filter((l) => l.id !== id)
        : read().map((l) => (l.id === id ? { ...l, qty } : l))
    )
  },
  remove(id: string) {
    write(read().filter((l) => l.id !== id))
  },
  clear() {
    write([])
  },
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, read, () => SEED)
  const count = items.reduce((n, l) => n + l.qty, 0)
  const subtotal = items.reduce((n, l) => n + l.qty * l.unitPrice, 0)
  return { items, count, subtotal }
}
