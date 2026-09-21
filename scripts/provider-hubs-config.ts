/**
 * Définition des pages hub prestataires v1 (métier x zone), partagée par
 * diag-provider-hubs-dossiers.ts et diag-provider-hubs-apply.ts. Requêtes cibles et volumes :
 * phase 0 DataForSEO du 2026-09-21 (recherches mensuelles France).
 * Hubs locaux limités aux zones qui atteignent le seuil de 5 prestataires (Paris, Lyon).
 */
const IDF = ["75", "77", "78", "91", "92", "93", "94", "95"];
const LYON = ["69", "01", "38", "42"];

export const HUBS = [
  { slug: "standistes", category: "standiste", departments: [] as string[], zone_label: null, zone_label_en: null,
    queries: [["standiste", 720], ["stand sur mesure", 320], ["concepteur de stand", 170], ["location stand", 170], ["fabricant de stand", 110], ["standiste france", 70]] },
  { slug: "standistes-paris", category: "standiste", departments: IDF, zone_label: "Paris et Île-de-France", zone_label_en: "Paris and Île-de-France",
    queries: [["standiste paris", 390]] },
  { slug: "standistes-lyon", category: "standiste", departments: LYON, zone_label: "Lyon et sa région", zone_label_en: "Lyon and its region",
    queries: [["standiste lyon", 210]] },
  { slug: "location-mobilier-evenementiel", category: "location_mobilier", departments: [] as string[], zone_label: null, zone_label_en: null,
    queries: [["location mobilier événementiel", 590], ["location de mobilier événementiel", 140], ["mobilier événementiel", 140], ["location mobilier événementiel paris", 110]] },
  { slug: "prestataires-audiovisuel-paris", category: "av_technique", departments: IDF, zone_label: "Paris et Île-de-France", zone_label_en: "Paris and Île-de-France",
    queries: [["location matériel audiovisuel", 480], ["location matériel audiovisuel paris", 210], ["prestataire audiovisuel", 170], ["prestataire audiovisuel paris", 140]] },
] as const;
