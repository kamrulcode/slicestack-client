import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { FaGoogle } from "react-icons/fa";

export function GoogleButton() {
  const handleGoogleLoign = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-12 w-full gap-2.5 rounded-lg border-border bg-card text-[15px] font-semibold text-foreground hover:bg-secondary"
      onClick={handleGoogleLoign}
    >
      <span aria-hidden className="font-heading text-lg leading-none font-bold">
        <FaGoogle />
      </span>
      Continue with Google
    </Button>
  );
}
