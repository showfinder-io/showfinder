import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const supabase = await createClient();

  const [
    salonsAll,
    salonsPublished,
    salonsDraft,
    prestataires,
    venues,
    reportsPending,
    devisPending,
    avis,
    alertesActives,
  ] = await Promise.all([
    supabase.from("salons").select("id", { count: "exact", head: true }),
    supabase.from("salons").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("salons").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("providers").select("id", { count: "exact", head: true }),
    supabase.from("venues").select("id", { count: "exact", head: true }),
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("quotes").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("reviews").select("id", { count: "exact", head: true }),
    supabase.from("alerts").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return NextResponse.json({
    salonsTotal: salonsAll.count ?? 0,
    salonsPublished: salonsPublished.count ?? 0,
    salonsDraft: salonsDraft.count ?? 0,
    prestataires: prestataires.count ?? 0,
    venues: venues.count ?? 0,
    reportsPending: reportsPending.count ?? 0,
    devisPending: devisPending.count ?? 0,
    avis: avis.count ?? 0,
    alertesActives: alertesActives.count ?? 0,
  });
}
