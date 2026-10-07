import type { Metadata, Viewport } from "next"

import { BrandColorStyle } from "@/components/brand/brand-color-style"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Free Shop Coffee",
    template: "%s · Free Shop Coffee",
  },
  description: "Artisanal single-origin lots and slow-roasted specialty micro-batches — order ahead for pickup.",
}

export const viewport: Viewport = {
  themeColor: "#fef8f4",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="km" className="h-full" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Koh+Santepheap:wght@100;300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <BrandColorStyle />
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster theme="light" position="top-center" richColors={false} />
      </body>
    </html>
  )
}
