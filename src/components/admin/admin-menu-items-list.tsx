"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ClipboardList, Pizza, Search } from "lucide-react";
import { MenuItemCard } from "@/components/admin/menu-item-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MenuItemStatus, VendorMenuItemRecord } from "@/types/menu";

const MENU_FILTERS = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
] as const;

const STATUS_LABEL: Record<MenuItemStatus, string> = {
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
};

type StatusFilter = MenuItemStatus | "all";

function isStatus(value: string | null): value is MenuItemStatus {
  return value === "approved" || value === "pending" || value === "rejected";
}

function filterFromLocation(): { status: StatusFilter; search: string } {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  return {
    status: isStatus(status) ? status : "all",
    search: params.get("search")?.trim() ?? "",
  };
}

export function AdminMenuItemsList({
  items,
  initialStatus,
  initialSearch,
}: {
  items: VendorMenuItemRecord[];
  initialStatus: StatusFilter;
  initialSearch: string;
}) {
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [search, setSearch] = useState(initialSearch);
  const [draftSearch, setDraftSearch] = useState(initialSearch);

  useEffect(() => {
    const handlePopState = () => {
      const filters = filterFromLocation();
      setStatus(filters.status);
      setSearch(filters.search);
      setDraftSearch(filters.search);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function updateLocation(nextStatus: StatusFilter, nextSearch: string) {
    const url = new URL(window.location.href);
    if (nextStatus === "all") {
      url.searchParams.delete("status");
    } else {
      url.searchParams.set("status", nextStatus);
    }
    if (nextSearch) {
      url.searchParams.set("search", nextSearch);
    } else {
      url.searchParams.delete("search");
    }
    window.history.pushState(null, "", url);
  }

  function selectStatus(nextStatus: StatusFilter) {
    if (nextStatus === status) return;
    setStatus(nextStatus);
    updateLocation(nextStatus, search);
  }

  function applySearch(nextSearch: string) {
    const normalizedSearch = nextSearch.trim();
    setSearch(normalizedSearch);
    setDraftSearch(normalizedSearch);
    updateLocation(status, normalizedSearch);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applySearch(draftSearch);
  }

  const visibleItems = items.filter((item) => {
    if (status !== "all" && item.status !== status) return false;
    if (!search) return true;
    const query = search.toLowerCase();
    return [item.itemName, item.shopName, item.category].some((value) =>
      value?.toLowerCase().includes(query),
    );
  });

  return (
    <>
      <form
        onSubmit={submitSearch}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={draftSearch}
            onChange={(event) => setDraftSearch(event.target.value)}
            placeholder="Search by item, shop or category"
            className="pl-9"
            aria-label="Search menu items"
          />
        </div>
        <Button type="submit">Search</Button>
        {search ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => applySearch("")}
          >
            Clear
          </Button>
        ) : null}
      </form>

      <div className="flex flex-wrap gap-2">
        {MENU_FILTERS.map((filter) => {
          const count =
            filter.value === "all"
              ? items.length
              : items.filter((item) => item.status === filter.value).length;

          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={status === filter.value}
              className={buttonVariants({
                size: "sm",
                variant: status === filter.value ? "default" : "outline",
              })}
              onClick={() => selectStatus(filter.value)}
            >
              {filter.label} ({count})
            </button>
          );
        })}
      </div>

      {visibleItems.length === 0 ? (
        <EmptyState
          icon={
            status === "all" ? (
              <Pizza aria-hidden />
            ) : (
              <ClipboardList aria-hidden />
            )
          }
          title={
            search
              ? "No items match this search"
              : status === "all"
                ? "No menu items yet"
                : `No ${STATUS_LABEL[status].toLowerCase()} menu items`
          }
          description="Menu items submitted by vendors will appear here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {visibleItems.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </>
  );
}
