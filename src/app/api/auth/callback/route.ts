import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { exchangeForLongLivedToken } from "@/lib/meta";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

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

  // Set the cookie on a 200 HTML response (not a redirect). Safari/Brave
  // both refuse to persist cookies set on redirects that came from a
  // cross-site flow (facebook.com → here), so we render a tiny HTML page
  // and JS-redirect to /dashboard once the cookie is stored.
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <title>Signing in…</title>
  <meta http-equiv="refresh" content="0; url=/dashboard">
  <style>
    body { font-family: system-ui, sans-serif; background: #F5F3EE; color: #1C1C1A; display: grid; place-items: center; min-height: 100vh; margin: 0; }
    .box { text-align: center; }
    .spinner { width: 28px; height: 28px; border: 3px solid #E5E1D6; border-top-color: #2D5C3F; border-radius: 50%; margin: 0 auto 16px; animation: spin 0.7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    p { margin: 0; font-size: 14px; color: #6B6860; }
  </style>
</head>
<body>
  <div class="box">
    <div class="spinner" aria-hidden="true"></div>
    <p>Signing you in…</p>
  </div>
  <script>window.location.replace('/dashboard');</script>
  <noscript><a href="/dashboard">Continue</a></noscript>
</body>
</html>`;

  // Build Set-Cookie header by hand to bypass any Next.js cookie API
  // quirk. Two Set-Cookie headers — one to set the session, one to
  // clear the OAuth state nonce.
  const sessionCookie = [
    `${SESSION_COOKIE}=${encodeURIComponent(longLived)}`,
    `Path=/`,
    `HttpOnly`,
    `Secure`,
    `SameSite=Lax`,
    `Max-Age=${sessionCookieOptions.maxAge}`,
  ].join("; ");

  const clearStateCookie = [
    `fb_oauth_state=`,
    `Path=/`,
    `Max-Age=0`,
  ].join("; ");

  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  headers.append("Set-Cookie", sessionCookie);
  headers.append("Set-Cookie", clearStateCookie);

  console.log("[oauth-callback] cookie set, token length:", longLived.length);

  return new NextResponse(html, { status: 200, headers });
}
