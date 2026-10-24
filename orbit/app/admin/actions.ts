"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email || user.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    redirect("/admin");
  }
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) redirect("/admin");
  return supabase;
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password || email !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    redirect("/admin?error=credentials");
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect("/admin?error=credentials");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email?.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    await supabase.auth.signOut();
    redirect("/admin?error=credentials");
  }
  const { data: admin } = await supabase.from("admin_users").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    redirect("/admin?error=not-authorized");
  }
  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin");
}

export async function saveSectionAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const pathway = String(formData.get("pathway") ?? "both");
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  const published = formData.get("published") === "on";
  const orbital = formData.get("orbital") === "on";
  if (!/^[a-z0-9-]{2,48}$/.test(id) || !title || !label || !description || !["both", "ai", "data"].includes(pathway) || !Number.isFinite(sortOrder)) {
    redirect("/admin/dashboard?error=section");
  }
  const { error } = await supabase.from("portfolio_sections").upsert({
    id, title, label, description, pathway, sort_order: sortOrder, published, orbital, updated_at: new Date().toISOString(),
  });
  if (error) redirect("/admin/dashboard?error=save");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard?saved=section");
}

export async function deleteSectionAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!/^[a-z0-9-]{2,48}$/.test(id)) redirect("/admin/dashboard?error=section");
  const { error } = await supabase.from("portfolio_sections").delete().eq("id", id);
  if (error) redirect("/admin/dashboard?error=delete");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard?saved=deleted");
}

export async function saveProjectAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "data");
  const href = String(formData.get("href") ?? "").trim();
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const sortOrder = Number(formData.get("sort_order") ?? 0);
  if (!/^[a-z0-9-]{2,64}$/.test(id) || !title || !description || !["ai", "data", "both"].includes(category) || !Number.isFinite(sortOrder)) {
    redirect("/admin/dashboard?error=project");
  }
  if (href && !/^https:\/\//i.test(href)) redirect("/admin/dashboard?error=project");
  const { error } = await supabase.from("portfolio_projects").upsert({
    id, title, description, category, href: href || null, featured, published, sort_order: sortOrder, updated_at: new Date().toISOString(),
  });
  if (error) redirect("/admin/dashboard?error=save");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard?saved=project");
}

export async function deleteProjectAction(formData: FormData) {
  const supabase = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!/^[a-z0-9-]{2,64}$/.test(id)) redirect("/admin/dashboard?error=project");
  const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
  if (error) redirect("/admin/dashboard?error=delete");
  revalidatePath("/admin/dashboard");
  revalidatePath("/");
  redirect("/admin/dashboard?saved=deleted");
}
