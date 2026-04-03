import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("id, target_type, target_id, rating, title, body, is_verified, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Admin reviews GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  // Résoudre les noms des cibles
  const reviews = data ?? [];
  const salonIds = reviews.filter((r) => r.target_type === "salon").map((r) => r.target_id);
  const providerIds = reviews.filter((r) => r.target_type === "provider").map((r) => r.target_id);

  const nameMap: Record<string, string> = {};

  if (salonIds.length > 0) {
    const { data: salons } = await supabase
      .from("salons")
      .select("id, name")
      .in("id", salonIds);
    if (salons) {
      for (const s of salons) nameMap[s.id] = s.name;
    }
  }

  if (providerIds.length > 0) {
    const { data: providers } = await supabase
      .from("providers")
      .select("id, company_name")
      .in("id", providerIds);
    if (providers) {
      for (const p of providers) nameMap[p.id] = p.company_name;
    }
  }

  const enriched = reviews.map((r) => ({
    ...r,
    target_name: nameMap[r.target_id] ?? null,
  }));

  return NextResponse.json({ reviews: enriched });
}
