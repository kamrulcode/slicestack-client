import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Receipt } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { formatDateTime } from "@/lib/order-format";
import { serverApi } from "@/services/server";
import type { TransactionRecord } from "@/types/order";

export const metadata: Metadata = {
  title: "Transactions",
};

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  succeeded:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300",
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300",
  failed: "bg-red-100 text-red-900 dark:bg-red-500/15 dark:text-red-300",
  refunded: "bg-muted text-muted-foreground",
};

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount} ${currency.toUpperCase()}`;
  }
}

export default async function AdminTransactionsPage() {
  await requireRole(["admin"], "/dashboard/admin/transactions");

  let transactions: TransactionRecord[] = [];
  let loadError: string | null = null;

  try {
    transactions = await serverApi.admin.transactions();
  } catch (error) {
    loadError = errorMessage(error);
  }

  return (
    <DashboardPage
      title="Transactions"
      description="Read-only subscription payment records. Admins cannot modify a payment."
    >
      {loadError ? (
        <EmptyState
          icon={<AlertTriangle aria-hidden />}
          title="We could not load transactions"
          description={loadError}
        />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={<Receipt aria-hidden />}
          title="No transactions yet"
          description="Subscription payments appear here after a vendor completes Stripe Checkout."
          action={
            <Link
              href="/dashboard/admin"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Back to overview
            </Link>
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
            <CardDescription>
              {transactions.length} recorded transaction
              {transactions.length === 1 ? "" : "s"}.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[48rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="py-2 pr-3 font-semibold">Vendor</th>
                  <th className="py-2 pr-3 font-semibold">Plan</th>
                  <th className="py-2 pr-3 font-semibold">Amount</th>
                  <th className="py-2 pr-3 font-semibold">Status</th>
                  <th className="py-2 pr-3 font-semibold">Created</th>
                  <th className="py-2 font-semibold">Session</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-3 pr-3">
                      <p className="font-semibold">
                        {transaction.vendorName || "Vendor"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.vendorEmail || transaction.vendorId}
                      </p>
                    </td>
                    <td className="py-3 pr-3 capitalize">
                      {transaction.plan || "premium"}
                    </td>
                    <td className="py-3 pr-3 font-semibold">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </td>
                    <td className="py-3 pr-3">
                      <Badge
                        variant="outline"
                        className={STATUS_STYLES[transaction.status]}
                      >
                        {transaction.status}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      {formatDateTime(transaction.createdAt)}
                    </td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">
                      {transaction.stripeSessionId
                        ? `${transaction.stripeSessionId.slice(0, 12)}…`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </DashboardPage>
  );
}
