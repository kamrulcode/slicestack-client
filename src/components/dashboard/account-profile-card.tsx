import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SessionUser } from "@/lib/authorization";

export function AccountProfileCard({ user }: { user: SessionUser }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Account
          <Badge variant="outline" className="capitalize">
            {user.role}
          </Badge>
        </CardTitle>
        <CardDescription>
          Name and email come from your Better Auth account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <ProfileRow label="Full name" value={user.name} />
        <ProfileRow label="Email address" value={user.email} />
        <ProfileRow label="Account id" value={user.id} mono />
        <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          Profile editing is not enabled yet. Your role is managed on the
          server and cannot be changed from the browser.
        </p>
      </CardContent>
    </Card>
  );
}

function ProfileRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/60 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={mono ? "font-mono text-xs" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
}
