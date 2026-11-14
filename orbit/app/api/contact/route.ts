import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (typeof body.website === "string" && body.website.trim()) return NextResponse.json({ ok: true }, { status: 200 });
    const fields = ["name","email","company","role","subject","message"] as const;
    const values = Object.fromEntries(fields.map(key => [key, typeof body[key] === "string" ? body[key].trim() : ""]));
    const { name, email, company, role, subject, message } = values;
    if (name.length < 2 || name.length > 100 || email.length < 5 || email.length > 254 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email) || company.length > 120 || role.length > 120 || subject.length < 3 || subject.length > 160 || message.length < 10 || message.length > 5000) {
      return NextResponse.json({ error: "Please check the form fields and try again." }, { status: 400 });
    }
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex");
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.rpc("submit_contact_message", {
      p_name: name, p_email: email, p_company: company, p_role: role, p_subject: subject, p_message: message, p_ip_hash: ipHash,
    });
    if (error) {
      const limited = error.message.toLowerCase().includes("rate limit");
      return NextResponse.json({ error: limited ? "Please wait before sending another message." : "The contact service is temporarily unavailable." }, { status: limited ? 429 : 503 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "The contact service is temporarily unavailable." }, { status: 503 });
  }
}
