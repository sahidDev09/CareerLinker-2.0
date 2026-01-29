import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/jobs(.*)',
  '/companies(.*)',
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    const homeUrl = new URL('/', req.url);
    homeUrl.searchParams.set('show_signin', 'true');
    // Store original destination to redirect after login
    homeUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
    return NextResponse.redirect(homeUrl);
  }

  // Refresh Supabase session if needed
  const { response } = createClient(req);
  return response;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
