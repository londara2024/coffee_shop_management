import { MobileTabBar } from "@/components/shop/mobile-tab-bar"
import { SiteFooter } from "@/components/shop/site-footer"
import { SiteHeader } from "@/components/shop/site-header"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {/* Below lg the footer is hidden; padding keeps the last content clear of the fixed tab bar. */}
      <main className="flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">{children}</main>
      <SiteFooter />
      <MobileTabBar />
    </>
  )
}
