/**
 * Edge-compatible CMS session verification for middleware.
 *
 * Mirrors the HMAC logic in auth.ts but uses Web Crypto API so it
 * runs in the Next.js Edge runtime. Keep both files in sync.
 */
const COOKIE_NAME = "apex_cms_session";

function getSecret() {
  return process.env.PAYLOAD_SECRET || process.env.CMS_SESSION_SECRET || "dev-cms-secret-change-me";
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function verifyCmsTokenAsync(token: string | undefined) {
  if (!token) return false;
  const [expiresRaw, signature] = token.split(".");
  if (!expiresRaw || !signature) return false;

  const expected = await sign(expiresRaw);
  if (!timingSafeEqual(signature, expected)) return false;

  const expires = Number(expiresRaw);
  return Number.isFinite(expires) && expires > Date.now();
}

export { COOKIE_NAME };
