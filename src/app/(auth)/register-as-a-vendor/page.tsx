import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { buttonVariants } from "@/components/ui/button";
import { VendorOnboardingForm } from "@/components/vendor/vendor-onboarding-form";
import { getAccountContext, getCurrentUser } from "@/lib/authorization";
import { dashboardPathForRole } from "@/types/auth";

export const metadata: Metadata = {
  title: "Open your shop",
  description:
    "Add your restaurant details and activate your SliceStack vendor account instantly.",
};

export default async function RegisterVendorPage() {
  const user = await getCurrentUser();

  // New accounts should use the vendor tab on the signup page.
  if (!user) redirect("/sign-up?mode=vendor");

  // Vendors and admins already have a workspace.
  if (user.role !== "customer") {
    redirect(dashboardPathForRole(user.role));
  }

  const context = await getAccountContext();
  const application = context?.application ?? null;
  const shop = context?.shop ?? null;

  const suspended =
    application?.status === "SUSPENDED" || shop?.status === "suspended";

  return (
    <AuthShell
      image={{
        src: "/images/auth-restaurant.jpg",
        alt: "The SliceStack dining room at golden hour",
      }}
    >
      {suspended ? (
        <div>
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" aria-hidden />
          </div>
          <h2 className="mt-5 font-heading text-[2.25rem] leading-tight font-bold tracking-tight text-foreground">
            Vendor access suspended
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Your shop is temporarily suspended, so vendor setup is locked.
            Contact the SliceStack team if you believe this is a mistake.
          </p>
          <Link
            href="/dashboard/customer"
            className={buttonVariants({ variant: "outline", className: "mt-6" })}
          >
            Back to dashboard
          </Link>
        </div>
      ) : (
        <VendorOnboardingForm
          defaults={{
            shopName: application?.shopName ?? shop?.name ?? "",
            phone: application?.phone ?? shop?.phone ?? "",
            address: application?.address ?? shop?.address ?? "",
            description: application?.description ?? shop?.description ?? "",
            logoUrl: application?.logoUrl ?? shop?.logoUrl ?? "",
          }}
        />
      )}
    </AuthShell>
  );
}
