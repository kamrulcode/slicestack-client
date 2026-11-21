import { apiFetch } from "@/lib/api/client";
import { toQuery } from "@/lib/api/query";
import type { ApiFetcher } from "@/types/api";
import type {
  CreateOrderInput,
  CustomerDashboardStats,
  Order,
  OrderStatus,
  VendorDashboardStats,
} from "@/types/order";

export function createOrderService(request: ApiFetcher) {
  return {
    create(input: CreateOrderInput) {
      return request<{ ok: boolean; message: string; order: Order }>(
        "/api/orders",
        { method: "POST", body: input },
      );
    },

    customerOrders() {
      return request<Order[]>("/api/customer/orders");
    },

    customerOrder(id: string) {
      return request<Order>(`/api/customer/orders/${encodeURIComponent(id)}`);
    },

    cancel(id: string) {
      return request<{ ok: boolean; message: string; order: Order }>(
        `/api/customer/orders/${encodeURIComponent(id)}/cancel`,
        { method: "PATCH" },
      );
    },

    customerDashboard() {
      return request<CustomerDashboardStats>("/api/customer/dashboard");
    },

    vendorOrders(status?: OrderStatus) {
      return request<Order[]>(
        `/api/vendor/orders${toQuery({ status })}`,
      );
    },

    vendorOrder(id: string) {
      return request<Order>(`/api/vendor/orders/${encodeURIComponent(id)}`);
    },

    setVendorStatus(id: string, status: "accepted" | "rejected") {
      return request<{ ok: boolean; message: string; order: Order }>(
        `/api/vendor/orders/${encodeURIComponent(id)}/status`,
        { method: "PATCH", body: { status } },
      );
    },

    vendorDashboard() {
      return request<VendorDashboardStats>("/api/vendor/dashboard");
    },
  };
}

export const orderService = createOrderService(apiFetch);
