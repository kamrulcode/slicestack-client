"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { errorMessage } from "@/lib/api/client";
import { adminService } from "@/services/admin.service";

export function UserBlockButton({
  userId,
  blocked,
}: {
  userId: string;
  blocked: boolean;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function update() {
    setIsPending(true);

    try {
      const result = await adminService.setUserBlocked(userId, !blocked);
      toast.success(result.message);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant={blocked ? "outline" : "destructive"}
            size="sm"
            className="gap-1.5"
            disabled={isPending}
          >
            {blocked ? (
              <ShieldCheck className="size-3.5" aria-hidden />
            ) : (
              <ShieldBan className="size-3.5" aria-hidden />
            )}
            {blocked ? "Unblock" : "Block"}
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {blocked ? "Restore this account?" : "Block this account?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {blocked
              ? "The user will be able to sign in and use SliceStack again."
              : "The user is signed out immediately and cannot sign in or use the API until unblocked."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={update} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Saving...
              </>
            ) : blocked ? (
              "Unblock user"
            ) : (
              "Block user"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
