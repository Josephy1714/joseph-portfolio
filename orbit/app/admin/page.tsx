import type { Metadata } from "next";
import { loginAction } from "./actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import "./admin.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Private workspace",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient().catch(() => null);
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()) {
      const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
      if (admin) redirect("/admin/dashboard");
    }
  }
  const message = params.error === "not-authorized"
    ? "This account is not authorised for the workspace."
    : params.error === "setup"
      ? "The private workspace is not configured yet. Please try again after setup."
      : "Sign-in failed. Check your credentials and try again.";
  return (
    <main className="admin-auth-shell">
      <section className="admin-auth-card">
        <a className="admin-brand" href="/"><span className="admin-brand-mark">◈</span> ORBIT <span>/ PRIVATE WORKSPACE</span></a>
        <div className="admin-lock">⌑</div>
        <p className="admin-eyebrow">RESTRICTED ACCESS · OWNER ONLY</p>
        <h1>Sign in privately.</h1>
        <p className="admin-lede">This workspace is not publicly registered. Access is limited to the authorised owner account.</p>
        {params.error && <p className="admin-error" role="alert">{message}</p>}
        <form action={loginAction} className="admin-login-form">
          <label htmlFor="email">Owner email</label>
          <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} />
          <button type="submit">Authenticate <span>↗</span></button>
        </form>
        <p className="admin-security-note">Protected by server-side authentication and database access policies. No public sign-up.</p>
        <a className="admin-return" href="/">← Return to public experience</a>
      </section>
    </main>
  );
}
