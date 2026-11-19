import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your SliceStack account to order hot, fresh pizza.",
};

export default function SignInPage() {
  return (
    <AuthShell
      image={{
        src: "/images/auth-restaurant.jpg",
        alt: "The SliceStack dining room at golden hour",
      }}
    >
      <SignInForm />
    </AuthShell>
  );
}
