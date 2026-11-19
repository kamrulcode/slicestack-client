import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AuthFieldProps = ComponentProps<typeof Input> & {
  label: string;
};

export function AuthField({ label, id, className, ...props }: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label
        htmlFor={id}
        className="text-[15px] leading-none font-semibold text-foreground"
      >
        {label}
      </Label>
      <Input
        id={id}
        className={cn(
          "h-12 rounded-lg border-input bg-card px-4 text-base shadow-none placeholder:text-muted-foreground/60 md:text-base",
          className,
        )}
        {...props}
      />
    </div>
  );
}
