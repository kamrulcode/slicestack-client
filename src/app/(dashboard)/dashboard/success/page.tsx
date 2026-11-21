import { redirect } from "next/navigation";

/**
 * Generic payment success page.
 *
 * The actual subscription checkout redirects to
 * `/dashboard/vendor/subscription?payment=success&session_id=...`, so this page
 * is only reached if someone navigates here directly. We redirect them to the
 * subscription page so the verification flow runs there.
 */
export default async function Success({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : null;

  if (sessionId) {
    redirect(
      `/dashboard/vendor/subscription?payment=success&session_id=${encodeURIComponent(sessionId)}`,
    );
  }

  redirect("/dashboard/vendor/subscription");
}
