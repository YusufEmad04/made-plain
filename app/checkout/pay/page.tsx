import { notFound } from "next/navigation";

import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { MockPayPanel } from "@/components/marketing/mock-pay-panel";
import { db } from "@/lib/db";

export const metadata = {
  title: "Pay — Made Plain",
  robots: { index: false, follow: false },
};

export default async function PayPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) notFound();
  const order = await db.orders.get(orderId);
  if (!order) notFound();

  return (
    <>
      <SiteNav />
      <main>
        <MockPayPanel
          orderId={order.id}
          amount={order.amount}
          email={order.email}
          name={order.name}
        />
      </main>
      <SiteFooter />
    </>
  );
}
