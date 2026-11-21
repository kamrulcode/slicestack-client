import type { Metadata } from "next";
import { AccountProfileCard } from "@/components/dashboard/account-profile-card";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { requireRole } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "My profile",
};

export default async function AdminProfilePage() {
  const user = await requireRole(["admin"], "/dashboard/admin/profile");

  return (
    <DashboardPage
      title="My profile"
      description="Your SliceStack administrator account details."
    >
      <div className="max-w-2xl">
        <AccountProfileCard user={user} />
      </div>
    </DashboardPage>
  );
}
