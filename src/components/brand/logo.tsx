import Link from "next/link"
import { cn } from "@/lib/utils"

/** Café Botanica emblem (cup + coffee sprig in a rounded frame), redrawn as SVG from aura_coffee_roasters_logo. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={cn("size-9", className)}>
      <path
        d="M20 44H14a10 10 0 0 1-10-10V14A10 10 0 0 1 14 4h20a10 10 0 0 1 10 10v4"
        stroke="#c47c35"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M44 24v10a10 10 0 0 1-10 10h-8" stroke="#c47c35" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 11c-1.4 1.5 1.4 2.6 0 4.2" stroke="#241611" strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M9 19h17l-1.4 8.2A5 5 0 0 1 19.7 31h-4.4a5 5 0 0 1-4.9-3.8Z"
        stroke="#241611"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M10 20.5h15" stroke="#241611" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.6 22.5c-2.8 0-3.4 3.8-.4 4.3l1.6.4" stroke="#241611" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M22 38c6-2 10-7 11-14 .7-4.5 2.5-8 5-10" stroke="#241611" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M33 21c-3-.6-4.6-2.6-4.4-5.2 2.8.3 4.5 2.2 4.4 5.2Z" fill="#e0a466" stroke="#241611" strokeWidth=".9" />
      <path d="M34 17c.2-3 2-4.8 4.8-5 .1 2.8-1.7 4.7-4.8 5Z" fill="#e0a466" stroke="#241611" strokeWidth=".9" />
      <path d="M31.5 27.5c2.4-2 5-2.3 7.2-.8-2 2-4.6 2.3-7.2.8Z" fill="#e0a466" stroke="#241611" strokeWidth=".9" />
      <path d="M26.5 34.5c-.6-3 .6-5.3 3.2-6.4.7 2.8-.5 5.2-3.2 6.4Z" fill="#e0a466" stroke="#241611" strokeWidth=".9" />
      <circle cx="30.4" cy="24.6" r="1.3" fill="#c47c35" stroke="#241611" strokeWidth=".7" />
      <circle cx="28.4" cy="31.2" r="1.3" fill="#c47c35" stroke="#241611" strokeWidth=".7" />
    </svg>
  )
}

export function Logo({
  href = "/",
  subtitle,
  className,
}: {
  href?: string
  subtitle?: string
  className?: string
}) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <LogoMark className="transition-transform group-hover:scale-105" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-headline-sm tracking-tight text-ink">
          Aura <span className="max-sm:hidden">Coffee </span>Roasters
        </span>
        {subtitle ? <span className="mt-1 eyebrow">{subtitle}</span> : null}
      </span>
    </Link>
  )
}
