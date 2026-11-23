import type { Metadata } from "next";
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  Receipt,
  Sparkles,
} from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { UpgradeButton } from "@/components/vendor/upgrade-button";
import { PaymentVerifier } from "@/components/vendor/payment-verifier";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireVendorWorkspace } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { formatDateTime } from "@/lib/order-format";
import { cn } from "@/lib/utils";
import { serverApi } from "@/services/server";
import type { SubscriptionState } from "@/types/order";

export const metadata: Metadata = {
  title: "Subscription",
};

const STATUS_STYLES: Record<string, string> = {
  succeeded:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300",
  pending:
    "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300",
  failed: "bg-red-100 text-red-900 dark:bg-red-500/15 dark:text-red-300",
  refunded: "bg-muted text-muted-foreground",
};

function formatUsd(amount: number, currency: string) {
  const code = (currency || "usd").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(amount);
  } catch {
    return `${code} ${amount.toFixed(2)}`;
  }
}

export default async function VendorSubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireVendorWorkspace();
  const params = await searchParams;
  const payment = typeof params.payment === "string" ? params.payment : null;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : null;

  let subscription: SubscriptionState | null = null;
  let loadError: string | null = null;

  try {
    subscription = await serverApi.subscriptions.get();
  } catch (error) {
    loadError = errorMessage(error);
  }

  const plan = subscription?.plan ?? "free";
  const pendingPayment = subscription?.transactions.find(
    (transaction) => transaction.status === "pending",
  );
  const usage = subscription
    ? subscription.itemLimit === null
      ? `${subscription.activeItems} active items`
      : `${subscription.activeItems} of ${subscription.itemLimit} active items`
    : "";

  return (
    <DashboardPage
      title="Subscription"
      description="Your SliceStack vendor plan and billing."
    >
      {(payment === "success" && sessionId) || payment === "cancelled" ? (
        <PaymentVerifier
          sessionId={sessionId ?? undefined}
          returnState={payment}
        />
      ) : null}
      {payment === "cancelled" && !sessionId ? (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Checkout was cancelled. We are checking the payment status with
          Stripe.
        </div>
      ) : null}
      {pendingPayment ? (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Payment pending. Your Premium plan will activate after Stripe
          confirms payment. A new checkout cannot be started while this payment
          is being resolved.
        </div>
      ) : null}

      {loadError ? (
        <EmptyState
          icon={<AlertTriangle aria-hidden />}
          title="We could not load your subscription"
          description={loadError}
        />
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Free plan
                  {plan === "free" ? (
                    <Badge variant="outline">Current plan</Badge>
                  ) : null}
                </CardTitle>
                <CardDescription>
                  Included with your vendor account.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <ul className="flex flex-col gap-2">
                  {(
                    subscription?.plans.free.features ?? [
                      "Up to 3 active menu items",
                      "Vendor dashboard and order management",
                    ]
                  ).map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-emerald-600"
                        aria-hidden
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan === "free" ? (
                  <p className="text-muted-foreground">Usage: {usage}</p>
                ) : null}
              </CardContent>
            </Card>

            <Card
              className={cn(
                plan === "premium" ? "ring-2 ring-primary/40" : undefined,
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" aria-hidden />
                  Premium plan
                  {plan === "premium" ? <Badge>Current plan</Badge> : null}
                </CardTitle>
                <CardDescription>
                  {subscription
                    ? formatUsd(
                        subscription.plans.premium.price,
                        subscription.plans.premium.currency,
                      )
                    : ""}{" "}
                  / month · unlimited menu items and featured placement.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <ul className="flex flex-col gap-2">
                  {(
                    subscription?.plans.premium.features ?? [
                      "Unlimited active menu items",
                      "Premium vendor badge",
                      "Featured menu placement",
                    ]
                  ).map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-emerald-600"
                        aria-hidden
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan === "premium" ? (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <BadgeCheck
                      className="size-4 text-emerald-600"
                      aria-hidden
                    />
                    Active until{" "}
                    {subscription?.premiumUntil
                      ? formatDateTime(subscription.premiumUntil)
                      : "your next billing date"}
                  </p>
                ) : (
                  <UpgradeButton
                    disabled={subscription
                      ? !subscription.paymentsEnabled || Boolean(pendingPayment)
                      : true}
                    pending={Boolean(pendingPayment)}
                  />
                )}
                {subscription && !subscription.paymentsEnabled ? (
                  <p className="text-xs text-muted-foreground">
                    Payments are not configured on this server yet.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment history</CardTitle>
              <CardDescription>
                Read-only records of your subscription payments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription && subscription.transactions.length > 0 ? (
                <div className="flex flex-col divide-y">
                  {subscription.transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-semibold capitalize">
                          {transaction.plan ?? "Premium"} plan
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(transaction.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">
                          {formatUsd(transaction.amount, transaction.currency)}
                        </span>
                        <Badge
                          variant="outline"
                          className={STATUS_STYLES[transaction.status]}
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Receipt aria-hidden />}
                  title="No payments yet"
                  description="Your subscription payments will appear here after checkout."
                />
              )}
            </CardContent>
          </Card>
        </>
      )}
    </DashboardPage>
  );
}
