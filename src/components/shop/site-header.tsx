"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { customer, formatPrice } from "@/lib/data"
import { useCart } from "@/lib/cart"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/", label: "Menu" },
  { href: "/checkout", label: "Checkout" },
  { href: "/order/ACR-8942", label: "Track Order" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const { count, subtotal } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-milk/85 shadow-[0_1px_12px_rgba(36,22,17,0.06)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-2 py-1 text-title-md font-medium transition-colors",
                    active ? "text-amber" : "text-ink-soft hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="mr-2 hidden rounded-md px-2 py-1 text-title-md font-medium text-ink-soft transition-colors hover:text-ink lg:block"
          >
            Dashboard
          </Link>
          <Link
            href="/sign-in"
            className="mr-2 hidden rounded-md px-2 py-1 text-title-md font-medium text-ink-soft transition-colors hover:text-ink lg:block"
          >
            Sign In
          </Link>
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/checkout" aria-label={`Bag, ${count} items`} />}
            className="h-9 gap-2 rounded-full bg-oat-light px-3 hover:bg-oat-deep"
          >
            <span className="relative">
              <ShoppingBag className="size-5 text-ink" />
              {count > 0 ? (
                <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-amber text-[10px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </span>
            <span className="hidden text-label-md font-semibold text-ink tabular sm:inline">
              {formatPrice(subtotal)}
            </span>
          </Button>
          <Link href="/admin" aria-label="Account" className="rounded-full p-0.5 transition-transform hover:scale-105">
            <Image
              src={customer.avatar}
              alt={customer.name}
              width={36}
              height={36}
              className="size-9 rounded-full object-cover ring-2 ring-white"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
