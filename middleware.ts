import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/admin(.*)",
  "/onboarding(.*)",
  "/api/reports(.*)",
]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/about",
  "/blog(.*)",
  "/case-studies(.*)",
  "/contact",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/leads",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
