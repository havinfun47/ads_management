import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

// Receives a fetch() POST from the parent window's FacebookLoginButton
// after the popup OAuth flow completes. Sets the session cookie and
// returns 200 JSON. Because this fetch is initiated from the parent
// window's JS (a page with established user interaction history), the
// cookie set on this response is not subject to bounce-tracking purges.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get("token") ?? "");
  if (!token) {
    return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  const cookie = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Lax`,
    `Max-Age=${sessionCookieOptions.maxAge}`,
  ].join("; ");
  headers.append("Set-Cookie", cookie);

  console.log("[oauth-establish fetch] cookie set, token length:", token.length);

  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers });
}
