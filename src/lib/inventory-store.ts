"use client"

import { useSyncExternalStore } from "react"

export type CustomMaterial = { name: string; supplier: string; createdAt: number }

const STORAGE_KEY = "aura-inventory-materials-v1"
const EMPTY: CustomMaterial[] = []

let items: CustomMaterial[] | null = null
const listeners = new Set<() => void>()

function read(): CustomMaterial[] {
  if (items) return items
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    items = raw ? (JSON.parse(raw) as CustomMaterial[]) : EMPTY
  } catch {
    items = EMPTY
  }
  return items
}

function write(next: CustomMaterial[]) {
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

export const customMaterials = {
  add(name: string, supplier = "") {
    const trimmed = name.trim()
    if (!trimmed) return
    const existing = read()
    if (existing.some((m) => m.name === trimmed)) return
    write([...existing, { name: trimmed, supplier: supplier.trim(), createdAt: Date.now() }])
  },
}

export function useCustomMaterials() {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}
