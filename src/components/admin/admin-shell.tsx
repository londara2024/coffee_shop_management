"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ChartSpline,
  CookingPot,
  Flame,
  Menu,
  Package,
  Search,
  SlidersHorizontal,
  Store,
  Tags,
} from "lucide-react"

import { LogoMark } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useShopSettings } from "@/lib/shop-settings"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/admin", label: "ទិដ្ឋភាពទូទៅ និងវិភាគទិន្នន័យ", icon: ChartSpline },
  { href: "/admin/kds", label: "សំបុត្របញ្ជាទិញផ្ទះបាយផ្ទាល់ (KDS)", icon: CookingPot },
  { href: "/admin/menu", label: "ម៉ឺនុយ និងកាតាឡុក", icon: BookOpen },
  { href: "/admin/inventory", label: "ស្តុក និងសម្ភារៈ", icon: Package },
  { href: null, label: "អតិថិជន", icon: Tags },
  { href: "/admin/settings", label: "ការកំណត់ហាង", icon: SlidersHorizontal },
]

const stores = ["Downtown Flagship", "Timberyard Workshop"]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2.5 px-2 pt-2">
        <LogoMark />
        <span className="leading-none">
          <span className="block font-serif text-headline-sm text-ink">Aura Roasters</span>
          <span className="mt-1 block eyebrow">Café Home</span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href && (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href))
          const cls = cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-md font-normal transition-colors",
            active ? "bg-espresso text-milk shadow-warm" : "text-ink-soft hover:bg-sidebar-accent hover:text-ink"
          )
          if (!href)
            return (
              <Tooltip key={label}>
                <TooltipTrigger render={<span className={cn(cls, "cursor-not-allowed opacity-60")} />}>
                  <Icon className="size-5" /> {label}
                </TooltipTrigger>
                <TooltipContent side="right">មកដល់ឆាប់ៗនេះ</TooltipContent>
              </Tooltip>
            )
          return (
            <Link key={label} href={href} onClick={onNavigate} className={cls}>
              <Icon className={cn("size-5", !active && "text-amber")} /> {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <Button
          nativeButton={false}
          render={<Link href="/" onClick={onNavigate} />}
          className="h-11 w-full gap-2 rounded-xl text-title-md hover:bg-amber"
        >
          <ArrowLeft className="size-4" /> ត្រឡប់ទៅទំព័រដើម
        </Button>
        <div className="flex items-center gap-3 rounded-2xl bg-oat p-3">
          <Flame className="size-5 text-amber" />
          <div className="flex-1">
            <p className="text-label-sm text-ink-soft">ស្ថានភាពម៉ាស៊ីនអាំង</p>
            <p className="text-title-md text-ink">Probat UG22 • កំពុងដំណើរការ</p>
          </div>
          <span className="size-2.5 animate-pulse rounded-full bg-amber-glow" />
        </div>
      </div>
    </div>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [store, setStore] = useState(stores[0])
  const settings = useShopSettings()

  return (
    <div className="min-h-screen bg-milk">
      {/* Fixed (not sticky) so the sidebar stays pinned regardless of ancestor layout. */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 overflow-y-auto bg-sidebar scrollbar-none lg:block">
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-milk/90 px-4 shadow-[0_1px_12px_rgba(36,22,17,0.05)] backdrop-blur-xl md:px-6 lg:h-20">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="lg:hidden" aria-label="បើកម៉ឺនុយ" />}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-sidebar p-0">
              <SheetTitle className="sr-only">ម៉ឺនុយគ្រប់គ្រង</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="hidden">
            <Select value={store} onValueChange={(v) => v && setStore(v as string)}>
              <SelectTrigger className="h-10 w-56 gap-2 rounded-xl border-0 bg-oat px-3 text-label-lg font-semibold max-sm:hidden">
                <Store className="size-4 text-amber" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stores.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="hidden items-center gap-1.5 rounded-full bg-oat px-3 py-1.5 text-label-md font-semibold text-ink-soft md:flex">
            <span className={cn("size-2 rounded-full", settings.isOpen ? "bg-forest" : "bg-danger")} />
            {settings.isOpen ? "កំពុងបើក • ទទួលការកម្ម៉ង់" : "បានបិទ • មិនទទួលការកម្ម៉ង់"}
          </span>

          <div className="relative ml-auto hidden max-w-72 flex-1 md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
            <Input placeholder="ស្វែងរកការកម្ម៉ង់ កាហ្វេគ្រាប់ដុត អតិថិជន…" className="h-10 rounded-xl border-transparent bg-white pl-9 ring-1 ring-border" />
          </div>

          <Button variant="ghost" size="icon-lg" className="relative max-md:ml-auto" aria-label="ការជូនដំណឹង">
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-amber-bright ring-2 ring-milk" />
          </Button>

          <div className="flex items-center gap-2.5">
            <Image src="/images/customer-portrait.png" alt="" width={36} height={36} className="size-9 rounded-full object-cover" />
            <div className="hidden leading-tight xl:block">
              <p className="text-title-md text-ink">Elena Vasquez</p>
              <p className="text-label-sm text-ink-soft">អ្នកគ្រប់គ្រងហាងទូទៅ</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  )
}
