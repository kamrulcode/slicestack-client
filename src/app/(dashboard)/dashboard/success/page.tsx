import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Home,
  Menu,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentVerifier } from "@/components/vendor/payment-verifier";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Payment Successful | SliceStack",
  description: "Your payment has been successfully completed.",
};

/**
 * Subscription payment success page.
 *
 * Stripe redirects here with `session_id` after Checkout. The page reads the
 * session from Stripe for display, then `PaymentVerifier` calls the backend so
 * the MongoDB transaction is updated to `succeeded`. The webhook is the other
 * activation path; the success URL itself is never trusted as proof of payment.
 */
export default async function Success({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { session_id } = await searchParams;

  if (typeof session_id !== "string")
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const {
    status,
    payment_status,
    customer_details,
    payment_intent,
    currency,
    amount_total,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "expired") {
    return redirect(
      `/dashboard/vendor/subscription?payment=cancelled&session_id=${encodeURIComponent(session_id)}`,
    );
  }

  // Stripe reports a paid Checkout Session as status "complete" with
  // payment_status "paid" (or "no_payment_required"), not status "success".
  const isSuccess = ["paid", "no_payment_required"].includes(payment_status);
  const isProcessing =
    !isSuccess && ["unpaid", "processing"].includes(payment_status);
  const email = customer_details?.email;
  const transactionId =
    typeof payment_intent === "string" ? payment_intent : payment_intent?.id;
  const formattedAmount =
    typeof amount_total === "number"
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: (currency || "usd").toUpperCase(),
        }).format(amount_total / 100)
      : null;

  if (status === "complete") {
    return (
      <section id="success">
        {/* Persist the payment in MongoDB through the backend. Stripe already
            confirmed `payment_status`, but the success URL alone is never
            treated as proof of payment. */}
        <PaymentVerifier
          sessionId={session_id}
          returnState="success"
          redirectTo={null}
        />
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
          {/* Background Decorations */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div
              className={cn(
                "absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full blur-[110px]",
                isSuccess ? "bg-emerald-500/10" : "bg-primary/10",
              )}
            />

            <div className="absolute -bottom-40 -right-20 size-96 rounded-full bg-primary/5 blur-[110px]" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 mx-auto w-full max-w-lg">
            {/* Brand */}
            <Link
              href="/"
              className="mb-8 flex items-center justify-center gap-2"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Menu className="size-5" />
              </span>

              <span className="text-xl font-extrabold tracking-tight text-foreground">
                SliceStack
              </span>
            </Link>

            <Card className="overflow-hidden rounded-3xl border-border/70 bg-card shadow-2xl shadow-foreground/5">
              {/* Top Accent */}
              <div
                className={cn(
                  "h-1.5 w-full",
                  isSuccess
                    ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-400"
                    : isProcessing
                      ? "bg-gradient-to-r from-amber-400 to-orange-500"
                      : "bg-gradient-to-r from-destructive to-orange-500",
                )}
              />

              <CardContent className="px-6 py-10 text-center sm:px-10">
                {/* Animated Status Icon */}
                <div className="relative mx-auto mb-7 grid size-24 place-items-center">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full opacity-20 blur-xl",
                      isSuccess
                        ? "bg-emerald-500"
                        : isProcessing
                          ? "bg-amber-500"
                          : "bg-destructive",
                    )}
                  />

                  <div
                    className={cn(
                      "relative grid size-20 place-items-center rounded-full border-4",
                      isSuccess
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : isProcessing
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "border-destructive/20 bg-destructive/10 text-destructive",
                    )}
                  >
                    {isSuccess ? (
                      <Check
                        className="size-10 animate-in zoom-in-50 duration-500"
                        strokeWidth={3}
                      />
                    ) : isProcessing ? (
                      <Clock className="size-9 animate-pulse" />
                    ) : (
                      <ReceiptText className="size-9" />
                    )}
                  </div>
                </div>

                {/* Heading */}
                <div className="space-y-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                      isSuccess
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : isProcessing
                          ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          : "bg-destructive/10 text-destructive",
                    )}
                  >
                    <CheckCircle2 className="size-3.5" />
                    {isSuccess
                      ? "PAYMENT VERIFIED"
                      : isProcessing
                        ? "PAYMENT PROCESSING"
                        : "PAYMENT NOT CONFIRMED"}
                  </span>

                  <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    {isSuccess
                      ? "Payment Successful!"
                      : isProcessing
                        ? "Payment Processing"
                        : "Payment Not Confirmed"}
                  </h1>

                  <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {isSuccess
                      ? `Thank you${customer_details?.name ? `, ${customer_details?.email}` : ""}! Your payment has been successfully verified. We're excited to serve you.`
                      : isProcessing
                        ? "Your payment is being processed. Please wait for confirmation before placing another order."
                        : "We couldn't confirm this payment. If you were charged, please contact our support team before trying again."}
                  </p>
                </div>

                {/* Amount */}
                {isSuccess && formattedAmount && (
                  <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Total Amount Paid
                    </p>

                    <p className="mt-2 text-4xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                      {formattedAmount}
                    </p>

                    <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                      <ShieldCheck className="size-4" />
                      Secure payment verified by Stripe
                    </div>
                  </div>
                )}

                {/* Transaction Details */}
                {transactionId && (
                  <div className="mt-7 rounded-2xl border border-border bg-muted/40 p-4 text-left">
                    <div className="mb-4 flex items-center gap-2">
                      <ReceiptText className="size-4 text-primary" />
                      <p className="text-sm font-bold text-foreground">
                        Transaction Details
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      {email && (
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-muted-foreground">Email</span>
                          <span className="max-w-[65%] break-all text-right font-medium text-foreground">
                            {email}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <span className="shrink-0 text-muted-foreground">
                          Transaction ID
                        </span>
                        <span className="max-w-[65%] break-all text-right font-mono text-xs font-medium text-foreground">
                          {transactionId}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">
                          Payment provider
                        </span>
                        <span className="font-semibold text-foreground">
                          Stripe
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Status</span>
                        <span
                          className={cn(
                            "font-bold",
                            isSuccess
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-amber-600 dark:text-amber-400",
                          )}
                        >
                          {isSuccess ? "Paid" : "Processing"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3">
                  {isSuccess ? (
                    <>
                      <Link
                        href="/dashboard/vendor/subscription"
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "h-12 w-full gap-2 rounded-full font-bold shadow-lg shadow-primary/20",
                        )}
                      >
                        View Subscription
                        <ArrowRight className="size-4" />
                      </Link>

                      <Link
                        href="/menu"
                        className={cn(
                          buttonVariants({
                            variant: "outline",
                            size: "lg",
                          }),
                          "h-12 w-full gap-2 rounded-full",
                        )}
                      >
                        <Home className="size-4" />
                        Continue Shopping
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/dashboard/vendor/orders"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "h-12 w-full rounded-full",
                      )}
                    >
                      Check My Orders
                    </Link>
                  )}
                </div>

                {/* Footer */}
                <p className="mt-7 text-xs leading-relaxed text-muted-foreground">
                  Need help with your payment? Contact the SliceStack support
                  team.
                </p>
              </CardContent>
            </Card>

            {/* Security Footer */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-emerald-500" />
              Your payment is securely handled by Stripe.
            </div>
          </div>
        </main>
      </section>
    );
  }
}
