import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatDateTime } from "@/lib/order-format";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABEL, type OrderStatusEntry } from "@/types/order";

const ICONS = {
  pending: Clock,
  accepted: CheckCircle2,
  rejected: XCircle,
  cancelled: XCircle,
} as const;

export function OrderTimeline({ history }: { history: OrderStatusEntry[] }) {
  if (!history.length) return null;

  return (
    <ol className="relative flex flex-col gap-4 border-l border-border pl-5">
      {history.map((entry, index) => {
        const Icon = ICONS[entry.status] ?? Clock;
        const isLast = index === history.length - 1;

        return (
          <li key={`${entry.status}-${entry.at}`} className="relative">
            <span
              className={cn(
                "absolute top-0.5 -left-[30px] grid size-5 place-items-center rounded-full border bg-card",
                isLast ? "border-primary text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-3" aria-hidden />
            </span>
            <p className="text-sm font-semibold">
              {ORDER_STATUS_LABEL[entry.status]}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(entry.at)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
