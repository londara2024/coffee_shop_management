import type { Metadata } from "next"

import { OrderStatusView } from "@/components/shop/order-status-view"

export async function generateMetadata({ params }: PageProps<"/order/[id]">): Promise<Metadata> {
  const { id } = await params
  return { title: `Live Order Status #${id}` }
}

export default async function OrderStatusPage({ params }: PageProps<"/order/[id]">) {
  const { id } = await params
  return <OrderStatusView id={decodeURIComponent(id).toUpperCase()} />
}
