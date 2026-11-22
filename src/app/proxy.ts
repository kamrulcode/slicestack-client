import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { safeRedirectPath } from "@/lib/redirects";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return NextResponse.next();

  const destination =
    request.nextUrl.pathname === "/sign-in"
      ? safeRedirectPath(request.nextUrl.searchParams.get("next"))
      : "/dashboard";

  return NextResponse.redirect(new URL(destination, request.url));
}

export const config = {
  matcher: ["/sign-in/:path*", "/sign-up/:path*"],
};
