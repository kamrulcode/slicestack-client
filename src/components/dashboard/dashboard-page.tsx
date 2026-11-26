import { Children, type ReactNode } from "react";
import { Reveal } from "@/components/common/reveal";

export function DashboardPage({
  title,
  description,
  actions,
  animateChildren = true,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  animateChildren?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Reveal y={16}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-heading text-[1.75rem] leading-tight font-bold tracking-tight sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-1.5 text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap gap-2">{actions}</div>
          ) : null}
        </div>
      </Reveal>
      {animateChildren
        ? Children.map(children, (child, index) =>
            child == null ? child : (
              <Reveal key={index} delay={0.05 + index * 0.06} y={20}>
                {child}
              </Reveal>
            ),
          )
        : children}
    </div>
  );
}
