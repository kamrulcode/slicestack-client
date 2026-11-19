import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Join SliceStack as a customer or vendor and start ordering or selling pizza.",
};

export default function SignUpPage() {
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
