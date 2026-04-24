import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LeadPayload {
  type: "booking" | "contact" | "job-application";
  name?: string;
  phone?: string;
  email?: string;
  zip?: string;
  city?: string;
  state?: string;
  when?: string;
  details?: string;
  hasLicense?: string;
  canLift?: string;
  availability?: string;
  about?: string;
  source?: string;
}

async function saveToSupabase(payload: LeadPayload) {
  const client = getSupabaseServer();
  if (!client) return { sent: false, reason: "Supabase not configured" };

  const { error } = await client.from("leads").insert({
    type: payload.type,
    name: payload.name ?? null,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    zip: payload.zip ?? null,
    city: payload.city ?? null,
    state: payload.state ?? null,
    when_needed: payload.when ?? null,
    details: payload.details ?? null,
    has_license: payload.hasLicense ?? null,
    can_lift: payload.canLift ?? null,
    availability: payload.availability ?? null,
    about: payload.about ?? null,
    source: payload.source ?? null,
  });

  if (error) return { sent: false, reason: `Supabase: ${error.message}` };
  return { sent: true };
}

async function sendViaResend(payload: LeadPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL || "thenyctowcompany@gmail.com";
  const from = process.env.LEAD_FROM_EMAIL || "hi@thenyctowingservice.com";

  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY not set" };

  const subject = `[${payload.type.toUpperCase()}] ${payload.name || "New lead"} — ${payload.city || payload.zip || ""}`;
  const lines = Object.entries(payload)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `<strong>${k}</strong>: ${String(v)}`)
    .join("<br/>");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html: `<h2>New ${payload.type} lead</h2><p>${lines}</p>`,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { sent: false, reason: `Resend ${res.status}: ${text}` };
  }
  return { sent: true };
}

async function sendToWebhook(payload: LeadPayload) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return { sent: false, reason: "LEAD_WEBHOOK_URL not set" };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return { sent: res.ok, reason: res.ok ? undefined : `Webhook ${res.status}` };
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;

    if (!payload.type || !payload.phone) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [supabaseResult, emailResult, webhookResult] = await Promise.all([
      saveToSupabase(payload),
      sendViaResend(payload),
      sendToWebhook(payload),
    ]);

    const delivered = supabaseResult.sent || emailResult.sent || webhookResult.sent;

    if (!delivered) {
      console.error("[lead] no delivery channel succeeded", {
        supabase: supabaseResult.reason,
        email: emailResult.reason,
        webhook: webhookResult.reason,
        payload: { ...payload, phone: payload.phone?.slice(0, 4) + "***" },
      });
    }

    return NextResponse.json({ success: true, delivered });
  } catch (error: unknown) {
    console.error("[lead] error", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
