import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import type { Database } from "@/types/database";
import type { ProviderRow } from "@/lib/queries";

export type ProviderHubRow = Database["public"]["Tables"]["provider_hubs"]["Row"];

type ProviderCategory = Database["public"]["Enums"]["provider_category"];

/**
 * Pages hub métier x zone (/prestataires/standistes-paris). Elles partagent l'espace d'URL des
 * fiches prestataires : la page [slug] cherche d'abord un hub, puis un prestataire.
 */
export async function getProviderHubBySlug(slug: string): Promise<ProviderHubRow | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("provider_hubs").select("*").eq("slug", slug).maybeSingle();
  return data ?? null;
}

export async function getAllProviderHubs(): Promise<ProviderHubRow[]> {
  const supabase = createStaticClient();
  const { data } = await supabase.from("provider_hubs").select("*").order("slug");
  return data ?? [];
}

/** Prestataires d'un hub : même catégorie, siège dans un des départements (tous si hub national). */
export async function getProvidersForHub(hub: Pick<ProviderHubRow, "category" | "departments">): Promise<ProviderRow[]> {
  const supabase = createStaticClient();
  let query = supabase
    .from("providers")
    .select("*")
    .eq("category", hub.category)
    .order("subscription_tier", { ascending: false })
    .order("is_verified", { ascending: false })
    .order("company_name");
  if (hub.departments.length > 0) query = query.in("department", hub.departments);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProviderRow[];
}

/** Un hub n'est indexable (robots + sitemap) qu'avec son contenu éditorial et assez de prestataires. */
export function isHubIndexable(hub: ProviderHubRow, providerCount: number): boolean {
  return Boolean(hub.editorial_mdx?.trim()) && providerCount >= hub.min_providers;
}

/** Hubs qui listent ce prestataire (maillage fiche vers hub) : le plus local d'abord. */
export async function getHubsForProvider(category: string, department: string | null): Promise<ProviderHubRow[]> {
  const supabase = createStaticClient();
  const { data } = await supabase.from("provider_hubs").select("*").eq("category", category as ProviderCategory);
  return (data ?? [])
    .filter((h) => h.departments.length === 0 || (department !== null && h.departments.includes(department)))
    .sort((a, b) => Number(a.departments.length === 0) - Number(b.departments.length === 0) || a.slug.localeCompare(b.slug));
}
