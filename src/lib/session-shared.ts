// Constants and helpers safe for both server and client.
// Anything that imports next/headers must live in session.ts only.

export const SESSION_COOKIE = "ss_session";
export const SESSION_MAX_AGE = 60 * 24 * 60 * 60; // 60 days

export function buildClientSetCookie(value: string): string {
  return [
    `${SESSION_COOKIE}=${encodeURIComponent(value)}`,
    `Path=/`,
    `Secure`,
    `SameSite=Lax`,
    `Max-Age=${SESSION_MAX_AGE}`,
  ].join("; ");
}
