import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { getCurrentUser } from "@/lib/authorization";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Join SliceStack as a customer or vendor and start ordering or selling pizza.",
};

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <AuthShell
      image={{
        src: "/images/auth-chef.jpg",
        alt: "A SliceStack chef finishing a dish under warm lamps",
      }}
    >
      <SignUpForm />
    </AuthShell>
  );
}
