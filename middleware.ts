import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "ag_session";
const DEMO_MODE = process.env.DEMO_MODE === "true";

const getSecret = () =>
  new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-secret-CHANGE-in-production-32-chars!!"
  );

const PROTECTED = ["/dashboard", "/admin", "/onboarding"];
const isProtected = (p: string) => PROTECTED.some((r) => p.startsWith(r));

export default async function middleware(req: NextRequest) {
  if (DEMO_MODE) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub) throw new Error("no sub");

    const orgId = payload.orgId as string | null | undefined;
    if (!orgId && isProtected(pathname)) {
      return NextResponse.redirect(new URL("/pending", req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
