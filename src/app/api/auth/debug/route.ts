import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

export async function GET(req: NextRequest) {
  const store = await cookies();
  const all = store.getAll();
  const session = store.get(SESSION_COOKIE);
  const headersOut: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headersOut[key] = value;
  });

  return NextResponse.json(
    {
      hasSessionCookie: !!session?.value,
      sessionCookieLength: session?.value?.length ?? 0,
      sessionCookiePreview: session?.value ? `${session.value.slice(0, 12)}…${session.value.slice(-4)}` : null,
      allCookieNames: all.map((c) => c.name),
      cookieHeaderRaw: req.headers.get("cookie"),
      requestHeaders: headersOut,
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
