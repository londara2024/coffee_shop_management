"use client"

import { useSyncExternalStore } from "react"

export type StaffRole = "អ្នកគ្រប់គ្រងហាង" | "បុគ្គលិក"

export const staffRoles: StaffRole[] = ["អ្នកគ្រប់គ្រងហាង", "បុគ្គលិក"]

export type StaffMember = { id: string; name: string; role: StaffRole }

export type BrandColor = { id: string; label: string; hex: string }

export const brandColors: BrandColor[] = [
  { id: "amber", label: "អំបរ (លំនាំដើម)", hex: "#8d4f06" },
  { id: "forest", label: "បៃតង", hex: "#3a5a40" },
  { id: "burgundy", label: "ក្រហមទទឹម", hex: "#7a2e2e" },
  { id: "navy", label: "ខៀវចាស់", hex: "#1f3a5f" },
  { id: "terracotta", label: "ឥដ្ឋដី", hex: "#b5542d" },
  { id: "plum", label: "ស្វាយខ្ចី", hex: "#5b3a62" },
]

type Settings = {
  shopName: string
  address: string
  lat: number
  lng: number
  isOpen: boolean
  logoUrl: string | null
  brandColor: string
  staff: StaffMember[]
}

const STORAGE_KEY = "aura-shop-settings-v1"

const defaultSettings: Settings = {
  shopName: "Free Shop Coffee",
  address: "742 Pine Hill Court, Suite 100",
  lat: 13.640854603672658,
  lng: 103.1190348130734,
  isOpen: true,
  logoUrl: null,
  brandColor: brandColors[0].hex,
  staff: [
    { id: "elena-vasquez", name: "Elena Vasquez", role: "អ្នកគ្រប់គ្រងហាង" },
    { id: "mateo-silva", name: "Mateo Silva", role: "បុគ្គលិក" },
  ],
}

let settings: Settings | null = null
const listeners = new Set<() => void>()

function read(): Settings {
  if (settings) return settings
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    settings = raw ? { ...defaultSettings, ...(JSON.parse(raw) as Settings) } : defaultSettings
  } catch {
    settings = defaultSettings
  }
  return settings
}

function write(next: Settings) {
  settings = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Quota exceeded or storage blocked — keep the change for this session only.
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const shopSettings = {
  setShopName(shopName: string) {
    write({ ...read(), shopName })
  },
  setAddress(address: string) {
    write({ ...read(), address })
  },
  setOpen(isOpen: boolean) {
    write({ ...read(), isOpen })
  },
  setLogo(logoUrl: string | null) {
    write({ ...read(), logoUrl })
  },
  setBrandColor(brandColor: string) {
    write({ ...read(), brandColor })
  },
  addStaff(name: string, role: StaffRole) {
    const member: StaffMember = { id: `${Date.now()}`, name, role }
    write({ ...read(), staff: [...read().staff, member] })
  },
  setStaffRole(id: string, role: StaffRole) {
    write({ ...read(), staff: read().staff.map((s) => (s.id === id ? { ...s, role } : s)) })
  },
  removeStaff(id: string) {
    write({ ...read(), staff: read().staff.filter((s) => s.id !== id) })
  },
}

export function useShopSettings() {
  return useSyncExternalStore(subscribe, read, () => defaultSettings)
}
