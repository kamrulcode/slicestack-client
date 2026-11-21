import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, Search, Users } from "lucide-react";
import { UserBlockButton } from "@/components/admin/user-block-button";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { requireRole } from "@/lib/authorization";
import { errorMessage } from "@/lib/api/client";
import { serverApi } from "@/services/server";
import type { PlatformUser } from "@/types/admin";
import { ROLES } from "@/types/auth";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Manage users",
};

export const dynamic = "force-dynamic";

const FILTERS = ["all", ...ROLES] as const;

function formatDate(value: string | null) {
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
  searchParams: Promise<{ role?: string; search?: string }>;
}) {
  const admin = await requireRole(["admin"], "/dashboard/admin/users");

  const params = await searchParams;
  const role: (typeof FILTERS)[number] =
    params.role && FILTERS.includes(params.role as (typeof FILTERS)[number])
      ? (params.role as (typeof FILTERS)[number])
      : "all";
  const search = typeof params.search === "string" ? params.search.trim() : "";

  let users: PlatformUser[] = [];
  let loadError: string | null = null;

  try {
    users = await serverApi.admin.users({ role, search });
  } catch (error) {
    loadError = errorMessage(error);
  }

  return (
    <DashboardPage
      title="Users"
      description="Every SliceStack account and its trusted server-side role."
    >
      <form
        action="/dashboard/admin/users"
        className="flex flex-col gap-2 sm:flex-row"
      >
        {role !== "all" ? (
          <input type="hidden" name="role" value={role} />
        ) : null}
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search by name or email"
            className="pl-9"
            aria-label="Search users"
          />
        </div>
        <Button type="submit">Search</Button>
        {search ? (
          <Link
            href={
              role === "all"
                ? "/dashboard/admin/users"
                : `/dashboard/admin/users?role=${role}`
            }
            className={buttonVariants({ variant: "ghost" })}
          >
            Clear
          </Link>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((value) => {
          const query = new URLSearchParams();
          if (value !== "all") query.set("role", value);
          if (search) query.set("search", search);
          const suffix = query.toString();

          return (
            <Link
              key={value}
              href={`/dashboard/admin/users${suffix ? `?${suffix}` : ""}`}
              className={buttonVariants({
                size: "sm",
                variant: role === value ? "default" : "outline",
                className: "capitalize",
              })}
            >
              {value}
            </Link>
          );
        })}
      </div>

      {loadError ? (
        <EmptyState
          icon={<AlertTriangle aria-hidden />}
          title="We could not load users"
          description={loadError}
        />
      ) : users.length === 0 ? (
        <EmptyState
          icon={<Users aria-hidden />}
          title="No accounts found"
          description={
            search
              ? "No accounts match this search. Try another name or email."
              : "No users match this role filter yet."
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
            <CardDescription>
              Showing {users.length} account{users.length === 1 ? "" : "s"}.
              Roles and access are enforced on the server only.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="py-2 pr-3 font-semibold">Name</th>
                  <th className="py-2 pr-3 font-semibold">Email</th>
                  <th className="py-2 pr-3 font-semibold">Role</th>
                  <th className="py-2 pr-3 font-semibold">Access</th>
                  <th className="py-2 pr-3 font-semibold">Joined</th>
                  <th className="py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
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
                    <td className="py-3 pr-3">
                      <Badge
                        variant="outline"
                        className={
                          user.blocked
                            ? "bg-red-100 text-red-900 dark:bg-red-500/15 dark:text-red-300"
                            : "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300"
                        }
                      >
                        {user.blocked ? "Blocked" : "Active"}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3 text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-3">
                      {user.role === "admin" || user.id === admin.id ? (
                        <span className="text-xs text-muted-foreground">
                          Protected
                        </span>
                      ) : (
                        <UserBlockButton
                          userId={user.id}
                          blocked={user.blocked}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Blocking signs the user out everywhere. Admin accounts cannot be blocked
        from this page.
      </p>
    </DashboardPage>
  );
}
