import { SignJWT, jwtVerify } from "jose";

const getSecret = () =>
  new TextEncoder().encode(
    process.env.AUTH_SECRET ?? "dev-secret-CHANGE-in-production-32-chars!!"
  );

export interface SessionPayload {
  sub: string;   // User.id
  email: string;
  orgId?: string; // Member.orgId — included so middleware can redirect without a DB hit
}

// ── JWT ──────────────────────────────────────────────────────────────

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, orgId: payload.orgId ?? null })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      orgId: typeof payload.orgId === "string" ? payload.orgId : undefined,
    };
  } catch {
    return null;
  }
}

// ── Passwords (Node.js runtime only — not Edge) ───────────────────────

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import("bcryptjs");
  return bcrypt.compare(password, hash);
}
