import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/jobs(.*)',
  '/companies(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
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
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
