import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

export function GoHomeButton() {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Decorative Orange Strokes */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2">
        <span className="absolute -top-5 left-4 h-3 w-1.5 rotate-[-40deg] rounded-full bg-orange-500" />
        <span className="absolute top-0 left-0 h-1.5 w-5 rotate-[-10deg] rounded-full bg-orange-500" />
        <span className="absolute top-5 left-4 h-3 w-1.5 rotate-40 rounded-full bg-orange-500" />
      </div>

      {/* Main Button */}
      <Link
        href="/"
        className="group relative inline-flex h-16 min-w-57.5 items-center justify-center gap-3 overflow-hidden rounded-full bg-linear-to-r from-orange-400 via-orange-500 to-pink-600 px-8 text-lg font-bold text-white shadow-[0_12px_25px_rgba(255,65,95,0.25)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_16px_30px_rgba(255,65,95,0.35)] active:scale-95"
      >
        <Home className="size-6 fill-white stroke-white transition-transform duration-300 group-hover:scale-110" />

        <span className="whitespace-nowrap">Go to Home</span>

        <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1.5" />
      </Link>
    </div>
  );
}
