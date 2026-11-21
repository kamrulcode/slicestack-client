import { apiFetch } from "@/lib/api/client";
import { toQuery } from "@/lib/api/query";
import type { ApiFetcher } from "@/types/api";
import type { AdminDashboardStats, PlatformUser } from "@/types/admin";
import type { MenuItemStatus, VendorMenuItemRecord } from "@/types/menu";
import type { Role } from "@/types/auth";
import type { TransactionRecord } from "@/types/order";
import type { VendorApplication, VendorApplicationStatus } from "@/types/vendor";

export type AdminMutation = { ok: boolean; message: string };

export function createAdminService(request: ApiFetcher) {
  return {
    dashboard() {
      return request<AdminDashboardStats>("/api/admin/dashboard");
    },

    users(filters: { search?: string; role?: Role | "all" } = {}) {
      return request<PlatformUser[]>(
        `/api/admin/users${toQuery({
          search: filters.search,
          role: filters.role === "all" ? undefined : filters.role,
        })}`,
      );
    },

    setUserBlocked(id: string, blocked: boolean) {
      return request<AdminMutation>(
        `/api/admin/users/${encodeURIComponent(id)}/block`,
        { method: "PATCH", body: { blocked } },
      );
    },

    menuItems(filters: { search?: string; status?: MenuItemStatus | "all" } = {}) {
      return request<VendorMenuItemRecord[]>(
        `/api/admin/menu-items${toQuery({
          search: filters.search,
          status: filters.status === "all" ? undefined : filters.status,
        })}`,
      );
    },

    setMenuStatus(
      id: string,
      status: MenuItemStatus,
      rejectionReason?: string,
    ) {
      return request<AdminMutation>(
        `/api/admin/menu-items/${encodeURIComponent(id)}`,
        { method: "PATCH", body: { status, rejectionReason } },
      );
    },

    deleteMenuItem(id: string) {
      return request<AdminMutation>(
        `/api/admin/menu-items/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
    },

    transactions() {
      return request<TransactionRecord[]>("/api/admin/transactions");
    },

    vendorApplications(status?: VendorApplicationStatus | "all") {
      return request<VendorApplication[]>(
        `/api/admin/vendor-applications${toQuery({
          status: status === "all" ? undefined : status,
        })}`,
      );
    },

    reviewVendorApplication(
      id: string,
      action: "approve" | "reject" | "suspend",
      reason?: string,
    ) {
      return request<AdminMutation>(
        `/api/admin/vendor-applications/${encodeURIComponent(id)}`,
        { method: "PATCH", body: { action, reason } },
      );
    },
  };
}

export const adminService = createAdminService(apiFetch);
