"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PizzaArt } from "@/components/brand/pizza-art";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { errorMessage } from "@/lib/api/client";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { menuService } from "@/services/menu.service";
import type { VendorMenuItemRecord } from "@/types/menu";
import { DeleteAlert } from "../utils/DeleteAlert";

type ApprovalStatus = "Approved" | "Pending" | "Rejected";
type EditValues = {
  name: string;
  category: string;
  price: string;
  description: string;
  location: string;
};

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

const approvalStyles: Record<ApprovalStatus, string> = {
  Approved:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300",
  Pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300",
  Rejected:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300",
};

function getApprovalStatus(status: string): ApprovalStatus {
  switch (status.toLowerCase()) {
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return "Pending";
  }
}

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("h-6 gap-1.5 px-2", approvalStyles[status])}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {status}
    </Badge>
  );
}

export function VendorMenuItems({
  menusItems,
}: {
  menusItems: VendorMenuItemRecord[];
}) {
  const [items, setItems] = useState(menusItems);
  const [editingItem, setEditingItem] = useState<VendorMenuItemRecord | null>(
    null,
  );
  const [viewingItem, setViewingItem] = useState<VendorMenuItemRecord | null>(
    null,
  );
  const [editValues, setEditValues] = useState<EditValues>({
    name: "",
    category: categories[0],
    price: "",
    description: "",
    location: "",
  });
  const [saving, setSaving] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  function startEditing(item: VendorMenuItemRecord) {
    setViewingItem(null);
    setEditingItem(item);
    setEditValues({
      name: item.itemName,
      category: item.category,
      price: String(item.price),
      description: item.description,
      location: item.location ?? "",
    });
  }

  function patchItem(id: string, changes: Partial<VendorMenuItemRecord>) {
    setItems((current) =>
      current.map((item) => (item._id === id ? { ...item, ...changes } : item)),
    );
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingItem) return;

    setSaving(true);
    try {
      const result = await menuService.update(editingItem._id, {
        itemName: editValues.name.trim(),
        category: editValues.category,
        price: Number(editValues.price),
        description: editValues.description.trim(),
        location: editValues.location.trim(),
      });

      patchItem(editingItem._id, {
        itemName: editValues.name.trim(),
        category: editValues.category,
        price: Number(editValues.price),
        description: editValues.description.trim(),
        location: editValues.location.trim(),
      });
      setEditingItem(null);
      toast.success(result.message);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item: VendorMenuItemRecord) {
    setBusyItemId(item._id);
    try {
      const result = await menuService.remove(item._id);
      setItems((current) => current.filter((entry) => entry._id !== item._id));
      toast.success(result.message);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyItemId(null);
    }
  }

  async function toggleAvailability(item: VendorMenuItemRecord) {
    const nextAvailability = !(item.isAvailable ?? true);
    setBusyItemId(item._id);

    try {
      const result = await menuService.setAvailability(
        item._id,
        nextAvailability,
      );
      patchItem(item._id, { isAvailable: nextAvailability });
      toast.success(result.message);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyItemId(null);
    }
  }

  return (
    <>
      <p className="mb-4 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
        Availability and edits apply to your live menu. New items are reviewed
        before they appear publicly.
      </p>

      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => {
            const isAvailable = item.isAvailable ?? true;

            return (
              <Card
                key={item._id}
                className="flex-row items-center gap-0 border border-border/70 p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-28">
                  {item.images?.[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.itemName}
                      fill
                      sizes="(min-width: 640px) 112px, 80px"
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <PizzaArt variant="cheese" />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-4 pl-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pl-5">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="truncate font-heading text-base font-bold sm:text-lg">
                        {item.itemName}
                      </CardTitle>
                      <ApprovalBadge
                        status={getApprovalStatus(item.status ?? "pending")}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-muted-foreground">
                        {item.category}
                      </span>
                      <span className="font-heading text-base font-semibold text-foreground">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                          setEditingItem(null);
                          setViewingItem(item);
                        }}
                      >
                        <Eye className="size-4" aria-hidden />
                        View Details
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        disabled={saving || busyItemId !== null}
                        onClick={() => startEditing(item)}
                      >
                        <Pencil className="size-4" aria-hidden />
                        Edit
                      </Button>
                      <DeleteAlert
                        deleteItem={deleteItem}
                        saving={saving}
                        item={item}
                        busyItemId={busyItemId}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        Manage availability
                      </span>
                      <div className="flex items-center justify-between gap-2 sm:justify-end">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isAvailable}
                          disabled={saving || busyItemId !== null}
                          aria-label={`${item.itemName}: ${isAvailable ? "Available" : "Unavailable"}`}
                          onClick={() => toggleAvailability(item)}
                          className={cn(
                            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                            isAvailable
                              ? "bg-emerald-600"
                              : "bg-muted-foreground/40",
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block size-5 rounded-full bg-white shadow transition-transform",
                              isAvailable ? "translate-x-5" : "translate-x-0.5",
                            )}
                            aria-hidden
                          />
                        </button>
                        <span
                          className={cn(
                            "w-24 text-right text-sm font-medium",
                            isAvailable
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-muted-foreground",
                          )}
                        >
                          {isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <p
          role="status"
          className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground"
        >
          No menu items yet. Add your first item to get started.
        </p>
      )}

      <Sheet
        open={editingItem !== null || viewingItem !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingItem(null);
            setViewingItem(null);
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto p-0 sm:max-w-lg"
        >
          <SheetHeader className="border-b border-border p-5 pr-14 sm:p-6 sm:pr-14">
            <SheetTitle>
              {editingItem ? "Edit menu item" : "Menu item details"}
            </SheetTitle>
            <SheetDescription>
              {editingItem
                ? "Update the item details. Changes are reviewed before going live."
                : viewingItem?.itemName}
            </SheetDescription>
          </SheetHeader>

          {editingItem && (
            <form onSubmit={saveEdit} className="space-y-5 p-5 sm:p-6">
              <div className="space-y-2">
                <Label htmlFor="menu-item-name">Item name</Label>
                <Input
                  id="menu-item-name"
                  required
                  minLength={3}
                  maxLength={100}
                  value={editValues.name}
                  onChange={(event) => {
                    const name = event.currentTarget.value;
                    setEditValues((current) => ({ ...current, name }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-item-category">Category</Label>
                <select
                  id="menu-item-category"
                  value={editValues.category}
                  onChange={(event) => {
                    const category = event.currentTarget.value;
                    setEditValues((current) => ({ ...current, category }));
                  }}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-item-price">Price</Label>
                <Input
                  id="menu-item-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  value={editValues.price}
                  onChange={(event) => {
                    const price = event.currentTarget.value;
                    setEditValues((current) => ({ ...current, price }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-item-location">Location</Label>
                <Input
                  id="menu-item-location"
                  required
                  minLength={2}
                  value={editValues.location}
                  onChange={(event) => {
                    const location = event.currentTarget.value;
                    setEditValues((current) => ({ ...current, location }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="menu-item-description">Description</Label>
                <Textarea
                  id="menu-item-description"
                  required
                  minLength={20}
                  rows={5}
                  value={editValues.description}
                  onChange={(event) => {
                    const description = event.currentTarget.value;
                    setEditValues((current) => ({ ...current, description }));
                  }}
                />
              </div>
              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          )}

          {viewingItem && (
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
                      status={getApprovalStatus(
                        viewingItem.status ?? "pending",
                      )}
                    />
                  </dd>
                </div>
                {viewingItem.status === "rejected" &&
                viewingItem.rejectionReason ? (
                  <div>
                    <dt className="text-sm text-muted-foreground">
                      Rejection reason
                    </dt>
                    <dd className="mt-1 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-500/10 dark:text-red-300">
                      {viewingItem.rejectionReason}
                    </dd>
                  </div>
                ) : null}
                <div>
                  <dt className="text-sm text-muted-foreground">Description</dt>
                  <dd className="mt-1 text-sm leading-6">
                    {viewingItem.description}
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
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
