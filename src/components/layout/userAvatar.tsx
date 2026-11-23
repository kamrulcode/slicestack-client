"use client";

import {
  IconDotsVertical,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserTooltip } from "@/components/utils/Tooltip";
import { Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { errorMessage } from "@/lib/api/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    image: string;
    role: string;
  };
}) {
  const router = useRouter();
  const initials =
    user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("You have been signed out.");
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <DropdownMenu>
      <UserTooltip user={user}>
        <DropdownMenuTrigger className="sm:flex items-center justify-center gap-2 hidden">
          <Avatar className="size-8 shrink-0 overflow-hidden rounded-full grayscale">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback className="rounded-full">{initials}</AvatarFallback>
          </Avatar>
          <IconDotsVertical className="ml-auto size-4" />
        </DropdownMenuTrigger>
      </UserTooltip>

      <DropdownMenuContent
        className="w-(--anchor-width) min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            render={<Link href={`/dashboard/${user.role}`}></Link>}
          >
            <IconUserCircle />
            Dashboard
          </DropdownMenuItem>

          <DropdownMenuItem
            render={<Link href={`/dashboard/${user.role}/profile`}></Link>}
          >
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
