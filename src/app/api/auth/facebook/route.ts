import { NextResponse } from "next/server";
import { env, metaScopes } from "@/lib/env";

export function GET() {
  if (!env.facebookAppId) {
    return NextResponse.redirect(
      `${env.appUrl}/login?error=missing_app_id`,
      { status: 302 }
    );
  }

  const redirectUri = `${env.appUrl}/api/auth/callback`;
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: env.facebookAppId,
    redirect_uri: redirectUri,
    state,
    scope: metaScopes.join(","),
    response_type: "code",
    auth_type: "rerequest",
  });

  const url = `https://www.facebook.com/${env.graphApiVersion}/dialog/oauth?${params.toString()}`;

  const res = NextResponse.redirect(url, { status: 302 });
  res.cookies.set("fb_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
