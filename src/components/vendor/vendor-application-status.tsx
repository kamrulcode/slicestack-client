import Link from "next/link";
import { ArrowRight, Clock, ShieldAlert, Store } from "lucide-react";
import { VendorStatusBadge } from "@/components/vendor/vendor-status-badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { VendorApplication } from "@/types/vendor";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
}

/**
 * Customer-facing summary of the user's vendor application. Rendered on the
 * customer dashboard and on the application page.
 */
export function VendorApplicationStatusCard({
  application,
}: {
  application: VendorApplication | null;
}) {
  if (!application) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="size-4 text-primary" aria-hidden />
            Sell on SliceStack
          </CardTitle>
          <CardDescription>
            Open your own pizza shop in minutes. Vendor accounts are activated
            instantly — there is no approval queue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/register-as-a-vendor"
            className={buttonVariants({ size: "sm" })}
          >
            Open your shop
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          Vendor application
          <VendorStatusBadge status={application.status} />
        </CardTitle>
        <CardDescription>
          {application.shopName} · submitted {formatDate(application.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        {application.status === "PENDING" && (
          <>
            <p className="flex items-start gap-2 text-muted-foreground">
              <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
              Your vendor profile is ready to activate. Confirm your shop
              details to unlock the vendor dashboard immediately.
            </p>
            <Link
              href="/register-as-a-vendor"
              className={buttonVariants({ size: "sm" })}
            >
              Finish vendor setup
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </>
        )}

        {application.status === "APPROVED" && (
          <>
            <p className="text-muted-foreground">
              You are approved to sell on SliceStack. Manage your shop, menu
              and orders from the vendor dashboard.
            </p>
            <Link
              href="/dashboard/vendor"
              className={buttonVariants({ size: "sm" })}
            >
              Go to vendor dashboard
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </>
        )}

        {application.status === "REJECTED" && (
          <>
            <p className="text-muted-foreground">
              {application.rejectionReason
                ? `Previous review note: ${application.rejectionReason}. You can now set up your shop instantly.`
                : "Your previous application was not approved. You can now set up your shop instantly."}
            </p>
            {application.reviewedAt ? (
              <p className="text-xs text-muted-foreground">
                Reviewed {formatDate(application.reviewedAt)}
              </p>
            ) : null}
            <Link
              href="/register-as-a-vendor"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              Open your shop
            </Link>
          </>
        )}

        {application.status === "SUSPENDED" && (
          <p className="flex items-start gap-2 text-muted-foreground">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Your vendor access is temporarily suspended. Contact the SliceStack
            team if you believe this is a mistake.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function VendorApplicationSummary({
  application,
}: {
  application: VendorApplication;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop details</CardTitle>
        <CardDescription>What customers will see.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
        <Detail label="Shop name" value={application.shopName} />
        <Detail label="Owner" value={application.ownerName} />
        <Detail label="Phone" value={application.phone} />
        <Detail label="Address" value={application.address} />
        <div className="sm:col-span-2">
          <Detail label="Description" value={application.description} />
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-foreground">{value}</p>
    </div>
  );
}

export function ShopSummaryCard({
  shop,
  plan,
}: {
  shop: { name: string; address: string; phone: string; status: string };
  plan?: "free" | "premium";
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{shop.name}</CardTitle>
        <CardDescription>{shop.address}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
        <Detail label="Phone" value={shop.phone} />
        <Detail label="Shop status" value={shop.status} />
        <Detail
          label="Plan"
          value={plan === "premium" ? "Premium" : "Free"}
        />
      </CardContent>
    </Card>
  );
}
