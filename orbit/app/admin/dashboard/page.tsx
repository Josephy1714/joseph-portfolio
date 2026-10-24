import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deleteProjectAction, deleteSectionAction, logoutAction, saveProjectAction, saveSectionAction } from "../actions";
import "./admin.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Private workspace", robots: { index: false, follow: false, noarchive: true, nosnippet: true } };

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const supabase = await createSupabaseServerClient().catch(() => null);
  if (!supabase) redirect("/admin?error=setup");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email || user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) redirect("/admin");
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin?error=not-authorized");

  const [sectionResult, projectResult, params] = await Promise.all([
    supabase.from("portfolio_sections").select("*").order("sort_order"),
    supabase.from("portfolio_projects").select("*").order("sort_order"),
    searchParams,
  ]);
  const sections = sectionResult.data ?? [];
  const projects = projectResult.data ?? [];
  const issue = params.error ? "Action failed. Check the fields and database setup." : null;
  return (
    <main className="admin-dashboard-shell">
      <header className="admin-dash-top">
        <a className="admin-brand" href="/"><span className="admin-brand-mark">◈</span> ORBIT <span>/ OWNER CONSOLE</span></a>
        <div className="admin-owner"><span className="admin-online" /> OWNER SESSION <span className="admin-owner-email">{user.email}</span></div>
        <form action={logoutAction}><button className="admin-logout">Sign out ↗</button></form>
      </header>
      <div className="admin-dash-main">
        <aside className="admin-sidebar"><p className="admin-eyebrow">CONTROL PLANE</p><a className="admin-nav active" href="#overview">Overview</a><a className="admin-nav" href="#sections">Pages & sections</a><a className="admin-nav" href="#projects">Projects</a><a className="admin-nav" href="#security">Security</a><div className="admin-side-foot">DRAFT → PREVIEW → PUBLISH</div></aside>
        <section className="admin-workspace">
          <div className="admin-heading-row"><div><p className="admin-eyebrow">PRIVATE / CONTENT MANAGEMENT</p><h1>Command center<span>.</span></h1><p>Manage the portfolio without editing code. Changes are stored as content records; publication is controlled separately.</p></div><a href="/" className="admin-preview-link" target="_blank">View public site ↗</a></div>
          {params.saved && <p className="admin-success" role="status">Saved successfully. Review the public site before considering content published.</p>}
          {issue && <p className="admin-error" role="alert">{issue}</p>}
          <div id="overview" className="admin-stat-grid"><article><span>CONTENT SECTIONS</span><strong>{sections.length}</strong><small>Pages and orbital destinations</small></article><article><span>PROJECT RECORDS</span><strong>{projects.length}</strong><small>Case studies and featured work</small></article><article><span>SESSION</span><strong className="admin-session-state">VERIFIED</strong><small>Authenticated owner only</small></article></div>
          <section id="sections" className="admin-module"><div className="admin-module-head"><div><p className="admin-eyebrow">01 / NAVIGATION & CONTENT</p><h2>Pages & sections</h2><p>Add sections, edit content, reorder and control publication and sphere visibility.</p></div><span className="admin-count">{sections.length} RECORDS</span></div>
            <form action={saveSectionAction} className="admin-editor"><h3>Create or edit a section</h3><div className="admin-field-grid"><label>Section ID <input name="id" placeholder="e.g. publications" pattern="[a-z0-9-]{2,48}" required /></label><label>Orbital label <input name="label" placeholder="Publications" maxLength={48} required /></label><label className="field-wide">Title <input name="title" placeholder="Research & publications" maxLength={140} required /></label><label className="field-wide">Description <textarea name="description" placeholder="What visitors should know..." rows={3} required /></label><label>Pathway <select name="pathway" defaultValue="both"><option value="both">Both</option><option value="ai">AI Work</option><option value="data">Data Science</option></select></label><label>Display order <input name="sort_order" type="number" defaultValue={0} /></label><label className="admin-check"><input name="published" type="checkbox" /> Published</label><label className="admin-check"><input name="orbital" type="checkbox" defaultChecked /> Show as sphere node</label></div><button className="admin-primary" type="submit">Save section ↗</button><p className="admin-hint">Use the existing ID to edit a record. A new ID creates a new section. IDs are lowercase letters, numbers and hyphens.</p></form>
            <div className="admin-record-list">{sections.map((s: any) => <article className="admin-record" key={s.id}><div className="admin-record-icon">◈</div><div className="admin-record-copy"><strong>{s.label} <span>/{s.id}</span></strong><p>{s.title}</p><small>Order {s.sort_order} · {s.pathway} · {s.published ? "Published" : "Draft"} · {s.orbital ? "Orbital node" : "No sphere node"}</small></div><form action={deleteSectionAction}><input type="hidden" name="id" value={s.id} /><button className="admin-danger" type="submit">Delete</button></form></article>)}</div>
          </section>
          <section id="projects" className="admin-module"><div className="admin-module-head"><div><p className="admin-eyebrow">02 / SELECTED WORK</p><h2>Project library</h2><p>Maintain case studies, project links, featured state, and draft/publication status.</p></div><span className="admin-count">{projects.length} RECORDS</span></div>
            <form action={saveProjectAction} className="admin-editor"><h3>Create or edit a project</h3><div className="admin-field-grid"><label>Project ID <input name="id" placeholder="e.g. anomaly-detection" pattern="[a-z0-9-]{2,64}" required /></label><label>Title <input name="title" maxLength={140} required /></label><label className="field-wide">Description <textarea name="description" rows={3} required /></label><label>Pathway <select name="category" defaultValue="data"><option value="data">Data Science</option><option value="ai">AI Work</option><option value="both">Both</option></select></label><label>Display order <input name="sort_order" type="number" defaultValue={0} /></label><label className="field-wide">Project URL (HTTPS only) <input name="href" type="url" placeholder="https://github.com/..." /></label><label className="admin-check"><input name="featured" type="checkbox" /> Featured</label><label className="admin-check"><input name="published" type="checkbox" /> Published</label></div><button className="admin-primary" type="submit">Save project ↗</button><p className="admin-hint">Only publish claims, links and metrics you have verified.</p></form>
            <div className="admin-record-list">{projects.map((p: any) => <article className="admin-record" key={p.id}><div className="admin-record-icon">↗</div><div className="admin-record-copy"><strong>{p.title} <span>/{p.id}</span></strong><p>{p.description}</p><small>{p.category} · Order {p.sort_order} · {p.featured ? "Featured" : "Standard"} · {p.published ? "Published" : "Draft"}</small></div><form action={deleteProjectAction}><input type="hidden" name="id" value={p.id} /><button className="admin-danger" type="submit">Delete</button></form></article>)}</div>
          </section>
          <section id="security" className="admin-module security-module"><p className="admin-eyebrow">03 / SECURITY POSTURE</p><h2>Private by design.</h2><ul><li>Admin route is not linked from public navigation and is marked no-index.</li><li>Login is restricted to the configured owner email and an explicitly allowlisted auth user.</li><li>Every write action re-checks the authenticated user and allowlist; database row-level security is also required.</li><li>No public sign-up flow exists. Do not add service-role secrets to browser code.</li><li>Content rows marked draft must not be exposed through public reads.</li></ul><p className="admin-hint">Before launch: configure Supabase, apply the schema, create the owner auth user, add that user's UUID to admin_users, and set server environment variables. Test authorization and RLS before publishing.</p></section>
          <footer className="admin-footer">ORBIT OWNER CONSOLE <span>·</span> PRIVATE SESSION <span>·</span> CONTENT CHANGES REQUIRE REVIEW</footer>
        </section>
      </div>
    </main>
  );
}
