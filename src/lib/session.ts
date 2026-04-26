import { cookies } from "next/headers";

export const SESSION_COOKIE = "ss_session";
export const SESSION_MAX_AGE = 60 * 24 * 60 * 60; // 60 days — matches Meta long-lived token

export const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  // Cookie value is URL-encoded on set (handles `|` and other chars
  // Meta sometimes includes in tokens). Decode on read.
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
