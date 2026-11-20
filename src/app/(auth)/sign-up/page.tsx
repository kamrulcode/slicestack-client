import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm, type SignUpMode } from "@/components/auth/sign-up-form";
import { getCurrentUser } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Join SliceStack as a customer or vendor and start ordering or selling pizza.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const params = await searchParams;
  const defaultMode: SignUpMode =
    params.mode === "vendor" ? "vendor" : "customer";

  return (
    <AuthShell
      image={{
        src: "/images/auth-chef.jpg",
        alt: "A SliceStack chef finishing a dish under warm lamps",
      }}
    >
      <SignUpForm defaultMode={defaultMode} />
    </AuthShell>
  );
}
