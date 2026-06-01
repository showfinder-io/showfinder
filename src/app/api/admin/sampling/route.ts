// API admin : sampling editorial 5 fiches aleatoires
// (brief Nicolas V5 : "Sampling 1x/semaine, 5 fiches tirees aleatoirement
// pour validation. Ne pas proposer la meme fiche dans les 6 mois").

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6;

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const supabase = await createClient();

  // Eligibles : fiches jamais vérifiées OU dernière vérification > 6 mois.
  const sixMonthsAgo = new Date(Date.now() - SIX_MONTHS_MS).toISOString();

  // Sampling cible UNIQUEMENT les fiches éditorialisées (editorial_mdx
  // present). Les fiches stub (minimal DB only) n'ont pas besoin de
  // relecture humaine périodique. Critère + last_human_check_at NULL
  // ou > 6 mois.
  const { data, error } = await supabase
    .from("salons")
    .select(
      "id, slug, name, status, start_date, end_date, city, venue, organizer_name, last_human_check_at, last_ia_update_at, alert_flag, locked_fields"
    )
    .not("editorial_mdx", "is", null)
    .or(
      `last_human_check_at.is.null,last_human_check_at.lt.${sixMonthsAgo}`
    )
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Shuffle + take 5 (Postgres ORDER BY random() coûte cher sur grandes tables,
  // donc on récupère 50 candidats et on shuffle côté serveur).
  const shuffled = [...(data ?? [])].sort(() => Math.random() - 0.5);
  const sample = shuffled.slice(0, 5);

  return NextResponse.json({
    sample,
    eligible_count: data?.length ?? 0,
  });
}
