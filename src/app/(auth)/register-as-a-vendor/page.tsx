import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { VendorApplicationForm } from "@/components/vendor/vendor-application-form";
import { VendorApplicationStatusCard } from "@/components/vendor/vendor-application-status";
import { buttonVariants } from "@/components/ui/button";
import { requireAuth } from "@/lib/authorization";
import { getVendorApplicationForUser } from "@/lib/vendor-applications";
import { dashboardPathForRole } from "@/types/auth";

export const metadata: Metadata = {
  title: "Apply as a vendor",
  description:
    "Apply to open your own pizza shop on SliceStack. Admin approval is required before vendor tools unlock.",
};

export default async function RegisterVendorPage() {
  const user = await requireAuth("/register-as-a-vendor");

  // Vendors and admins already have access; send them to their dashboard.
  if (user.role !== "customer") {
    redirect(dashboardPathForRole(user.role));
  }

  const application = await getVendorApplicationForUser(user.id);
  const canApply = !application || application.status === "REJECTED";

  return (
    <AuthShell
      image={{
        src: "/images/auth-restaurant.jpg",
        alt: "The SliceStack dining room at golden hour",
      }}
    >
      {canApply ? (
        <VendorApplicationForm
          defaultOwnerName={user.name}
          application={application}
        />
      ) : (
        <div>
          <h2 className="font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground sm:text-[2.75rem]">
            Application status
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Here is the latest update on your vendor application.
          </p>
          <div className="mt-7">
            <VendorApplicationStatusCard application={application} />
          </div>
          <Link
            href="/dashboard/customer"
            className={buttonVariants({ variant: "outline", className: "mt-6" })}
          >
            Back to dashboard
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
