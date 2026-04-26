"use client";

import { useState } from "react";

export function FacebookLoginButton({
  authUrl = "/api/auth/facebook",
}: {
  authUrl?: string;
}) {
  const [state, setState] = useState<"idle" | "opening" | "exchanging" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleClick() {
    setState("opening");
    setErrorMsg(null);

    // Open Facebook OAuth in a popup window. We open it on a stub URL
    // first (about:blank) so the popup is created during the user's
    // click event — Brave/Safari block popups opened later in async
    // handlers. We then navigate the popup to the OAuth URL.
    const w = 600, h = 720;
    const x = window.screenX + (window.outerWidth - w) / 2;
    const y = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(
      "about:blank",
      "scale-scientist-oauth",
      `width=${w},height=${h},left=${x},top=${y}`
    );
    if (!popup) {
      setState("error");
      setErrorMsg("Popup was blocked. Please allow popups for this site and try again.");
      return;
    }
    popup.location.href = authUrl;

    // Listen for the popup to postMessage the access token back.
    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; token?: string; error?: string } | null;
      if (!data || data.type !== "scale-scientist-oauth") return;

      window.removeEventListener("message", onMessage);

      if (data.error) {
        setState("error");
        setErrorMsg(data.error);
        try { popup.close(); } catch {}
        return;
      }

      if (!data.token) {
        setState("error");
        setErrorMsg("No token returned from OAuth.");
        try { popup.close(); } catch {}
        return;
      }

      setState("exchanging");

      // POST the token to /api/auth/establish from THIS window. Because
      // this fetch is initiated by JS on a page with established user
      // interaction, the cookie set on the response is exempt from
      // bounce-tracking purges. This is the whole point of the popup
      // pattern.
      try {
        const body = new URLSearchParams({ token: data.token });
        const res = await fetch("/api/auth/establish", {
          method: "POST",
          body,
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`Establish failed: ${res.status}`);
        }
        try { popup.close(); } catch {}
        window.location.href = "/dashboard";
      } catch (e) {
        setState("error");
        setErrorMsg(e instanceof Error ? e.message : "Failed to finish sign-in");
        try { popup.close(); } catch {}
      }
    };

    window.addEventListener("message", onMessage);

    // If the user closes the popup without finishing, reset state.
    const closedCheck = setInterval(() => {
      if (popup.closed) {
        clearInterval(closedCheck);
        window.removeEventListener("message", onMessage);
        setState((s) => (s === "exchanging" ? s : "idle"));
      }
    }, 500);
  }

  const label =
    state === "opening" ? "Connecting…"
      : state === "exchanging" ? "Finishing sign-in…"
      : "Continue with Facebook";

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "opening" || state === "exchanging"}
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
      {errorMsg && (
        <p className="mt-3 text-sm text-red-700">{errorMsg}</p>
      )}
    </div>
  );
}
