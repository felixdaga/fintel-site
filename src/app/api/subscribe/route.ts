import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, number[]>();

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function tooMany(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function ok(already = false) {
  return NextResponse.json({ ok: true, already });
}

export async function POST(req: Request) {
  if (tooMany(clientIp(req))) {
    return NextResponse.json({ error: "Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { email, company } = body as { email?: unknown; company?: unknown };
  if (typeof company === "string" && company.trim()) return ok();

  if (typeof email !== "string") {
    return NextResponse.json({ error: "Enter an email." }, { status: 400 });
  }

  const trimmed = email.trim().toLowerCase();
  if (trimmed.length > 320 || !EMAIL_RE.test(trimmed)) {
    return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  }

  const key = process.env.LOOPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Subscriptions are not configured yet." },
      { status: 503 },
    );
  }

  const payload: Record<string, unknown> = {
    email: trimmed,
    source: "fintel-site",
    subscribed: true,
  };
  const listId = process.env.LOOPS_MAILING_LIST_ID?.trim();
  if (listId) payload.mailingLists = { [listId]: true };

  const res = await fetch("https://app.loops.so/api/v1/contacts/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (res.ok || res.status === 409) return ok(res.status === 409);

  return NextResponse.json(
    { error: "Could not subscribe. Try again." },
    { status: 502 },
  );
}
