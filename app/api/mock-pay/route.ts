import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { setSession } from "@/lib/auth/session";

export const runtime = "nodejs";

/**
 * Mock payment finalize. Real provider flow would:
 *   - validate webhook signature from provider
 *   - look up the order by provider session id
 *   - mark it paid
 *   - grant kit to the user, send receipt + magic-link
 *
 * The mock skips signature validation but does the rest.
 */
export async function POST(req: Request) {
  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const orderId = body.orderId ?? "";
  const order = await db.orders.get(orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.status === "paid") {
    return NextResponse.json({ ok: true, alreadyPaid: true });
  }

  await db.orders.update(order.id, { status: "paid" });
  const user = await db.users.upsert(order.email, order.name);
  await db.users.grantKit(order.email);

  // Establish a session for immediate library access.
  await setSession(user.id, user.email);

  // Send a receipt + library link (logs to console in dev).
  await sendEmail({
    to: order.email,
    subject: "Your Made Plain kit is ready",
    text: [
      `Hi ${order.name},`,
      "",
      "Your kit is ready. Download links and your library access:",
      "",
      `  ${origin(req)}/library`,
      "",
      "If you didn't make this purchase, reply and we'll refund.",
      "",
      "— The editor",
    ].join("\n"),
  });

  return NextResponse.json({ ok: true });
}

function origin(req: Request): string {
  try {
    return new URL(req.url).origin;
  } catch {
    return "";
  }
}
