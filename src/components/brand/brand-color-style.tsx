"use client"

import { useShopSettings } from "@/lib/shop-settings"

/**
 * Tailwind bakes `--color-amber` etc. into generated utilities at build time (confirmed:
 * overriding the CSS variable at runtime has no visible effect), so recoloring the brand
 * accent live means overriding the actual compiled utility-class rules with `!important`
 * instead of just reassigning a custom property.
 */
export function BrandColorStyle() {
  const { brandColor } = useShopSettings()

  const css = `
    :root {
      --color-amber: ${brandColor};
      --color-amber-bright: color-mix(in srgb, ${brandColor} 80%, white);
      --color-amber-soft: color-mix(in srgb, ${brandColor} 22%, white);
      --color-amber-glow: color-mix(in srgb, ${brandColor} 68%, white);
    }
    .bg-amber, .hover\\:bg-amber:hover, .data-checked\\:bg-amber[data-checked],
    .aria-pressed\\:bg-amber[aria-pressed="true"] {
      background-color: ${brandColor} !important;
    }
    .text-amber { color: ${brandColor} !important; }
    .border-amber, .data-checked\\:border-amber[data-checked] { border-color: ${brandColor} !important; }
    .bg-amber-bright, .hover\\:bg-amber-bright:hover {
      background-color: color-mix(in srgb, ${brandColor} 80%, white) !important;
    }
    .text-amber-bright { color: color-mix(in srgb, ${brandColor} 80%, white) !important; }
    .bg-amber-soft, .aria-pressed\\:bg-amber-soft\\/70[aria-pressed="true"] {
      background-color: color-mix(in srgb, ${brandColor} 22%, white) !important;
    }
    .bg-amber-glow { background-color: color-mix(in srgb, ${brandColor} 68%, white) !important; }
  `

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
