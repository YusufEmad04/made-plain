import { MockPaymentProvider } from "./mock";
import type { PaymentProvider } from "./types";

/**
 * Active payment provider. Swap to a real adapter by changing this
 * single export. Routes import `payments` and never reference a
 * specific provider.
 */
export const payments: PaymentProvider = MockPaymentProvider;

export type { CheckoutInput, CheckoutSession, PaymentProvider } from "./types";
