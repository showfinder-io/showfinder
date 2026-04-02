// Configuration des sources de scraping
// Chaque venue a son URL de calendrier et son parseur specifique

import * as cheerio from "cheerio";
import type { DiscoveredSalon, VenueSource } from "./types";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseDate(dateStr: string): string | null {
  // Essaie de parser des formats courants FR
  // "15 janvier 2026" → "2026-01-15"
  const months: Record<string, string> = {
    janvier: "01", février: "02", fevrier: "02", mars: "03",
    avril: "04", mai: "05", juin: "06", juillet: "07",
    août: "08", aout: "08", septembre: "09", octobre: "10",
    novembre: "11", décembre: "12", decembre: "12",
  };

  // Format: "15 janvier 2026" ou "15/01/2026"
  const frMatch = dateStr.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (frMatch) {
    const day = frMatch[1].padStart(2, "0");
    const month = months[frMatch[2].toLowerCase()];
    const year = frMatch[3];
    if (month) return `${year}-${month}-${day}`;
  }

  // Format: "15/01/2026" ou "2026-01-15"
  const numMatch = dateStr.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (numMatch) {
    return `${numMatch[3]}-${numMatch[2].padStart(2, "0")}-${numMatch[1].padStart(2, "0")}`;
  }

  const isoMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return isoMatch[0];

  return null;
}

// Parseur generique : cherche les evenements dans le HTML
// Structure commune : blocs avec nom, dates, lien
function genericParse(
  html: string,
  source: VenueSource,
  selector: string,
  nameSelector: string,
  dateSelector: string,
  linkSelector: string
): DiscoveredSalon[] {
  const $ = cheerio.load(html);
  const salons: DiscoveredSalon[] = [];

  $(selector).each((_, el) => {
    const name = $(el).find(nameSelector).text().trim();
    if (!name) return;

    const dateText = $(el).find(dateSelector).text().trim();
    const link = $(el).find(linkSelector).attr("href") ?? null;

    // Essayer d'extraire les dates
    const dates = dateText.match(/(\d{1,2})\s+\w+\s+\d{4}/g) ?? [];
    const startDate = dates[0] ? parseDate(dates[0]) : null;
    const endDate = dates[1] ? parseDate(dates[1]) : (dates[0] ? parseDate(dates[0]) : null);

    const year = startDate ? startDate.substring(0, 4) : new Date().getFullYear().toString();
    const slug = `${slugify(name)}-${source.city.toLowerCase()}-${year}`;

    salons.push({
      name,
      slug,
      start_date: startDate,
      end_date: endDate,
      venue_name: source.name,
      city: source.city,
      website_url: link && link.startsWith("http") ? link : null,
      source_url: source.calendar_url,
    });
  });

  return salons;
}

// Sources configurees
export const VENUE_SOURCES: VenueSource[] = [
  {
    name: "Paris Nord Villepinte",
    city: "Paris",
    calendar_url: "https://www.viparis.com/fr/nos-sites/paris-nord-villepinte",
    parse(html) {
      // Viparis utilise des cartes evenement
      return genericParse(
        html, this,
        ".event-card, .card-event, [class*='event'], article",
        "h2, h3, .title, .event-title, .card-title",
        ".date, .event-date, time, [class*='date']",
        "a[href]"
      );
    },
  },
  {
    name: "Paris Expo Porte de Versailles",
    city: "Paris",
    calendar_url: "https://www.viparis.com/fr/nos-sites/paris-expo-porte-de-versailles",
    parse(html) {
      return genericParse(
        html, this,
        ".event-card, .card-event, [class*='event'], article",
        "h2, h3, .title, .event-title, .card-title",
        ".date, .event-date, time, [class*='date']",
        "a[href]"
      );
    },
  },
  {
    name: "Eurexpo Lyon",
    city: "Lyon",
    calendar_url: "https://www.eurexpo.com/agenda",
    parse(html) {
      return genericParse(
        html, this,
        ".event-card, .card-event, [class*='event'], article, .agenda-item",
        "h2, h3, .title, .event-title",
        ".date, .event-date, time, [class*='date']",
        "a[href]"
      );
    },
  },
];
