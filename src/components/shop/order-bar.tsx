"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { formatPrice } from "@/lib/data"
import { useCart } from "@/lib/cart"

/** Floating "current order" pill — full width above the tab bar on mobile, bottom-right card on desktop. */
export function OrderBar() {
  const { count, subtotal } = useCart()
  if (count === 0) return null

  return (
    <>
      {/* Reserves room at the end of the page so the fixed pill never covers the last item on small screens. */}
      <div aria-hidden className="h-20 lg:hidden" />
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 px-4 lg:inset-x-auto lg:right-6 lg:bottom-6 lg:px-0">
        <Link
          href="/checkout"
          className="pointer-events-auto mx-auto flex max-w-md items-center gap-3 rounded-full bg-espresso py-2 pr-2 pl-2 text-milk shadow-warm-lg transition-transform hover:-translate-y-0.5 lg:w-80"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-amber text-label-lg font-bold">
            {count}
          </span>
          <span className="flex flex-1 flex-col leading-tight">
            <span className="text-label-sm tracking-wider text-milk/70 uppercase">ការបញ្ជាទិញបច្ចុប្បន្ន</span>
            <span className="text-title-md font-bold tabular">{formatPrice(subtotal)}</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-amber px-4 py-2 text-label-lg font-semibold">
            ពិនិត្យការបញ្ជាទិញ <ArrowRight className="size-4" />
          </span>
        </Link>
      </div>
    </>
  )
}
