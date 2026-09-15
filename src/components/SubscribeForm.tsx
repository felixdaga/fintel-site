"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "sending" | "ok" | "already" | "error";

export function SubscribeForm({
  title = "Subscribe for new eval insights",
}: {
  title?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "");

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        already?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error ?? "Could not subscribe.");
        return;
      }
      form.reset();
      setStatus(json.already ? "already" : "ok");
      setMessage(
        json.already ? "You're already on the list." : "You're on the list.",
      );
    } catch {
      setStatus("error");
      setMessage("Could not subscribe.");
    }
  }

  const done = status === "ok" || status === "already";

  return (
    <form
      onSubmit={onSubmit}
      className="relative mx-auto w-full max-w-xl rounded-2xl border border-border bg-surface-2/40 px-6 py-8 text-center sm:px-10 sm:py-10"
    >
      <h2 className="font-semibold tracking-tight text-text text-xl sm:text-2xl">
        {title}
      </h2>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-2">
        <label className="sr-only" htmlFor="subscribe-email">
          Email
        </label>
        <input
          id="subscribe-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@firm.com"
          disabled={status === "sending"}
          className="min-w-0 flex-1 rounded-md border border-border bg-surface px-4 py-3 text-base text-text placeholder:text-text-muted/70 focus:border-accent focus:outline-none"
        />
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 rounded-md bg-accent px-6 py-3 text-base font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "…" : "subscribe"}
        </button>
      </div>
      <p
        className={`mt-3 text-sm ${
          status === "error" ? "text-negative" : "text-text-muted"
        }`}
        aria-live="polite"
      >
        {message || "We'll email you when we publish."}
      </p>
      {done ? <span className="sr-only">Subscribed</span> : null}
    </form>
  );
}
