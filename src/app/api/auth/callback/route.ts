import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { exchangeForLongLivedToken } from "@/lib/meta";

// Runs inside a popup window opened by FacebookLoginButton. Exchanges
// the OAuth code for a long-lived token, then renders an HTML page that
// postMessages the token to the opening window and closes itself. The
// opener (which has live user interaction) does the actual cookie set
// via fetch to /api/auth/establish — that side-steps Chrome/Brave's
// bounce-tracking mitigation that purges cookies set during a navigation
// chain returning from a cross-site OAuth.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  if (errorParam) {
    return popupErrorHtml(errorParam);
  }
  if (!code || !state) {
    return popupErrorHtml("missing_code");
  }

  const cookieState = req.cookies.get("fb_oauth_state")?.value;
  if (!cookieState || cookieState !== state) {
    return popupErrorHtml("state_mismatch");
  }

  const tokenUrl = new URL(`https://graph.facebook.com/${env.graphApiVersion}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", env.facebookAppId);
  tokenUrl.searchParams.set("client_secret", env.facebookAppSecret);
  tokenUrl.searchParams.set("redirect_uri", `${env.appUrl}/api/auth/callback`);
  tokenUrl.searchParams.set("code", code);

  const tokenRes = await fetch(tokenUrl, { cache: "no-store" });
  if (!tokenRes.ok) {
    return popupErrorHtml("token_exchange_failed");
  }
  const { access_token: shortLived } = (await tokenRes.json()) as { access_token: string };

  let longLived: string;
  try {
    const exchanged = await exchangeForLongLivedToken(shortLived);
    longLived = exchanged.access_token;
  } catch {
    return popupErrorHtml("long_token_exchange_failed");
  }

  console.log("[oauth-callback popup] handing token to opener, length:", longLived.length);

  return popupSuccessHtml(longLived);
}

function popupSuccessHtml(token: string) {
  // The token is embedded in JS as a JSON string for safe escaping.
  // Origin is hard-coded to env.appUrl so postMessage targets only our
  // own origin.
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <title>Signing you in…</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; background: #F5F3EE; color: #1C1C1A; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
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
  <script>
    (function () {
      var token = ${JSON.stringify(token)};
      var origin = ${JSON.stringify(env.appUrl)};
      try {
        if (window.opener) {
          window.opener.postMessage({ type: "scale-scientist-oauth", token: token }, origin);
        }
      } catch (e) {}
      setTimeout(function () { try { window.close(); } catch (e) {} }, 200);
    })();
  </script>
</body>
</html>`;

  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });
  // Clear the OAuth state nonce in the popup
  headers.append("Set-Cookie", `fb_oauth_state=; Path=/; Max-Age=0`);
  return new NextResponse(html, { status: 200, headers });
}

function popupErrorHtml(errCode: string) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Sign-in failed</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; background: #F5F3EE; color: #1C1C1A; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
    .box { text-align: center; max-width: 28rem; }
    .x { width: 48px; height: 48px; border-radius: 50%; background: #B91C1C; color: #F5F3EE; display: grid; place-items: center; margin: 0 auto 1rem; font-size: 24px; }
    h1 { font-size: 1.1rem; margin: 0 0 0.5rem; }
    p { margin: 0; font-size: 0.85rem; color: #6B6860; line-height: 1.5; }
    code { font-family: ui-monospace, monospace; background: #E5E1D6; padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.8rem; }
  </style>
</head>
<body>
  <div class="box">
    <div class="x" aria-hidden="true">!</div>
    <h1>Sign-in failed</h1>
    <p>This window will close in a moment. Try again from the sign-in page.</p>
    <p style="margin-top:0.75rem"><code>${errCode}</code></p>
  </div>
  <script>
    (function () {
      var err = ${JSON.stringify(errCode)};
      var origin = ${JSON.stringify(env.appUrl)};
      try {
        if (window.opener) {
          window.opener.postMessage({ type: "scale-scientist-oauth", error: err }, origin);
        }
      } catch (e) {}
      setTimeout(function () { try { window.close(); } catch (e) {} }, 1500);
    })();
  </script>
</body>
</html>`;
  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
