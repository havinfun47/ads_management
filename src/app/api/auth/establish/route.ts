import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

// Receives the long-lived Meta access token from /api/auth/callback's
// Continue form submit, sets the session cookie, and renders an HTML
// "you're in" page with a link to the dashboard.
//
// IMPORTANT: This endpoint does NOT redirect. Chrome's bounce-tracking
// mitigation purges cookies set on responses that immediately redirect,
// so we render content the user must click through. The link to
// /dashboard is a normal user-clicked navigation that arrives with the
// cookie already persisted.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get("token") ?? "");
  if (!token) {
    return NextResponse.redirect(`${env.appUrl}/login?error=missing_token`, { status: 303 });
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <title>You're signed in</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background: #F5F3EE; color: #1C1C1A; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
    .card { background: #FFFFFF; border: 1px solid #E5E1D6; border-radius: 12px; padding: 2rem; max-width: 28rem; width: 100%; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
    .check { width: 48px; height: 48px; border-radius: 50%; background: #2D5C3F; color: #F5F3EE; display: grid; place-items: center; margin: 0 auto 1rem; font-size: 24px; }
    h1 { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem; letter-spacing: -0.01em; }
    p { margin: 0 0 1.5rem; font-size: 0.875rem; color: #6B6860; line-height: 1.5; }
    .cta { display: inline-block; background: #2D5C3F; color: #F5F3EE; text-decoration: none; border-radius: 8px; padding: 0.75rem 1.25rem; font-size: 0.875rem; font-weight: 500; transition: background 0.15s; }
    .cta:hover { background: #244c33; }
    .cta:focus-visible { outline: 2px solid #FBBF24; outline-offset: 2px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="check" aria-hidden="true">✓</div>
    <h1>You're signed in</h1>
    <p>Your Meta account is now connected to Scale Scientist.</p>
    <a class="cta" href="/dashboard" autofocus>Open dashboard →</a>
  </div>
</body>
</html>`;

  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });

  // Build Set-Cookie by hand to ensure exact attributes.
  const cookie = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Lax`,
    `Max-Age=${sessionCookieOptions.maxAge}`,
  ].join("; ");
  headers.append("Set-Cookie", cookie);

  console.log("[oauth-establish] cookie set on 200 HTML, token length:", token.length);

  return new NextResponse(html, { status: 200, headers });
}
