import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  VENDOR_STATUS_LABEL,
  type VendorApplicationStatus,
} from "@/types/vendor";

const styles: Record<VendorApplicationStatus, string> = {
  PENDING:
    "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300",
  APPROVED:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300",
  REJECTED:
    "bg-red-100 text-red-900 dark:bg-red-500/15 dark:text-red-300",
  SUSPENDED: "bg-muted text-muted-foreground",
};

export function VendorStatusBadge({
  status,
  className,
}: {
  status: VendorApplicationStatus;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(styles[status], className)}>
      {VENDOR_STATUS_LABEL[status]}
    </Badge>
  );
}
