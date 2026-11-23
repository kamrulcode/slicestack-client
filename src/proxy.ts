import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirects";

export async function proxy(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.next();

    const destination =
      request.nextUrl.pathname === "/sign-in"
        ? safeRedirectPath(request.nextUrl.searchParams.get("next"))
        : "/dashboard";

    return NextResponse.redirect(new URL(destination, request.url));
  } catch {
    // A transient session/database failure should never block the auth pages.
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/sign-in/:path*", "/sign-up/:path*"],
};
