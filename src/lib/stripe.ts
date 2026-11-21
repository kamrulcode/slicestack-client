/**
 * Client-side Stripe utilities.
 *
 * The Stripe secret key lives ONLY on the Express server. The client project
 * never imports the `stripe` Node SDK — all payment operations go through the
 * server API (`/api/vendor/subscription/checkout`, `/api/vendor/subscription/verify`).
 *
 * The publishable key is available via NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY for
 * any future client-side Stripe.js / Elements integration.
 */
export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
