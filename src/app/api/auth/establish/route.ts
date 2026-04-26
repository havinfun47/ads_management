import { NextRequest, NextResponse } from "next/server";

// Returns the Meta access token to the calling JS so the client can set
// the cookie via document.cookie. We tried setting via Set-Cookie
// response header but Brave silently drops the header on fetch responses
// in the post-OAuth chain. JS-set cookies on the same domain do persist,
// confirmed via /api/auth/cookie-test.
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get("token") ?? "");
  if (!token) {
    return NextResponse.json({ ok: false, error: "missing_token" }, { status: 400 });
  }

  console.log("[oauth-establish] returning token to client, length:", token.length);

  return NextResponse.json(
    { ok: true, token },
    { status: 200, headers: { "Cache-Control": "no-store" } }
  );
}
