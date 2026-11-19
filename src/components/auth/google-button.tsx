import { Button } from "@/components/ui/button";

export function GoogleButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-12 w-full gap-2.5 rounded-lg border-border bg-card text-[15px] font-semibold text-foreground hover:bg-secondary"
    >
      <span aria-hidden className="font-heading text-lg leading-none font-bold">
        G
      </span>
      Continue with Google
    </Button>
  );
}
