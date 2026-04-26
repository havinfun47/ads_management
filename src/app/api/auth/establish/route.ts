import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

// Receives the long-lived Meta access token from /api/auth/callback's
// JavaScript form submit, and sets the session cookie. Crucially, the
// request to this endpoint is initiated by JS running on our own page,
// not by a redirect from facebook.com — so Chrome's bounce-tracking
// mitigation does not apply, and the Set-Cookie header on the response
// is honored permanently.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get("token") ?? "");
  if (!token) {
    return NextResponse.redirect(`${env.appUrl}/login?error=missing_token`, { status: 303 });
  }

  const res = NextResponse.redirect(`${env.appUrl}/dashboard`, { status: 303 });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);

  console.log("[oauth-establish] set ss_session, length:", token.length);

  return res;
}
