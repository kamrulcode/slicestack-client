export const ROLES = ["customer", "vendor", "admin"] as const;

export type Role = (typeof ROLES)[number];

export function normalizeRole(value: unknown): Role {
  return value === "admin" || value === "vendor" ? value : "customer";
}

/** The landing dashboard for a role. Customers with pending applications stay here. */
export function dashboardPathForRole(role: Role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "vendor") return "/dashboard/vendor";
  return "/dashboard/customer";
}
