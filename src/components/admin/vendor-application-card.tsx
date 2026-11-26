"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
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
import { errorMessage } from "@/lib/api/client";
import { adminService } from "@/services/admin.service";
import type { PlatformUser } from "@/types/admin";
import type { VendorApplication } from "@/types/vendor";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function VendorApplicationCard({
  application,
  applicant,
}: {
  application: VendorApplication;
  applicant?: PlatformUser;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const canApprove =
    application.status === "PENDING" ||
    application.status === "REJECTED" ||
    application.status === "SUSPENDED";
  const canReject = application.status === "PENDING";
  const canSuspend = application.status === "APPROVED";

  async function review(action: "approve" | "reject" | "suspend") {
    setIsPending(true);

    try {
      const result = await adminService.reviewVendorApplication(
        application.id,
        action,
        action === "reject" ? reason.trim() : undefined,
      );
      toast.success(result.message);
      setShowReject(false);
      setReason("");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsPending(false);
    }
  }

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
          <div className="w-full">
            <label
              htmlFor={`reason-${application.id}`}
              className="text-sm font-semibold"
            >
              Rejection reason (optional)
            </label>
            <Textarea
              id={`reason-${application.id}`}
              rows={2}
              maxLength={500}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Tell the applicant what to fix before resubmitting."
              className="mt-2 bg-card"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={() => review("reject")}
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
          </div>
        ) : (
          <div className="flex w-full flex-wrap items-center gap-2">
            {canApprove ? (
              <Button
                type="button"
                size="sm"
                disabled={isPending}
                onClick={() => review("approve")}
              >
                <Check className="size-3.5" aria-hidden />
                {application.status === "SUSPENDED"
                  ? "Reactivate vendor"
                  : "Approve application"}
              </Button>
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
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={() => review("suspend")}
              >
                <ShieldAlert className="size-3.5" aria-hidden />
                Suspend vendor
              </Button>
            ) : null}

            <span className="text-xs text-muted-foreground">
              {application.status === "APPROVED"
                ? "Vendors activate instantly at signup. Suspending locks their shop tools."
                : "Approval assigns the vendor role and activates the shop."}
            </span>
          </div>
        )}
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
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className={mono ? "truncate font-mono text-xs" : "break-words"}>
          {value}
        </p>
      </div>
    </div>
  );
}
