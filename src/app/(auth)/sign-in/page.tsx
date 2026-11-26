import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { getCurrentUser } from "@/lib/authorization";
import { safeRedirectPath } from "@/lib/redirects";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your SliceStack account to order hot, fresh pizza.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  // Mirror requireAuth(): a blocked account must stay on this page. Redirecting
  // it to /dashboard would bounce straight back here and loop forever.
  if (user && !user.blocked) {
    const params = await searchParams;
    redirect(safeRedirectPath(params.next));
  }

  const params = await searchParams;
  const nextPath = params.next ? safeRedirectPath(params.next) : undefined;

  return (
    <AuthShell
      image={{
        src: "/images/auth-restaurant.jpg",
        alt: "The SliceStack dining room at golden hour",
      }}
    >
      <SignInForm nextPath={nextPath} />
    </AuthShell>
  );
}
