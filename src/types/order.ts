export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface OrderStatusEntry {
  status: OrderStatus;
  at: string;
}

export interface Order {
  id: string;
  menuItemId: string;
  itemName: string;
  itemImage: string | null;
  price: number;
  shopName: string;
  ownerId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  status: OrderStatus;
  statusHistory: OrderStatusEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  menuItemId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface CustomerDashboardStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
  weekly: DailyCount[];
}

export interface VendorDashboardStats {
  totalItems: number;
  activeItems: number;
  pendingItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  rejectedOrders: number;
  plan: SubscriptionPlanId;
  premiumUntil: string | null;
  weekly: DailyCount[];
  shop: {
    id: string;
    name: string;
    address: string;
    logoUrl: string | null;
  };
}

export type SubscriptionPlanId = "free" | "premium";

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  price: number;
  currency: string;
  interval: string;
  itemLimit: number | null;
  features: string[];
}

export interface TransactionRecord {
  _id: string;
  stripeSessionId?: string;
  vendorId: string;
  shopId?: string;
  vendorName?: string;
  vendorEmail?: string;
  plan?: string;
  amount: number;
  amountMinor?: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  createdAt: string;
  updatedAt?: string;
  paidAt?: string | null;
}

export interface SubscriptionState {
  plan: SubscriptionPlanId;
  plans: Record<SubscriptionPlanId, SubscriptionPlan>;
  premiumUntil: string | null;
  activeItems: number;
  itemLimit: number | null;
  paymentsEnabled: boolean;
  transactions: TransactionRecord[];
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
};
