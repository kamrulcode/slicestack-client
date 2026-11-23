import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sizes = {
  sm: {
    mark: "h-9 w-auto",
    text: "text-xl",
  },
  md: {
    mark: "h-12 w-auto",
    text: "text-2xl",
  },
  lg: {
    mark: "h-12 w-auto sm:h-14",
    text: "text-[2.5rem] leading-none sm:text-[3.5rem]",
  },
} as const;

export function Logo({
  className,
  href = "/",
  size = "sm",
}: {
  className?: string;
  href?: string;
  size?: keyof typeof sizes;
}) {
  const styles = sizes[size];

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Image
        src="/logo.webp"
        alt=""
        width={904}
        height={571}
        className={cn(
          "shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105",
          styles.mark,
        )}
      />
      <span
        className={cn("font-heading font-bold tracking-tight", styles.text)}
      >
        Slice<span className="text-primary">Stack</span>
      </span>
    </Link>
  );
}
