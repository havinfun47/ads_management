"use client";

import { useEffect, useState } from "react";
import { buildClientSetCookie } from "@/lib/session-shared";

type Status =
  | { kind: "idle" }
  | { kind: "opening" }
  | { kind: "popup_opened" }
  | { kind: "received_message"; data: unknown }
  | { kind: "fetching" }
  | { kind: "establish_response"; status: number; setCookieHeader: string | null; ok: boolean }
  | { kind: "navigating" }
  | { kind: "error"; message: string };

export function FacebookLoginButton({
  authUrl = "/api/auth/facebook",
}: {
  authUrl?: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [log, setLog] = useState<string[]>([]);

  function pushLog(line: string) {
    const stamped = `[${new Date().toISOString().slice(11, 23)}] ${line}`;
    console.log("[oauth]", line);
    setLog((prev) => [...prev, stamped]);
  }

  useEffect(() => {
    if (typeof document !== "undefined") {
      pushLog(`document.cookie at mount: "${document.cookie}"`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleClick() {
    setStatus({ kind: "opening" });
    pushLog("Click. Opening popup at about:blank");

    const w = 600, h = 720;
    const x = window.screenX + (window.outerWidth - w) / 2;
    const y = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      "about:blank",
      "scale-scientist-oauth",
      `width=${w},height=${h},left=${x},top=${y}`
    );
    if (!popup) {
      pushLog("ERROR: popup is null (blocked)");
      setStatus({ kind: "error", message: "Popup was blocked. Please allow popups for this site and try again." });
      return;
    }
    pushLog(`Popup opened. Navigating to ${authUrl}`);
    popup.location.href = authUrl;
    setStatus({ kind: "popup_opened" });

    const onMessage = async (event: MessageEvent) => {
      pushLog(`window 'message' received from origin=${event.origin}`);
      if (event.origin !== window.location.origin) {
        pushLog(`  origin mismatch (expected ${window.location.origin}). Ignoring.`);
        return;
      }
      const data = event.data as { type?: string; token?: string; error?: string } | null;
      pushLog(`  data.type="${data?.type}", hasToken=${!!data?.token}, hasError=${!!data?.error}`);
      if (!data || data.type !== "scale-scientist-oauth") return;

      window.removeEventListener("message", onMessage);
      setStatus({ kind: "received_message", data });

      if (data.error) {
        pushLog(`Popup reported error: ${data.error}`);
        setStatus({ kind: "error", message: `OAuth error: ${data.error}` });
        try { popup.close(); } catch {}
        return;
      }

      if (!data.token) {
        pushLog("ERROR: no token in message");
        setStatus({ kind: "error", message: "No token returned from OAuth." });
        try { popup.close(); } catch {}
        return;
      }

      pushLog(`Token received, length=${data.token.length}. Calling fetch /api/auth/establish`);
      setStatus({ kind: "fetching" });

      try {
        const body = new URLSearchParams({ token: data.token });
        const res = await fetch("/api/auth/establish", {
          method: "POST",
          body,
          credentials: "same-origin",
        });
        pushLog(`fetch returned: status=${res.status} ok=${res.ok}`);
        if (!res.ok) {
          throw new Error(`Establish failed: ${res.status}`);
        }
        const json = (await res.json()) as { ok: boolean; token?: string; error?: string };
        if (!json.ok || !json.token) {
          throw new Error(json.error ?? "Establish returned no token");
        }
        pushLog(`Got token from /api/auth/establish (length ${json.token.length})`);

        // Set the session cookie via document.cookie. Server-set
        // cookies on this fetch are silently dropped by Brave; JS-set
        // cookies persist normally on this domain (confirmed via
        // /api/auth/cookie-test).
        const cookieStr = buildClientSetCookie(json.token);
        document.cookie = cookieStr;
        pushLog(`Set cookie via document.cookie. document.cookie now: "${document.cookie.slice(0, 80)}…"`);

        try { popup.close(); } catch {}

        pushLog("Navigating to /dashboard…");
        setStatus({ kind: "navigating" });
        window.location.href = "/dashboard";
      } catch (e) {
        pushLog(`fetch error: ${e instanceof Error ? e.message : String(e)}`);
        setStatus({ kind: "error", message: e instanceof Error ? e.message : "Failed to finish sign-in" });
        try { popup.close(); } catch {}
      }
    };

    window.addEventListener("message", onMessage);
    pushLog("Listening for message from popup...");

    const closedCheck = setInterval(() => {
      if (popup.closed) {
        clearInterval(closedCheck);
        pushLog("Popup closed (poll detected).");
        window.removeEventListener("message", onMessage);
      }
    }, 500);
  }

  const label =
    status.kind === "idle" ? "Continue with Facebook"
      : status.kind === "opening" ? "Opening popup…"
      : status.kind === "popup_opened" ? "Waiting on Facebook…"
      : status.kind === "received_message" ? "Got token, exchanging…"
      : status.kind === "fetching" ? "Setting session…"
      : status.kind === "establish_response" ? `Got ${status.status}…`
      : status.kind === "navigating" ? "Loading dashboard…"
      : "Continue with Facebook";

  const disabled = status.kind !== "idle" && status.kind !== "error";

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#1877F2] hover:bg-[#166fe0] disabled:opacity-70 disabled:cursor-progress text-white h-12 px-6 font-medium text-[15px] transition-all active:scale-[0.99] shadow-[0_2px_6px_rgba(24,119,242,0.25)]"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
          <path
            fill="currentColor"
            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
          />
        </svg>
        {label}
      </button>
      {status.kind === "error" && (
        <p className="mt-3 text-sm text-red-700">{status.message}</p>
      )}
      {log.length > 0 && (
        <div className="mt-4 rounded-lg border border-line bg-cream-muted p-3">
          <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wider mb-2">Diagnostic log</p>
          <pre className="text-[11px] leading-relaxed text-ink whitespace-pre-wrap font-mono">{log.join("\n")}</pre>
        </div>
      )}
    </div>
  );
}
