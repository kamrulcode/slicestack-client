import type { Metadata } from "next";
import Link from "next/link";
import { Receipt } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Transactions",
};

export default async function AdminTransactionsPage() {
  await requireRole(["admin"], "/dashboard/admin/transactions");

  return (
    <DashboardPage
      title="Transactions"
      description="Platform payments, refunds and vendor payouts."
    >
      <EmptyState
        icon={<Receipt aria-hidden />}
        title="No transactions yet"
        description="This page is protected for admins. Transaction reporting will appear once ordering and payments are connected."
        action={
          <Link
            href="/dashboard/admin"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Back to overview
          </Link>
        }
      />
    </DashboardPage>
  );
}
