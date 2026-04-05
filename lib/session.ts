import { cookies } from "next/headers";
import { verifyToken, signToken } from "@/lib/auth";
import type { SessionPayload } from "@/lib/auth";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "ag_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// ── Read session (Server Components, Server Actions, API routes) ──────

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ── Set cookie from a Server Action ──────────────────────────────────

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await signToken(payload);
  cookies().set(SESSION_COOKIE, token, { ...COOKIE_OPTS, maxAge: MAX_AGE });
}

// ── Clear cookie from a Server Action ────────────────────────────────

export function deleteSessionCookie(): void {
  cookies().set(SESSION_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
}

// ── Attach/clear on a NextResponse (API routes) ───────────────────────

export async function attachSession(
  res: NextResponse,
  payload: SessionPayload
): Promise<NextResponse> {
  const token = await signToken(payload);
  res.cookies.set(SESSION_COOKIE, token, { ...COOKIE_OPTS, maxAge: MAX_AGE });
  return res;
}

export function clearSession(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  return res;
}
