import type { ReactElement } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserTooltip({
  user,
  children,
}: {
  user: { name: string; email: string };
  children: ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent>
        <div className="text-center">
          <p className="font-medium">{user.name}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
