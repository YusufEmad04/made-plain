import { db } from "@/lib/db";
import type { CheckoutInput, CheckoutSession, PaymentProvider } from "./types";

/**
 * Mock payment provider. Creates a pending order and points the
 * user at our own /checkout/pay page, which simulates a card form
 * and finalizes the order via /api/mock-pay.
 *
 * Mirrors the shape of a Stripe / Polar checkout session creation
 * call so swapping is mechanical later.
 */
export const MockPaymentProvider: PaymentProvider = {
  id: "mock",

  async createCheckout(input: CheckoutInput): Promise<CheckoutSession> {
    const order = await db.orders.create({
      email: input.email.toLowerCase().trim(),
      name: input.name.trim(),
      amount: input.amount,
      currency: input.currency,
      tier: input.tier,
    });

    return {
      providerSessionId: `mock_${order.id}`,
      redirectUrl: `/checkout/pay?order=${order.id}`,
      order,
    };
  },
};
