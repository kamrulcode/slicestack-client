import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
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
import { listUsers } from "@/lib/users";
import { cn } from "@/lib/utils";
import { ROLES } from "@/types/auth";

export const metadata: Metadata = {
  title: "Manage users",
};

const FILTERS = ["all", ...ROLES] as const;

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  await requireRole(["admin"], "/dashboard/admin/users");

  const params = await searchParams;
  const filter =
    params.role && FILTERS.includes(params.role as (typeof FILTERS)[number])
      ? params.role
      : "all";

  const users = await listUsers();
  const filtered =
    filter === "all" ? users : users.filter((user) => user.role === filter);

  return (
    <DashboardPage
      title="Users"
      description="Every SliceStack account and its trusted server-side role."
    >
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((value) => (
          <Link
            key={value}
            href={
              value === "all"
                ? "/dashboard/admin/users"
                : `/dashboard/admin/users?role=${value}`
            }
            className={buttonVariants({
              size: "sm",
              variant: filter === value ? "default" : "outline",
              className: "capitalize",
            })}
          >
            {value}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users aria-hidden />}
          title="No accounts found"
          description="No users match this role filter yet."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>
              Showing {filtered.length} account
              {filtered.length === 1 ? "" : "s"}. Roles are assigned on the
              server only.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="py-2 pr-3 font-semibold">Name</th>
                  <th className="py-2 pr-3 font-semibold">Email</th>
                  <th className="py-2 pr-3 font-semibold">Role</th>
                  <th className="py-2 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-3 pr-3 font-semibold">{user.name}</td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="py-3 pr-3">
                      <Badge
                        variant={user.role === "admin" ? "default" : "outline"}
                        className={cn("capitalize")}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Need another admin? Promotion is intentionally not available from the
        UI. Use the documented server-side promote script.
      </p>
    </DashboardPage>
  );
}

export const dynamic = "force-dynamic";
