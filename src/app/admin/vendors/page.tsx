import { redirect } from "next/navigation";
import { requireRole } from "@/lib/authorization";

/**
 * Requested public URL. Authorization still happens on the server; the real
 * review workspace lives inside the admin dashboard shell.
 */
export default async function AdminVendorsRedirectPage() {
  await requireRole(["admin"], "/dashboard/admin/vendors");
  redirect("/dashboard/admin/vendors");
}
