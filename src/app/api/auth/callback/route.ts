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

  const res = NextResponse.redirect(`${env.appUrl}/dashboard`);
  res.cookies.set(SESSION_COOKIE, longLived, sessionCookieOptions);
  res.cookies.delete("fb_oauth_state");
  return res;
}
