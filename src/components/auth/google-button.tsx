import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa";

export function GoogleButton() {
  const handleGoogleSignIn = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
    });

    if (error) {
      toast.error(error.message || "Google sign-in is not available yet.");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-12 w-full gap-2.5 rounded-lg border-border bg-card text-[15px] font-semibold text-foreground hover:bg-secondary"
      onClick={handleGoogleSignIn}
    >
      <span aria-hidden className="font-heading text-lg leading-none font-bold">
        <FaGoogle />
      </span>
      Continue with Google
    </Button>
  );
}
