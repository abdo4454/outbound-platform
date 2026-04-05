/**
 * Field-level encryption for sensitive data (API keys, tokens) stored in the DB.
 * Uses AES-256-GCM with a random IV per value.
 *
 * ENCRYPTION_KEY must be a base64-encoded 32-byte key.
 * Generate: openssl rand -base64 32
 *
 * Encrypted values are stored with the prefix "enc:" so legacy plaintext values
 * can be read transparently (backward-compatible decrypt).
 */

import crypto from "crypto";

const ALGO = "aes-256-gcm" as const;
const PREFIX = "enc:";

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY ?? "";
  if (!raw || raw === "xxx" || raw.startsWith("placeholder")) {
    throw new Error("ENCRYPTION_KEY is not configured — generate one with: openssl rand -base64 32");
  }
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error(`ENCRYPTION_KEY must decode to 32 bytes, got ${key.length}`);
  }
  return key;
}

export function encrypt(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12); // 96-bit nonce for GCM
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const body = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag(); // 16 bytes
  // Layout: iv(12) | tag(16) | ciphertext — all base64-encoded
  return PREFIX + Buffer.concat([iv, tag, body]).toString("base64");
}

/**
 * Decrypt a value. If the value does not start with the "enc:" prefix it is
 * returned unchanged — this handles legacy plaintext values gracefully.
 */
export function decrypt(value: string): string {
  if (!value.startsWith(PREFIX)) return value; // plaintext passthrough
  try {
    const key = getKey();
    const buf = Buffer.from(value.slice(PREFIX.length), "base64");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const body = buf.subarray(28);
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(body).toString("utf8") + decipher.final("utf8");
  } catch {
    throw new Error("Failed to decrypt value — check ENCRYPTION_KEY");
  }
}

/** Returns true if the value was encrypted by this module. */
export function isEncrypted(value: string): boolean {
  return value.startsWith(PREFIX);
}
