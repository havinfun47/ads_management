import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

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

  // Exchange code for short-lived access token
  const tokenUrl = new URL(`https://graph.facebook.com/${env.graphApiVersion}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", env.facebookAppId);
  tokenUrl.searchParams.set("client_secret", env.facebookAppSecret);
  tokenUrl.searchParams.set("redirect_uri", `${env.appUrl}/api/auth/callback`);
  tokenUrl.searchParams.set("code", code);

  const tokenRes = await fetch(tokenUrl, { cache: "no-store" });
  if (!tokenRes.ok) {
    return NextResponse.redirect(`${env.appUrl}/login?error=token_exchange_failed`);
  }

  // TODO: persist token, create session, upsert user.
  // For now we just bounce to the dashboard so the review flow is navigable.
  const res = NextResponse.redirect(`${env.appUrl}/dashboard`);
  res.cookies.delete("fb_oauth_state");
  return res;
}
