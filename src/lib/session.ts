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
  return store.get(SESSION_COOKIE)?.value ?? null;
}
