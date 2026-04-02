// Types partagés pour le scraper

export type DiscoveredSalon = {
  name: string;
  slug: string;
  start_date: string | null;
  end_date: string | null;
  venue_name: string;
  city: string;
  website_url: string | null;
  source_url: string;
};

export type EnrichedSalon = DiscoveredSalon & {
  description: string | null;
  organizer_name: string | null;
  estimated_exhibitors: number | null;
  estimated_visitors: number | null;
  logo_url: string | null;
  cover_image_url: string | null;
  sectors: string[];
};

export type SyncResult = {
  created: string[];
  updated: string[];
  skipped_locked: string[];
  conflicts: Array<{
    slug: string;
    field: string;
    db_value: string | null;
    scraped_value: string | null;
  }>;
};

export type VenueSource = {
  name: string;
  city: string;
  calendar_url: string;
  parse: (html: string, source: VenueSource) => DiscoveredSalon[];
};
