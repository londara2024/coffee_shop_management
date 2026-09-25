"use client"

import { useSyncExternalStore } from "react"

import type { CartLine } from "@/lib/cart"

export type PlacedOrder = {
  id: string
  items: CartLine[]
  subtotal: number
  tax: number
  tip: number
  credit: number
  total: number
  payment: string
  pickup: string
}

const KEY = "aura-last-order-v1"
let cached: PlacedOrder | null | undefined
const listeners = new Set<() => void>()

function read(): PlacedOrder | null {
  if (cached !== undefined) return cached
  try {
    const raw = window.localStorage.getItem(KEY)
    cached = raw ? (JSON.parse(raw) as PlacedOrder) : null
  } catch {
    cached = null
  }
  return cached
}

export function saveOrder(order: PlacedOrder) {
  cached = order
  try {
    window.localStorage.setItem(KEY, JSON.stringify(order))
  } catch {
    // in-memory only
  }
  listeners.forEach((l) => l())
}

export function useLastOrder() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    read,
    () => null
  )
}
