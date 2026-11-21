"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Check, Eye, Loader2, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import type { MenuItemStatus, VendorMenuItemRecord } from "@/types/menu";
import { formatPrice } from "@/lib/format";
import { errorMessage } from "@/lib/api/client";
import { adminService } from "@/services/admin.service";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { cn } from "@/lib/utils";

export type ApprovalStatus = "approved" | "pending" | "rejected";

interface MenuItemCardProps {
  item: VendorMenuItemRecord;
}

const approvalStyles: Record<ApprovalStatus, string> = {
  approved:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",

  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",

  rejected:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
};

function getApprovalStatus(status?: string | null): ApprovalStatus {
  switch (status?.toLowerCase()) {
    case "approved":
      return "approved";

    case "rejected":
      return "rejected";

    default:
      return "pending";
  }
}

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("h-6 gap-1.5 px-2 capitalize", approvalStyles[status])}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </Badge>
  );
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const router = useRouter();
  const [viewingItem, setViewingItem] = useState<VendorMenuItemRecord | null>(
    null,
  );

  const status = getApprovalStatus(item.status);
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  async function setStatus(next: MenuItemStatus) {
    setBusy(true);

    try {
      const result = await adminService.setMenuStatus(
        item._id,
        next,
        next === "rejected" ? reason.trim() || undefined : undefined,
      );
      toast.success(result.message);
      setRejecting(false);
      setReason("");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);

    try {
      const result = await adminService.deleteMenuItem(item._id);
      setDeleteDialogOpen(false);
      toast.success(result.message);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <article className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-28">
          {item.images?.[0] ? (
            <Image
              src={item.images[0]}
              alt={item.itemName}
              fill
              sizes="112px"
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate font-semibold">{item.itemName}</h3>

          <p className="text-sm text-muted-foreground">
            {item.category} · {item.shopName || "Unknown shop"}
          </p>

          <p className="text-sm font-semibold">{formatPrice(item.price)}</p>

          <div className="flex flex-wrap gap-2 pt-1">
            <ApprovalBadge status={status} />

            <Badge variant="outline">
              {item.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          {item.status === "rejected" && item.rejectionReason ? (
            <p className="rounded-lg bg-red-50 p-2 text-xs text-red-800 dark:bg-red-500/10 dark:text-red-300">
              Reason: {item.rejectionReason}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setViewingItem(item)}
            >
              <Eye className="size-4" aria-hidden />
              Details
            </Button>

            {status !== "approved" ? (
              <Button
                type="button"
                size="sm"
                className="gap-1.5"
                disabled={busy}
                onClick={() => setStatus("approved")}
              >
                {busy ? (
                  <Loader2 className="size-3.5 animate-spin" aria-hidden />
                ) : (
                  <Check className="size-3.5" aria-hidden />
                )}
                Approve
              </Button>
            ) : null}

            {status !== "rejected" ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={busy}
                onClick={() => setRejecting((current) => !current)}
              >
                <X className="size-3.5" aria-hidden />
                Reject
              </Button>
            ) : null}
          </div>

          {rejecting ? (
            <div className="w-full rounded-lg border border-border/70 p-3 sm:max-w-xs">
              <label
                htmlFor={`reason-${item._id}`}
                className="text-xs font-semibold text-muted-foreground"
              >
                Rejection reason (optional)
              </label>
              <Textarea
                id={`reason-${item._id}`}
                rows={2}
                maxLength={500}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Tell the vendor what to fix."
                className="mt-1.5"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRejecting(false)}
                  disabled={busy}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setStatus("rejected")}
                  disabled={busy}
                >
                  Reject item
                </Button>
              </div>
            </div>
          ) : null}

          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="gap-1.5"
                  disabled={busy}
                >
                  <Trash2 className="size-4" aria-hidden />
                  Delete
                </Button>
              }
            />

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete menu item?</AlertDialogTitle>

                <AlertDialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{item.itemName}</strong>? This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  disabled={busy}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={(event) => {
                    event.preventDefault();
                    void handleDelete();
                  }}
                >
                  {busy ? "Deleting..." : "Yes, Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </article>

      <Sheet
        open={viewingItem !== null}
        onOpenChange={(open) => {
          if (!open) setViewingItem(null);
        }}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto p-0 sm:max-w-lg"
        >
          {viewingItem && (
            <>
              <SheetHeader className="border-b border-border p-5 pr-14 sm:p-6 sm:pr-14">
                <SheetTitle>Menu item details</SheetTitle>

                <SheetDescription>{viewingItem.itemName}</SheetDescription>
              </SheetHeader>

              <div className="space-y-5 p-5 sm:p-6">
                {viewingItem.images?.[0] && (
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={viewingItem.images[0]}
                      alt={viewingItem.itemName}
                      fill
                      sizes="(min-width: 640px) 448px, 100vw"
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}

                <dl className="grid gap-4">
                  <div>
                    <dt className="text-sm text-muted-foreground">Item name</dt>
                    <dd className="mt-1 font-medium">{viewingItem.itemName}</dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">Category</dt>
                    <dd className="mt-1 font-medium">{viewingItem.category}</dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">Price</dt>
                    <dd className="mt-1 font-medium">
                      {formatPrice(viewingItem.price)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Approval status
                    </dt>
                    <dd className="mt-1">
                      <ApprovalBadge
                        status={getApprovalStatus(viewingItem.status)}
                      />
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Availability
                    </dt>
                    <dd className="mt-1 font-medium">
                      {viewingItem.isAvailable ? "Available" : "Unavailable"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm leading-6">
                      {viewingItem.description || "No description available."}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">Location</dt>
                    <dd className="mt-1 text-sm">
                      {viewingItem.location || "Not specified"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm text-muted-foreground">Shop</dt>
                    <dd className="mt-1 text-sm">
                      {viewingItem.shopName || "Not specified"}
                    </dd>
                  </div>
                </dl>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
