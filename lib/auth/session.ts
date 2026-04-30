/**
 * Session cookie utilities. Self-hosted auth, no external provider.
 *
 * Token format:  base64url(payload).base64url(hmac-sha256(payload))
 * Payload:       JSON { uid, email, exp }
 *
 * Cookie:        mp_session, httpOnly, sameSite=lax, secure in prod.
 * Lifetime:      30 days.
 *
 * Env safety: when AUTH_SECRET is unset (e.g. preview deploys without
 * env vars) we fall back to a per-process random secret and log a
 * warning. Cookies will not survive a server restart, but nothing
 * throws — the marketing site keeps rendering.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "mp_session";
const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type Session = {
  uid: string;
  email: string;
  /** Unix ms expiry. */
  exp: number;
};

let cachedSecret: string | null = null;
let warned = false;
function secret(): string {
  if (cachedSecret) return cachedSecret;
  const fromEnv = process.env.AUTH_SECRET;
  if (fromEnv && fromEnv.length >= 16) {
    cachedSecret = fromEnv;
    return cachedSecret;
  }
  if (!warned) {
    // eslint-disable-next-line no-console
    console.warn(
      "[auth] AUTH_SECRET is not set or too short. Using an ephemeral " +
        "per-process secret. Sessions will not persist across restarts."
    );
    warned = true;
  }
  cachedSecret = randomBytes(32).toString("hex");
  return cachedSecret;
}

function b64urlEncode(buf: Buffer | string): string {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf);
  return b
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(s: string): Buffer {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function sign(payload: Session): string {
  const body = b64urlEncode(JSON.stringify(payload));
  const mac = createHmac("sha256", secret()).update(body).digest();
  return `${body}.${b64urlEncode(mac)}`;
}

export function verify(token: string): Session | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, mac] = parts;
  const expected = createHmac("sha256", secret()).update(body).digest();
  const provided = b64urlDecode(mac);
  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return null;
  }
  try {
    const session = JSON.parse(b64urlDecode(body).toString()) as Session;
    if (session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function setSession(
  uid: string,
  email: string,
  ttlMs = DEFAULT_TTL_MS
) {
  const session: Session = { uid, email, exp: Date.now() + ttlMs };
  const token = sign(session);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(ttlMs / 1000),
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies();
  const c = jar.get(COOKIE_NAME);
  if (!c) return null;
  return verify(c.value);
}
