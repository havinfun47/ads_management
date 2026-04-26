import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { exchangeForLongLivedToken } from "@/lib/meta";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${env.appUrl}/login?error=${encodeURIComponent(error)}`);
  }
  if (!code || !state) {
    return NextResponse.redirect(`${env.appUrl}/login?error=missing_code`);
  }

  const cookieState = req.cookies.get("fb_oauth_state")?.value;
  if (!cookieState || cookieState !== state) {
    return NextResponse.redirect(`${env.appUrl}/login?error=state_mismatch`);
  }

  const tokenUrl = new URL(`https://graph.facebook.com/${env.graphApiVersion}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", env.facebookAppId);
  tokenUrl.searchParams.set("client_secret", env.facebookAppSecret);
  tokenUrl.searchParams.set("redirect_uri", `${env.appUrl}/api/auth/callback`);
  tokenUrl.searchParams.set("code", code);

  const tokenRes = await fetch(tokenUrl, { cache: "no-store" });
  if (!tokenRes.ok) {
    return NextResponse.redirect(`${env.appUrl}/login?error=token_exchange_failed`);
  }
  const { access_token: shortLived } = (await tokenRes.json()) as { access_token: string };

  let longLived: string;
  try {
    const exchanged = await exchangeForLongLivedToken(shortLived);
    longLived = exchanged.access_token;
  } catch {
    return NextResponse.redirect(`${env.appUrl}/login?error=long_token_exchange_failed`);
  }

  // We can't set the session cookie here — Chrome treats cookies set on
  // responses to requests that came from facebook.com as ephemeral
  // (bounce-tracking mitigation). Instead, render a small HTML page that
  // POSTs the token to /api/auth/establish via JavaScript. That POST is
  // initiated from our own page, so its response is a same-origin
  // request and the cookie set on it persists normally.
  // We must NOT auto-submit. Chrome's Bounce Tracking Mitigation will
  // purge any cookie set without explicit user interaction on this
  // domain after returning from a cross-site OAuth flow. Requiring a
  // button click registers user activation, which exempts the resulting
  // navigation from the bounce heuristic.
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <title>Almost done</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; background: #F5F3EE; color: #1C1C1A; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
    .card { background: #FFFFFF; border: 1px solid #E5E1D6; border-radius: 12px; padding: 2rem; max-width: 28rem; width: 100%; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
    .check { width: 48px; height: 48px; border-radius: 50%; background: #2D5C3F; color: #F5F3EE; display: grid; place-items: center; margin: 0 auto 1rem; font-size: 24px; }
    h1 { font-size: 1.25rem; font-weight: 600; margin: 0 0 0.5rem; letter-spacing: -0.01em; }
    p { margin: 0 0 1.5rem; font-size: 0.875rem; color: #6B6860; line-height: 1.5; }
    button { background: #2D5C3F; color: #F5F3EE; border: 0; border-radius: 8px; padding: 0.75rem 1.25rem; font-size: 0.875rem; font-weight: 500; cursor: pointer; width: 100%; transition: background 0.15s; }
    button:hover { background: #244c33; }
    button:focus-visible { outline: 2px solid #FBBF24; outline-offset: 2px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="check" aria-hidden="true">✓</div>
    <h1>Connected to Meta</h1>
    <p>One last step to finish signing in.</p>
    <form method="post" action="/api/auth/establish">
      <input type="hidden" name="token" value="${escapeHtmlAttr(longLived)}">
      <button type="submit" autofocus>Continue to Scale Scientist</button>
    </form>
  </div>
</body>
</html>`;

  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  // Clear the OAuth state nonce, but DO NOT set ss_session here.
  headers.append("Set-Cookie", `fb_oauth_state=; Path=/; Max-Age=0`);

  console.log("[oauth-callback] handing token off to /api/auth/establish, length:", longLived.length);

  return new NextResponse(html, { status: 200, headers });
}

function escapeHtmlAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
