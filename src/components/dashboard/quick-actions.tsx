import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type QuickAction = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
};

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump straight to the work that matters.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <Link
            key={action.href + action.title}
            href={action.href}
            className={cn(
              "group flex items-start gap-3 rounded-lg border border-border/70 p-3 transition-colors hover:border-primary/40 hover:bg-accent/60",
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary [&_svg]:size-4">
              {action.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                {action.title}
                <ArrowRight
                  className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden
                />
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {action.description}
              </span>
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
