"use client"

import { useMemo, useSyncExternalStore } from "react"

import { products, type Product } from "@/lib/data"

/** A menu item created from the admin "Add New Menu Item" form. */
export type CustomProduct = Product & { custom: true; live: boolean; createdAt: number }

const STORAGE_KEY = "aura-catalog-v1"
const EMPTY: CustomProduct[] = []

let items: CustomProduct[] | null = null
const listeners = new Set<() => void>()

function read(): CustomProduct[] {
  if (items) return items
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    items = raw ? (JSON.parse(raw) as CustomProduct[]) : EMPTY
  } catch {
    items = EMPTY
  }
  return items
}

function write(next: CustomProduct[]) {
  items = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Quota exceeded or storage blocked — keep the item for this session only.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function slugify(name: string) {
  const ascii = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  // Non-Latin names (e.g. Khmer) strip to nothing — fall back to the raw name so each stays unique.
  return ascii || name.trim()
}

/** True when a name would collide with an existing (built-in or custom) item. */
export function slugTaken(slug: string) {
  return products.some((p) => p.slug === slug) || read().some((p) => p.slug === slug)
}

export const catalog = {
  add(product: Omit<CustomProduct, "custom" | "createdAt">) {
    const item: CustomProduct = { ...product, custom: true, createdAt: Date.now() }
    write([...read(), item])
    return item
  },
  update(slug: string, patch: Partial<Pick<CustomProduct, "price" | "sizePrices" | "toppings" | "live">>) {
    write(read().map((p) => (p.slug === slug ? { ...p, ...patch } : p)))
  },
  remove(slug: string) {
    write(read().filter((p) => p.slug !== slug))
  },
}

export function useCustomProducts() {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

/** Built-in menu plus admin-created items. `liveOnly` hides custom items that are switched off. */
export function useAllProducts({ liveOnly = false } = {}): (Product | CustomProduct)[] {
  const custom = useCustomProducts()
  return useMemo(() => [...products, ...(liveOnly ? custom.filter((p) => p.live) : custom)], [custom, liveOnly])
}

export function isCustom(p: Product): p is CustomProduct {
  return "custom" in p && (p as CustomProduct).custom === true
}
