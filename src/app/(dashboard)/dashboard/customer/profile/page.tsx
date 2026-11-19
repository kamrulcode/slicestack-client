import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { VendorApplicationStatusCard } from "@/components/vendor/vendor-application-status";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { getVendorApplicationForUser } from "@/lib/vendor-applications";

export const metadata: Metadata = {
  title: "My profile",
};

export default async function CustomerProfilePage() {
  const user = await requireRole(["customer"], "/dashboard/customer/profile");
  const application = await getVendorApplicationForUser(user.id);

  return (
    <DashboardPage
      title="My profile"
      description="Your SliceStack account details."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Account
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
            </CardTitle>
            <CardDescription>
              Name and email come from your Better Auth account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            <ProfileRow label="Full name" value={user.name} />
            <ProfileRow label="Email address" value={user.email} />
            <ProfileRow label="Account id" value={user.id} mono />
            <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
              Profile editing is not enabled yet. Your role is managed on the
              server and can never be changed from the browser.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <VendorApplicationStatusCard application={application} />
          <EmptyState
            icon={<MapPin aria-hidden />}
            title="Delivery addresses"
            description="Saved addresses will live here. For now, add an address during checkout."
            action={
              <Link
                href="/menu"
                className={buttonVariants({ size: "sm", variant: "outline" })}
              >
                Browse menu
              </Link>
            }
          />
        </div>
      </div>
    </DashboardPage>
  );
}

function ProfileRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
}
