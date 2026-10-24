import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const [sectionResult, projectResult] = await Promise.all([
      supabase.from("portfolio_sections").select("id,label,title,description,pathway,sort_order,orbital").eq("published", true).order("sort_order"),
      supabase.from("portfolio_projects").select("id,title,description,category,href,featured,sort_order").eq("published", true).order("sort_order"),
    ]);
    if (sectionResult.error || projectResult.error) {
      return NextResponse.json({ sections: [], projects: [], source: "fallback" }, { status: 200, headers: { "Cache-Control": "no-store" } });
    }
    const sections = (sectionResult.data ?? [])
      .filter(section => section.orbital || section.id === "projects")
      .map(section => ({ ...section, eyebrow: `${String(section.sort_order + 1).padStart(2, "0")} / ${section.label.toUpperCase()}` }));
    const projects = (projectResult.data ?? []).map(project => ({
      title: project.title,
      type: project.category.toUpperCase(),
      status: project.featured ? "FEATURED CASE STUDY" : "PUBLISHED CASE STUDY",
      description: project.description,
      tags: [] as string[],
      href: project.href ?? "#",
    }));
    return NextResponse.json({ sections, projects, source: "database" }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ sections: [], projects: [], source: "fallback" }, { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}
