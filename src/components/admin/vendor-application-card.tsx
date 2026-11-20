"use client";

import { useActionState, useState } from "react";
import {
  CalendarDays,
  Check,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  UserRound,
  X,
} from "lucide-react";
import { reviewVendorApplicationAction } from "@/app/(dashboard)/dashboard/admin/vendors/actions";
import { VendorStatusBadge } from "@/components/vendor/vendor-status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { PlatformUser } from "@/lib/users";
import type { VendorApplication } from "@/types/vendor";

const INITIAL_STATE = { ok: false, message: "" };

function formatDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export function VendorApplicationCard({
  application,
  applicant,
}: {
  application: VendorApplication;
  applicant?: PlatformUser;
}) {
  const [state, formAction, isPending] = useActionState(
    reviewVendorApplicationAction,
    INITIAL_STATE,
  );
  const [showReject, setShowReject] = useState(false);

  const canApprove =
    application.status === "PENDING" ||
    application.status === "REJECTED" ||
    application.status === "SUSPENDED";
  const canReject = application.status === "PENDING";
  const canSuspend = application.status === "APPROVED";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          {application.shopName}
          <VendorStatusBadge status={application.status} />
        </CardTitle>
        <CardDescription>
          Submitted {formatDate(application.createdAt)}
          {application.reviewedAt
            ? ` · reviewed ${formatDate(application.reviewedAt)}`
            : ""}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 text-sm lg:grid-cols-2">
        <div className="flex flex-col gap-2.5">
          <InfoRow
            icon={<UserRound aria-hidden />}
            label="Applicant"
            value={applicant?.name ?? application.ownerName}
          />
          <InfoRow
            icon={<Mail aria-hidden />}
            label="Email"
            value={applicant?.email ?? "Account unavailable"}
          />
          <InfoRow
            icon={<Phone aria-hidden />}
            label="Phone"
            value={application.phone}
          />
          <InfoRow
            icon={<MapPin aria-hidden />}
            label="Address"
            value={application.address}
          />
          <InfoRow
            icon={<CalendarDays aria-hidden />}
            label="Application id"
            value={application.id}
            mono
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Shop description
          </p>
          <p className="text-muted-foreground">{application.description}</p>
          {application.status === "REJECTED" && application.rejectionReason ? (
            <p className="mt-2 rounded-lg bg-red-50 p-3 text-red-800 dark:bg-red-500/10 dark:text-red-300">
              Rejection reason: {application.rejectionReason}
            </p>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        {showReject ? (
          <form action={formAction} className="w-full">
            <input type="hidden" name="applicationId" value={application.id} />
            <input type="hidden" name="action" value="reject" />
            <label
              htmlFor={`reason-${application.id}`}
              className="text-sm font-semibold"
            >
              Rejection reason (optional)
            </label>
            <Textarea
              id={`reason-${application.id}`}
              name="reason"
              rows={2}
              maxLength={500}
              placeholder="Tell the applicant what to fix before resubmitting."
              className="mt-2 bg-card"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={isPending}
              >
                <X className="size-3.5" aria-hidden />
                {isPending ? "Rejecting..." : "Confirm rejection"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowReject(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex w-full flex-wrap items-center gap-2">
            {canApprove ? (
              <form action={formAction}>
                <input
                  type="hidden"
                  name="applicationId"
                  value={application.id}
                />
                <input type="hidden" name="action" value="approve" />
                <Button type="submit" size="sm" disabled={isPending}>
                  <Check className="size-3.5" aria-hidden />
                  {application.status === "SUSPENDED"
                    ? "Reactivate vendor"
                    : "Approve application"}
                </Button>
              </form>
            ) : null}

            {canReject ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowReject(true)}
                disabled={isPending}
              >
                <X className="size-3.5" aria-hidden />
                Reject
              </Button>
            ) : null}

            {canSuspend ? (
              <form action={formAction}>
                <input
                  type="hidden"
                  name="applicationId"
                  value={application.id}
                />
                <input type="hidden" name="action" value="suspend" />
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  disabled={isPending}
                >
                  <ShieldAlert className="size-3.5" aria-hidden />
                  Suspend vendor
                </Button>
              </form>
            ) : null}

            <span className="text-xs text-muted-foreground">
              {application.status === "APPROVED"
                ? "Vendors activate instantly at signup. Suspending locks their shop tools."
                : "Approval assigns the vendor role and activates the shop."}
            </span>
          </div>
        )}

        {state.message ? (
          <p
            role="status"
            className={
              state.ok
                ? "text-sm font-medium text-emerald-700 dark:text-emerald-300"
                : "text-sm text-destructive"
            }
          >
            {state.message}
          </p>
        ) : null}
      </CardFooter>
    </Card>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={mono ? "truncate font-mono text-xs" : "break-words"}>
          {value}
        </p>
      </div>
    </div>
  );
}
