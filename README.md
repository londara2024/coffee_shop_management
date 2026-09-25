# Aura Coffee Roasters — Web

Next.js 16 (App Router) + Tailwind CSS v4 + shadcn/ui (base-nova / Base UI) implementation of the
designs in `../stitch_coffee_shop_ordering_ui`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Project structure

```text
web/
├── public/
│   └── images/                    # 46 photos + logo downloaded from the Stitch mockups
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout: fonts (Playfair Display, Plus Jakarta Sans), Toaster, TooltipProvider
│   │   ├── globals.css            # Design tokens: colors, type scale, shadows, shadcn theme variables
│   │   ├── (shop)/                # Customer storefront (route group, doesn't appear in the URL)
│   │   │   ├── layout.tsx         # Header + footer + mobile tab bar
│   │   │   ├── page.tsx           # /                  Menu
│   │   │   ├── product/[slug]/    # /product/:slug     Product detail & drink configurator
│   │   │   ├── checkout/          # /checkout          Order review & payment
│   │   │   └── order/[id]/        # /order/:id         Live order status
│   │   ├── (auth)/                # Sign-in / sign-up (logo-only header, no footer)
│   │   │   ├── layout.tsx
│   │   │   ├── sign-in/           # /sign-in           Customer sign in
│   │   │   └── sign-up/           # /sign-up           Create account
│   │   └── admin/                 # Store operations dashboard
│   │       ├── layout.tsx         # Sidebar (drawer on mobile) + top bar
│   │       ├── page.tsx           # /admin             Overview & analytics
│   │       ├── kds/               # /admin/kds         Live kitchen tickets
│   │       ├── menu/              # /admin/menu        Menu & catalog management
│   │       └── inventory/         # /admin/inventory   Stock & supplies
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (generated, base-nova style on Base UI)
│   │   ├── auth/
│   │   │   ├── auth-fields.tsx    # AuthCard, Field, PasswordField, SocialButtons, StrengthMeter
│   │   │   ├── sign-in-form.tsx
│   │   │   └── sign-up-form.tsx
│   │   ├── brand/
│   │   │   └── logo.tsx           # SVG logo mark + wordmark
│   │   ├── shop/
│   │   │   ├── site-header.tsx    # Top nav with cart total
│   │   │   ├── site-footer.tsx
│   │   │   ├── mobile-tab-bar.tsx # Bottom navigation (below lg)
│   │   │   ├── order-bar.tsx      # Floating "Current order" pill
│   │   │   ├── menu-browser.tsx   # Category tabs, filters, search, product sections
│   │   │   ├── product-card.tsx   # Product card + quick add
│   │   │   ├── product-configurator.tsx  # Size / milk / toppings options, live price
│   │   │   ├── add-pairing-button.tsx
│   │   │   ├── checkout-view.tsx  # Checkout page body
│   │   │   ├── order-status-view.tsx     # Live status page body
│   │   │   ├── custom-product-view.tsx   # Product page for admin-created items
│   │   │   ├── qr-code.tsx        # Decorative pass code
│   │   │   └── tag.tsx            # Tag & image pill primitives
│   │   └── admin/
│   │       ├── admin-shell.tsx    # Sidebar + top bar
│   │       ├── blocks.tsx         # PageHeader, Panel, StatCard, Meter
│   │       ├── volume-chart.tsx   # Hourly order volume SVG chart
│   │       ├── kds-board.tsx      # Kitchen ticket board
│   │       ├── catalog-manager.tsx       # Catalog table + quick-edit panel
│   │       ├── add-item-sheet.tsx # "Add New Menu Item" form (slide-over, live card preview)
│   │       └── inventory-ledger.tsx      # Stock ledger, PO, deliveries
│   └── lib/
│       ├── data.ts                # Demo menu, categories, pairings, locations, customer
│       ├── cart.ts                # Cart store (useSyncExternalStore + localStorage)
│       ├── order.ts               # Last placed order store
│       ├── catalog.ts             # Admin-created menu items (localStorage), merged into the menu
│       └── utils.ts               # cn() with tailwind-merge aware of the custom type scale
├── components.json                # shadcn/ui config
├── next.config.ts
└── package.json
```

Add more shadcn components with `npx shadcn@latest add <name>` — they land in `src/components/ui/`.
These use Base UI, so compose with the `render` prop (e.g. `<Button render={<Link href="/" />} nativeButton={false}>`)
instead of Radix's `asChild`.

## Routes

| Route | Design source |
| --- | --- |
| `/` | menu_aura_coffee_roasters (+ `_mobile`) |
| `/product/[slug]` | product_detail_honey_cinnamon_oat_latte (+ `_mobile`) |
| `/checkout` | order_review_checkout_aura_coffee_roasters (+ `_mobile`) |
| `/order/[id]` | live_order_status_acr_8942 (+ `_mobile`) |
| `/sign-in` | customer_sign_in_centered_aura_coffee_roasters |
| `/sign-up` | create_account_centered_aura_coffee_roasters |
| `/admin` | admin_dashboard_overview_operations |
| `/admin/kds` | admin_kds_live_kitchen_order_tickets |
| `/admin/menu` | admin_menu_catalog_management |
| `/admin/inventory` | admin_inventory_supply_control |

## One design, every screen size

The desktop and mobile mockups disagreed with each other (pure-black vs espresso buttons, a serif
fallback for all mobile UI text, different card styles). Each page here is a single responsive
layout built from the `artisanal_warmth/DESIGN.md` tokens, defined once in `src/app/globals.css`:

- Colors: Espresso `#241611` primary, Roasted Amber accents, Forest Green tags, Steamed Milk / Oat surfaces.
- Type: Playfair Display for headlines, Plus Jakarta Sans for UI; scale utilities such as `text-headline-md`, `text-label-sm`.
- Mobile keeps the mobile mockups' patterns: bottom tab bar, floating "Current order" bar, sticky "Add to Order" bar.

`src/lib/utils.ts` extends `tailwind-merge` with the custom type scale. Without that, `cn()` treats
`text-label-md` as a text color and drops classes like `text-primary-foreground`.

## State

Everything is demo data (`src/lib/data.ts`) — there is no backend.

- The cart (`src/lib/cart.ts`) and the last placed order (`src/lib/order.ts`) are small `useSyncExternalStore` stores kept in `localStorage`.
- Items created with **Admin › Menu & Catalog › Add New Menu Item** live in `src/lib/catalog.ts` (also `localStorage`). Live ones appear on the customer menu and get a product page at `/product/<slug>`; that page is rendered in the browser because the server can’t see them.
- The rest of the admin state (KDS bumping, built-in item price/visibility edits, PO approval) lives in React only and resets on reload.

Images from the mockups were downloaded to `public/images`.
