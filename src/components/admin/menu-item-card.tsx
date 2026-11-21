"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BASE_URL } from "@/config/baseURL";
import type { VendorMenuItemRecord } from "@/types/menu";
import { formatPrice } from "@/lib/format";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// ---------------------------------------------
// Types
// ---------------------------------------------

export type ApprovalStatus = "approved" | "pending" | "rejected";

interface MenuItemCardProps {
  item: VendorMenuItemRecord;
}

// ---------------------------------------------
// Status styles
// ---------------------------------------------

const approvalStyles: Record<ApprovalStatus, string> = {
  approved:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",

  pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",

  rejected:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
};

// ---------------------------------------------
// Helpers
// ---------------------------------------------

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

function isApprovalStatus(status: string): status is ApprovalStatus {
  return status === "approved" || status === "pending" || status === "rejected";
}

function isApiResult(
  result: unknown,
): result is { ok: boolean; message?: string } {
  return typeof result === "object" && result !== null && "ok" in result;
}

async function requestAdminMenuItem(
  itemId: string,
  init: RequestInit,
): Promise<string> {
  const response = await fetch(
    `${BASE_URL}/api/admin/menu-items/${encodeURIComponent(itemId)}`,
    init,
  );
  const result: unknown = await response.json();

  if (!response.ok || !isApiResult(result) || !result.ok) {
    const message =
      isApiResult(result) && typeof result.message === "string"
        ? result.message
        : "Unable to update menu item.";
    throw new Error(message);
  }

  return typeof result.message === "string"
    ? result.message
    : "Menu item updated successfully.";
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

// ---------------------------------------------
// Menu Item Card
// ---------------------------------------------

export function MenuItemCard({ item }: MenuItemCardProps) {
  const router = useRouter();
  const [viewingItem, setViewingItem] = useState<VendorMenuItemRecord | null>(
    null,
  );

  const status = getApprovalStatus(item.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // -------------------------------------------
  // Update Approval Status
  // -------------------------------------------

  async function handleStatusChange(value: ApprovalStatus | null) {
    if (value === null || !isApprovalStatus(value)) return;
    const newStatus = value;

    if (newStatus === status || updatingStatus) return;

    setUpdatingStatus(true);

    try {
      await requestAdminMenuItem(item._id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: item.itemName,
          category: item.category,
          price: item.price,
          status: newStatus,
        }),
      });

      toast.success(`Menu item status updated to ${newStatus}.`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update menu item status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  // -------------------------------------------
  // Delete Menu Item
  // -------------------------------------------

  async function handleDelete() {
    setDeleting(true);

    try {
      const message = await requestAdminMenuItem(item._id, {
        method: "DELETE",
      });

      setDeleteDialogOpen(false);
      toast.success(message);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete menu item.",
      );
    } finally {
      setDeleting(false);
    }
  }

  // -------------------------------------------
  // Render
  // -------------------------------------------

  return (
    <>
      <article className="flex flex-col gap-4 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center">
        {/* Menu Image */}
        <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-24 sm:w-28">
          {item.images?.[0] ? (
            <Image
              src={item.images[0]}
              alt={item.itemName}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Menu Information */}
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="truncate font-semibold">{item.itemName}</h3>

          <p className="text-sm text-muted-foreground">
            {item.category} · {item.shopName || "Unknown shop"}
          </p>

          <p className="text-sm font-semibold">{formatPrice(item.price)}</p>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            <ApprovalBadge status={status} />

            <Badge variant="outline">
              {item.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {/* Details and Status */}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setViewingItem(item)}
            >
              <Eye className="size-4" />
              Details
            </Button>

            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={updatingStatus || deleting}
            >
              <SelectTrigger className="h-9 w-36.25">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>

                <SelectItem value="pending">Pending</SelectItem>

                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Delete Button */}
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
                  disabled={deleting || updatingStatus}
                >
                  <Trash2 className="size-4" />
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
                <AlertDialogCancel disabled={deleting}>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={(event) => {
                    event.preventDefault();
                    void handleDelete();
                  }}
                >
                  {deleting ? "Deleting..." : "Yes, Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </article>

      {/* Details Sheet */}
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
                {/* Image */}
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

                {/* Details */}
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
