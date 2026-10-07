import Link from "next/link"
import { AtSign, BadgeCheck, Globe, Podcast } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { locations } from "@/lib/data"

const guildLinks = ["Ethical Harvest Charter", "Seasonal Origin Club", "Brew Guides & Ratios", "Cupping Lab Bookings"]

export function SiteFooter() {
  return (
    <footer className="mt-16 hidden bg-oat-light lg:block">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div className="space-y-3">
          <p className="font-serif text-headline-sm text-ink">Free Shop Coffee</p>
          <p className="text-body-md text-ink-soft">
            Artisanal single-origin lots and slow-roasted specialty micro-batches. Respecting the botanical soul of
            every harvest.
          </p>
          <p className="flex items-center gap-1.5 text-label-sm font-bold tracking-wider text-forest uppercase">
            <BadgeCheck className="size-4" /> 100% Traceable Direct Trade
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-title-md text-ink">Neighborhood Roasteries</p>
          {locations.map((l) => (
            <div key={l.name} className="text-body-sm">
              <p className="font-semibold text-ink">{l.name}</p>
              <p className="text-ink-soft">{l.address}</p>
              <p className="font-semibold text-amber">{l.hours}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-title-md text-ink">Guild & Roastery</p>
          <ul className="space-y-1.5 text-body-sm text-ink-soft">
            {guildLinks.map((l) => (
              <li key={l}>
                <Link href="/" className="transition-colors hover:text-amber">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 pt-1 text-ink-soft">
            <Globe className="size-4" />
            <AtSign className="size-4" />
            <Podcast className="size-4" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-title-md text-ink">The Tasting Ledger</p>
          <p className="text-body-sm text-ink-soft">
            Receive reserve microlot allocations, roast announcements, and sensory cupping notes.
          </p>
          <form className="flex gap-2 rounded-lg bg-white p-1 ring-1 ring-border">
            <Input
              type="email"
              placeholder="Your email address"
              aria-label="Email address"
              className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button type="button" size="sm" className="rounded-md px-3 hover:bg-amber">
              Join
            </Button>
          </form>
          <p className="text-label-sm font-semibold text-ink-soft">Unsubscribe whenever your cup is full.</p>
        </div>
      </div>
      <Separator className="mx-auto max-w-7xl" />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-body-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p>© 2025 Free Shop Coffee Inc. All botanical rights preserved.</p>
        <div className="flex gap-5 text-label-md">
          <Link href="/">Terms of Sourcing</Link>
          <Link href="/">Privacy Policy</Link>
          <Link href="/">Subscription FAQ</Link>
        </div>
      </div>
    </footer>
  )
}
