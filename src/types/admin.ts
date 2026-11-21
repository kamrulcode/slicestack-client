import type { Role } from "@/types/auth";

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  blocked: boolean;
  createdAt: string | null;
};

export type AdminDashboardStats = {
  users: {
    total: number;
    vendors: number;
    admins: number;
    customers: number;
  };
  menuItems: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  transactions: {
    total: number;
    completed: number;
    revenue: number;
  };
  weeklyOrders: { date: string; count: number }[];
};
