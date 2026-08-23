import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "apex_cms_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

function getSecret() {
  return process.env.PAYLOAD_SECRET || process.env.CMS_SESSION_SECRET || "dev-cms-secret-change-me";
}

function sign(payload: string) {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function getAdminPassword() {
  return process.env.CMS_ADMIN_PASSWORD || "apex-admin";
}

export async function createCmsSession() {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // No maxAge → session cookie; cleared when the browser closes.
  });
}

export async function clearCmsSession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function isCmsAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [expiresRaw, signature] = token.split(".");
  if (!expiresRaw || !signature) return false;

  const expected = sign(expiresRaw);
  try {
    const validSig = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!validSig) return false;
  } catch {
    return false;
  }

  const expires = Number(expiresRaw);
  return Number.isFinite(expires) && expires > Date.now();
}

export { COOKIE_NAME };
