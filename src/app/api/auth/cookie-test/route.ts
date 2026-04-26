import { NextRequest, NextResponse } from "next/server";

// Pure cookie-setting test, completely independent of OAuth.
// Sets multiple test cookies with different attribute combinations
// and renders an HTML page that shows what document.cookie sees,
// so we can isolate whether the browser is rejecting our cookies in
// general (Brave shields/settings issue) vs only in the OAuth flow
// (bounce tracking).
export async function GET(req: NextRequest) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Cookie test</title>
  <style>
    body { font-family: ui-monospace, monospace; padding: 2rem; max-width: 48rem; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 1.25rem; margin-bottom: 1rem; }
    .row { background: #F5F3EE; padding: 0.75rem 1rem; border-radius: 6px; margin: 0.5rem 0; word-break: break-all; }
    .label { font-weight: 600; color: #2D5C3F; }
    button, a { display: inline-block; background: #1C1C1A; color: #F5F3EE; padding: 0.5rem 1rem; border-radius: 6px; text-decoration: none; border: 0; cursor: pointer; margin-right: 0.5rem; margin-top: 1rem; font: inherit; }
  </style>
</head>
<body>
  <h1>Cookie Test</h1>

  <p>This endpoint set 4 test cookies via Set-Cookie response header. The page also tries to set 1 cookie via JavaScript. Below shows what your browser actually accepted.</p>

  <h2 style="font-size:1rem;margin-top:1.5rem">Server set (via Set-Cookie header):</h2>
  <div class="row"><span class="label">test_lax</span> — Path=/; HttpOnly; Secure; SameSite=Lax</div>
  <div class="row"><span class="label">test_strict</span> — Path=/; HttpOnly; Secure; SameSite=Strict</div>
  <div class="row"><span class="label">test_no_secure</span> — Path=/; HttpOnly; SameSite=Lax (no Secure)</div>
  <div class="row"><span class="label">test_short</span> — small value, Path=/; SameSite=Lax (NO HttpOnly so JS can see it)</div>

  <h2 style="font-size:1rem;margin-top:1.5rem">JS-set cookie (document.cookie):</h2>
  <script>document.cookie = "js_set=js_value_" + Date.now() + "; path=/; SameSite=Lax";</script>
  <div class="row" id="js_check">Checking...</div>

  <h2 style="font-size:1rem;margin-top:1.5rem">document.cookie (what JS can see):</h2>
  <div class="row" id="docCookie">Loading...</div>

  <p style="margin-top:1.5rem">Now check what the SERVER sees:</p>
  <a href="/api/auth/debug">Visit /api/auth/debug →</a>

  <script>
    document.getElementById('docCookie').textContent = document.cookie || '(empty — no cookies visible to JS)';
    document.getElementById('js_check').textContent = document.cookie.includes('js_set') ? 'js_set IS readable' : 'js_set NOT readable (JS cookies blocked)';
  </script>
</body>
</html>`;

  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
  });

  // Set 4 test cookies with different attribute combinations
  headers.append("Set-Cookie", "test_lax=value_lax; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600");
  headers.append("Set-Cookie", "test_strict=value_strict; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600");
  headers.append("Set-Cookie", "test_no_secure=value_no_secure; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600");
  headers.append("Set-Cookie", "test_short=hi; Path=/; SameSite=Lax; Max-Age=3600");

  return new NextResponse(html, { status: 200, headers });
}
