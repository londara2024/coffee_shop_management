import { Logo } from "@/components/brand/logo"

/** Minimal chrome for sign-in / sign-up: logo header only, no footer or tab bar (matches both mockups). */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-milk/85 shadow-[0_1px_12px_rgba(36,22,17,0.06)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 md:h-20 md:px-6">
          <Logo subtitle="Café Botanica" />
        </div>
      </header>
      <main className="flex flex-1 flex-col px-4 py-8 md:py-14">{children}</main>
    </>
  )
}
