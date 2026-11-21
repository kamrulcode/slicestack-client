import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/types/order";

const styles: Record<OrderStatus, string> = {
  pending:
    "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300",
  accepted:
    "bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300",
  rejected: "bg-red-100 text-red-900 dark:bg-red-500/15 dark:text-red-300",
  cancelled: "bg-muted text-muted-foreground",
};

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(styles[status], className)}>
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}
