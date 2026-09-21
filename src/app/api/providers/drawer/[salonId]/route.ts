import { NextResponse } from "next/server";
import { getProviderDrawerData } from "@/lib/queries";
import { getAllProviderHubs } from "@/lib/provider-hubs";
import { departmentFromPostalCode, parisDayIndex } from "@/lib/geo-fr";

/**
 * Données du drawer « Organiser mon stand » : tous les prestataires, le département du lieu du
 * salon (préfiltre de proximité) et les pages hub pour les liens « voir tous ». Le filtrage et la
 * rotation du jour se font côté client à partir de dayIndex : la réponse est identique pour tous
 * les visiteurs, donc mise en cache une heure.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ salonId: string }> }
) {
  const { salonId } = await params;

  try {
    const [{ providers, venuePostalCode }, hubs] = await Promise.all([
      getProviderDrawerData(salonId),
      getAllProviderHubs(),
    ]);
    return NextResponse.json(
      {
        providers,
        venueDepartment: departmentFromPostalCode(venuePostalCode),
        hubs: hubs.map((h) => ({ slug: h.slug, category: h.category, departments: h.departments })),
        dayIndex: parisDayIndex(),
      },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ providers: [], venueDepartment: null, hubs: [], dayIndex: 0 }, { status: 500 });
  }
}
