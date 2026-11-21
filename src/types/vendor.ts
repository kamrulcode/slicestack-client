export const VENDOR_APPLICATION_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
] as const;

export type VendorApplicationStatus =
  (typeof VENDOR_APPLICATION_STATUSES)[number];

export type VendorApplication = {
  id: string;
  userId: string;
  shopName: string;
  ownerName: string;
  phone: string;
  address: string;
  description: string;
  logoUrl: string | null;
  status: VendorApplicationStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ShopStatus = "active" | "suspended";

export type Shop = {
  id: string;
  ownerId: string;
  applicationId: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  logoUrl: string | null;
  status: ShopStatus;
  plan?: "free" | "premium";
  premiumUntil?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AuthMe = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: "customer" | "vendor" | "admin";
    blocked: boolean;
    createdAt: string | null;
  };
  application: VendorApplication | null;
  shop: Shop | null;
};

export const VENDOR_STATUS_LABEL: Record<VendorApplicationStatus, string> = {
  PENDING: "Pending review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};
