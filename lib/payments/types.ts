/**
 * Payment provider interface. The kit currently ships with a mock
 * provider only. Future work plugs in Polar / Paymob / Stripe behind
 * the same interface without touching the routes.
 */
import type { Order } from "@/lib/db";

export type CheckoutInput = {
  email: string;
  name: string;
  tier: string;
  amount: number;
  currency: "USD";
  /** Where the user lands after success. */
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutSession = {
  /** Provider-specific session id. */
  providerSessionId: string;
  /** URL the user is redirected to to complete payment. */
  redirectUrl: string;
  /** Order created on our side (status=pending). */
  order: Order;
};

export interface PaymentProvider {
  readonly id: string;
  createCheckout(input: CheckoutInput): Promise<CheckoutSession>;
  /**
   * Webhook verification. Not used by the mock — kept here for shape.
   */
  verifyWebhook?(rawBody: string, signature: string): Promise<unknown>;
}
