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
import { formatPrice } from "@/lib/format";
import type { VendorApplication } from "@/types/vendor";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(value);
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
            Apply to open your own pizza shop. Our team reviews every
            application before vendor tools are unlocked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/register-as-a-vendor"
            className={buttonVariants({ size: "sm" })}
          >
            Apply as a vendor
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
          <p className="flex items-start gap-2 text-muted-foreground">
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
            Your vendor application is under review. We will notify you when a
            decision is made.
          </p>
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
                ? `Reason: ${application.rejectionReason}`
                : "Your application was not approved. You can update the details and resubmit it."}
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
              Update and resubmit
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
  revenue = 0,
}: {
  shop: { name: string; address: string; phone: string; status: string };
  revenue?: number;
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
        <Detail label="Revenue" value={formatPrice(revenue)} />
      </CardContent>
    </Card>
  );
}
