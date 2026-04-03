import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("quotes")
    .select("id, company_name, email, provider_id, message, salon_name, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("Admin quotes GET:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }

  // Résoudre les noms des prestataires
  const quotes = data ?? [];
  const providerIds = [...new Set(quotes.map((q) => q.provider_id))];
  const nameMap: Record<string, string> = {};

  if (providerIds.length > 0) {
    const { data: providers } = await supabase
      .from("providers")
      .select("id, company_name")
      .in("id", providerIds);
    if (providers) {
      for (const p of providers) nameMap[p.id] = p.company_name;
    }
  }

  const enriched = quotes.map((q) => ({
    ...q,
    provider_name: nameMap[q.provider_id] ?? null,
  }));

  return NextResponse.json({ quotes: enriched });
}
