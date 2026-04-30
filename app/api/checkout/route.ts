import { NextResponse } from "next/server";
import { payments } from "@/lib/payments";
import { activePrice } from "@/lib/content/kit";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const name = (body.name ?? "").trim();

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (name.length < 2) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }

  const tier = activePrice();

  const session = await payments.createCheckout({
    email,
    name,
    tier: tier.name.toLowerCase(),
    amount: tier.price,
    currency: "USD",
    successUrl: "/checkout/success",
    cancelUrl: "/checkout",
  });

  return NextResponse.json({
    redirectUrl: session.redirectUrl,
    orderId: session.order.id,
  });
}
