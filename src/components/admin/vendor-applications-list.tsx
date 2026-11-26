"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Store } from "lucide-react";
import { VendorApplicationCard } from "@/components/admin/vendor-application-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { buttonVariants } from "@/components/ui/button";
import type { PlatformUser } from "@/types/admin";
import {
  VENDOR_APPLICATION_STATUSES,
  VENDOR_STATUS_LABEL,
  type VendorApplication,
  type VendorApplicationStatus,
} from "@/types/vendor";

function statusFromLocation(): VendorApplicationStatus | null {
  const status = new URLSearchParams(window.location.search).get("status");
  return VENDOR_APPLICATION_STATUSES.find(
    (value) => value.toLowerCase() === status?.toLowerCase(),
  ) ?? null;
}

export function VendorApplicationsList({
  applications,
  users,
  initialStatus,
}: {
  applications: VendorApplication[];
  users: PlatformUser[];
  initialStatus: VendorApplicationStatus | null;
}) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const handlePopState = () => setStatus(statusFromLocation());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function selectStatus(nextStatus: VendorApplicationStatus | null) {
    if (nextStatus === status) return;
    setStatus(nextStatus);
    const url = new URL(window.location.href);
    if (nextStatus) {
      url.searchParams.set("status", nextStatus);
    } else {
      url.searchParams.delete("status");
    }
    window.history.pushState(null, "", url);
  }

  const applicants = new Map(users.map((user) => [user.id, user]));
  const visibleApplications = status
    ? applications.filter((application) => application.status === status)
    : applications;
  const countFor = (value: VendorApplicationStatus) =>
    applications.filter((application) => application.status === value).length;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={status === null}
          className={buttonVariants({
            size: "sm",
            variant: status === null ? "default" : "outline",
          })}
          onClick={() => selectStatus(null)}
        >
          All ({applications.length})
        </button>

        {VENDOR_APPLICATION_STATUSES.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={status === value}
            className={buttonVariants({
              size: "sm",
              variant: status === value ? "default" : "outline",
            })}
            onClick={() => selectStatus(value)}
          >
            {VENDOR_STATUS_LABEL[value]} ({countFor(value)})
          </button>
        ))}
      </div>

      {visibleApplications.length === 0 ? (
        <EmptyState
          icon={status ? <ClipboardList aria-hidden /> : <Store aria-hidden />}
          title={
            status
              ? `No ${VENDOR_STATUS_LABEL[status].toLowerCase()} applications`
              : "No vendor applications yet"
          }
          description={
            status
              ? "Try another status filter to see more vendors."
              : "Vendors appear here as soon as they activate their shop at signup."
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {visibleApplications.map((application) => (
            <VendorApplicationCard
              key={application.id}
              application={application}
              applicant={applicants.get(application.userId)}
            />
          ))}
        </div>
      )}
    </>
  );
}
