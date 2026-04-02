export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      provider_venues: {
        Row: {
          provider_id: string
          venue_id: string
        }
        Insert: {
          provider_id: string
          venue_id: string
        }
        Update: {
          provider_id?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_venues_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_venues_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          avg_rating: number
          category: Database["public"]["Enums"]["provider_category"]
          city: string | null
          company_name: string
          coverage_radius_km: number | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          is_verified: boolean
          logo_url: string | null
          phone: string | null
          review_count: number
          slug: string
          subscription_tier: Database["public"]["Enums"]["provider_tier"]
          updated_at: string
          website_url: string | null
          zone_intervention: string | null
        }
        Insert: {
          avg_rating?: number
          category: Database["public"]["Enums"]["provider_category"]
          city?: string | null
          company_name: string
          coverage_radius_km?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean
          logo_url?: string | null
          phone?: string | null
          review_count?: number
          slug: string
          subscription_tier?: Database["public"]["Enums"]["provider_tier"]
          updated_at?: string
          website_url?: string | null
          zone_intervention?: string | null
        }
        Update: {
          avg_rating?: number
          category?: Database["public"]["Enums"]["provider_category"]
          city?: string | null
          company_name?: string
          coverage_radius_km?: number | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          is_verified?: boolean
          logo_url?: string | null
          phone?: string | null
          review_count?: number
          slug?: string
          subscription_tier?: Database["public"]["Enums"]["provider_tier"]
          updated_at?: string
          website_url?: string | null
          zone_intervention?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          company_name: string
          created_at: string
          email: string
          id: string
          message: string
          provider_id: string
          salon_name: string | null
          status: string
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          id?: string
          message: string
          provider_id: string
          salon_name?: string | null
          status?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          provider_id?: string
          salon_name?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          correction: string
          created_at: string
          field: string
          id: string
          reporter_email: string | null
          salon_slug: string
          status: string
        }
        Insert: {
          correction: string
          created_at?: string
          field: string
          id?: string
          reporter_email?: string | null
          salon_slug: string
          status?: string
        }
        Update: {
          correction?: string
          created_at?: string
          field?: string
          id?: string
          reporter_email?: string | null
          salon_slug?: string
          status?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_verified: boolean
          rating: number
          role: Database["public"]["Enums"]["review_role"] | null
          target_id: string
          target_type: Database["public"]["Enums"]["review_target_type"]
          title: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          rating: number
          role?: Database["public"]["Enums"]["review_role"] | null
          target_id: string
          target_type: Database["public"]["Enums"]["review_target_type"]
          title?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_verified?: boolean
          rating?: number
          role?: Database["public"]["Enums"]["review_role"] | null
          target_id?: string
          target_type?: Database["public"]["Enums"]["review_target_type"]
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      salon_providers: {
        Row: {
          is_featured: boolean
          provider_id: string
          salon_id: string
        }
        Insert: {
          is_featured?: boolean
          provider_id: string
          salon_id: string
        }
        Update: {
          is_featured?: boolean
          provider_id?: string
          salon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_providers_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_providers_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_providers_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "upcoming_salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_sectors: {
        Row: {
          salon_id: string
          sector_id: string
        }
        Insert: {
          salon_id: string
          sector_id: string
        }
        Update: {
          salon_id?: string
          sector_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_sectors_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_sectors_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "upcoming_salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_sectors_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      salon_tags: {
        Row: {
          category: Database["public"]["Enums"]["tag_category"] | null
          color: string | null
          created_at: string
          id: string
          label: string
          salon_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["tag_category"] | null
          color?: string | null
          created_at?: string
          id?: string
          label: string
          salon_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["tag_category"] | null
          color?: string | null
          created_at?: string
          id?: string
          label?: string
          salon_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "salon_tags_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "salons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salon_tags_salon_id_fkey"
            columns: ["salon_id"]
            isOneToOne: false
            referencedRelation: "upcoming_salons"
            referencedColumns: ["id"]
          },
        ]
      }
      salons: {
        Row: {
          city: string | null
          country: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          edition_year: number | null
          end_date: string | null
          estimated_exhibitors: number | null
          estimated_visitors: number | null
          frequency: Database["public"]["Enums"]["salon_frequency"] | null
          id: string
          is_locked: boolean
          is_premium: boolean
          logo_url: string | null
          name: string
          organizer_email: string | null
          organizer_name: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          start_date: string | null
          status: Database["public"]["Enums"]["salon_status"]
          updated_at: string
          venue: string | null
          venue_id: string | null
          venue_lat: number | null
          venue_lng: number | null
          website_url: string | null
        }
        Insert: {
          city?: string | null
          country?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          edition_year?: number | null
          end_date?: string | null
          estimated_exhibitors?: number | null
          estimated_visitors?: number | null
          frequency?: Database["public"]["Enums"]["salon_frequency"] | null
          id?: string
          is_locked?: boolean
          is_premium?: boolean
          logo_url?: string | null
          name: string
          organizer_email?: string | null
          organizer_name?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["salon_status"]
          updated_at?: string
          venue?: string | null
          venue_id?: string | null
          venue_lat?: number | null
          venue_lng?: number | null
          website_url?: string | null
        }
        Update: {
          city?: string | null
          country?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          edition_year?: number | null
          end_date?: string | null
          estimated_exhibitors?: number | null
          estimated_visitors?: number | null
          frequency?: Database["public"]["Enums"]["salon_frequency"] | null
          id?: string
          is_locked?: boolean
          is_premium?: boolean
          logo_url?: string | null
          name?: string
          organizer_email?: string | null
          organizer_name?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["salon_status"]
          updated_at?: string
          venue?: string | null
          venue_id?: string | null
          venue_lat?: number | null
          venue_lng?: number | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salons_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          seo_description: string | null
          seo_title: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string | null
          city: string
          country: string
          created_at: string
          description: string | null
          google_maps_url: string | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          photo_url: string | null
          postal_code: string | null
          slug: string
          total_surface_sqm: number | null
          website_url: string | null
        }
        Insert: {
          address?: string | null
          city: string
          country?: string
          created_at?: string
          description?: string | null
          google_maps_url?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          photo_url?: string | null
          postal_code?: string | null
          slug: string
          total_surface_sqm?: number | null
          website_url?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          country?: string
          created_at?: string
          description?: string | null
          google_maps_url?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          photo_url?: string | null
          postal_code?: string | null
          slug?: string
          total_surface_sqm?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      upcoming_salons: {
        Row: {
          city: string | null
          country: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          edition_year: number | null
          end_date: string | null
          estimated_exhibitors: number | null
          estimated_visitors: number | null
          frequency: Database["public"]["Enums"]["salon_frequency"] | null
          id: string | null
          is_premium: boolean | null
          logo_url: string | null
          name: string | null
          organizer_email: string | null
          organizer_name: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["salon_status"] | null
          updated_at: string | null
          venue: string | null
          venue_lat: number | null
          venue_lng: number | null
          website_url: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          edition_year?: number | null
          end_date?: string | null
          estimated_exhibitors?: number | null
          estimated_visitors?: number | null
          frequency?: Database["public"]["Enums"]["salon_frequency"] | null
          id?: string | null
          is_premium?: boolean | null
          logo_url?: string | null
          name?: string | null
          organizer_email?: string | null
          organizer_name?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["salon_status"] | null
          updated_at?: string | null
          venue?: string | null
          venue_lat?: number | null
          venue_lng?: number | null
          website_url?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          edition_year?: number | null
          end_date?: string | null
          estimated_exhibitors?: number | null
          estimated_visitors?: number | null
          frequency?: Database["public"]["Enums"]["salon_frequency"] | null
          id?: string | null
          is_premium?: boolean | null
          logo_url?: string | null
          name?: string | null
          organizer_email?: string | null
          organizer_name?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["salon_status"] | null
          updated_at?: string | null
          venue?: string | null
          venue_lat?: number | null
          venue_lng?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      provider_category:
        | "standiste"
        | "traiteur"
        | "av_technique"
        | "photographe"
        | "transport"
        | "hebergement"
        | "autre"
      provider_tier: "free" | "premium"
      review_role: "exposant" | "visiteur" | "organisateur"
      review_target_type: "salon" | "provider"
      salon_frequency: "annuel" | "bisannuel" | "ponctuel"
      salon_status: "draft" | "published" | "cancelled" | "postponed"
      tag_category: "audience" | "trend" | "value" | "sector"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      provider_category: [
        "standiste",
        "traiteur",
        "av_technique",
        "photographe",
        "transport",
        "hebergement",
        "autre",
      ],
      provider_tier: ["free", "premium"],
      review_role: ["exposant", "visiteur", "organisateur"],
      review_target_type: ["salon", "provider"],
      salon_frequency: ["annuel", "bisannuel", "ponctuel"],
      salon_status: ["draft", "published", "cancelled", "postponed"],
      tag_category: ["audience", "trend", "value", "sector"],
    },
  },
} as const
