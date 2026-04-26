import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_MAX_AGE } from "./session-shared";

export { SESSION_COOKIE, SESSION_MAX_AGE };

export const sessionCookieOptions = {
  httpOnly: false as const,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
