"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coffee, LayoutDashboard, ReceiptText, ShoppingBag } from "lucide-react"

import { cn } from "@/lib/utils"

const tabs = [
  { href: "/", label: "Menu", icon: Coffee, match: (p: string) => p === "/" || p.startsWith("/product") },
  { href: "/checkout", label: "Bag", icon: ShoppingBag, match: (p: string) => p.startsWith("/checkout") },
  { href: "/order/ACR-8942", label: "Orders", icon: ReceiptText, match: (p: string) => p.startsWith("/order") },
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, match: (p: string) => p.startsWith("/admin") },
]

/** Bottom navigation from the mobile mockups; hidden from lg up where the header nav takes over. */
export function MobileTabBar() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-milk/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname)
          return (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-label-sm font-semibold",
                  active ? "text-amber" : "text-ink-soft"
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
