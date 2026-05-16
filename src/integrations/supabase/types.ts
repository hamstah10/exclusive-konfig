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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      dyno_bookings: {
        Row: {
          admin_note: string | null
          created_at: string
          email: string
          fuel: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          preferred_date: string
          service: Database["public"]["Enums"]["dyno_service"]
          status: Database["public"]["Enums"]["dyno_booking_status"]
          time_slot: string
          updated_at: string
          user_id: string | null
          vehicle_brand: string
          vehicle_hp: number | null
          vehicle_model: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          email: string
          fuel?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          preferred_date: string
          service: Database["public"]["Enums"]["dyno_service"]
          status?: Database["public"]["Enums"]["dyno_booking_status"]
          time_slot: string
          updated_at?: string
          user_id?: string | null
          vehicle_brand: string
          vehicle_hp?: number | null
          vehicle_model: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          email?: string
          fuel?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          preferred_date?: string
          service?: Database["public"]["Enums"]["dyno_service"]
          status?: Database["public"]["Enums"]["dyno_booking_status"]
          time_slot?: string
          updated_at?: string
          user_id?: string | null
          vehicle_brand?: string
          vehicle_hp?: number | null
          vehicle_model?: string
        }
        Relationships: []
      }
      felgen_anfragen: {
        Row: {
          created_at: string
          design: string | null
          email: string
          finish: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          season: string | null
          size: number | null
          status: string
          tire_brand: string | null
          tire_model: string | null
          total_price: number | null
          vehicle_class: string | null
        }
        Insert: {
          created_at?: string
          design?: string | null
          email: string
          finish?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          season?: string | null
          size?: number | null
          status?: string
          tire_brand?: string | null
          tire_model?: string | null
          total_price?: number | null
          vehicle_class?: string | null
        }
        Update: {
          created_at?: string
          design?: string | null
          email?: string
          finish?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          season?: string | null
          size?: number | null
          status?: string
          tire_brand?: string | null
          tire_model?: string | null
          total_price?: number | null
          vehicle_class?: string | null
        }
        Relationships: []
      }
      lead_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          id: string
          lead_id: string
          mime_type: string | null
          size_bytes: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          lead_id: string
          mime_type?: string | null
          size_bytes?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          lead_id?: string
          mime_type?: string | null
          size_bytes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_attachments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          admin_note: string | null
          created_at: string
          email: string
          financing: boolean
          id: string
          message: string | null
          name: string
          phone: string | null
          preferred_contact: string
          status: Database["public"]["Enums"]["lead_status"]
          trade_in: boolean
          updated_at: string
          user_id: string | null
          vehicle_id: string
          vehicle_label: string
          vehicle_slug: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          email: string
          financing?: boolean
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          preferred_contact?: string
          status?: Database["public"]["Enums"]["lead_status"]
          trade_in?: boolean
          updated_at?: string
          user_id?: string | null
          vehicle_id: string
          vehicle_label: string
          vehicle_slug: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          email?: string
          financing?: boolean
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          preferred_contact?: string
          status?: Database["public"]["Enums"]["lead_status"]
          trade_in?: boolean
          updated_at?: string
          user_id?: string | null
          vehicle_id?: string
          vehicle_label?: string
          vehicle_slug?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      valuation_analytics_events: {
        Row: {
          created_at: string
          event_name: string
          funnel_step: number | null
          id: string
          metadata: Json | null
          session_id: string | null
          source: string
          step_label: string | null
        }
        Insert: {
          created_at?: string
          event_name: string
          funnel_step?: number | null
          id?: string
          metadata?: Json | null
          session_id?: string | null
          source?: string
          step_label?: string | null
        }
        Update: {
          created_at?: string
          event_name?: string
          funnel_step?: number | null
          id?: string
          metadata?: Json | null
          session_id?: string | null
          source?: string
          step_label?: string | null
        }
        Relationships: []
      }
      valuation_follow_ups: {
        Row: {
          created_at: string
          due_at: string
          id: string
          lead_id: string
          sent_at: string | null
          status: string
          template: string
        }
        Insert: {
          created_at?: string
          due_at: string
          id?: string
          lead_id: string
          sent_at?: string | null
          status?: string
          template: string
        }
        Update: {
          created_at?: string
          due_at?: string
          id?: string
          lead_id?: string
          sent_at?: string | null
          status?: string
          template?: string
        }
        Relationships: [
          {
            foreignKeyName: "valuation_follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "valuation_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_lead_events: {
        Row: {
          created_at: string
          created_by: string | null
          event_type: string
          id: string
          lead_id: string
          payload: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          event_type: string
          id?: string
          lead_id: string
          payload?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          event_type?: string
          id?: string
          lead_id?: string
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "valuation_lead_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "valuation_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_leads: {
        Row: {
          accident_free: Database["public"]["Enums"]["valuation_yesno"]
          admin_note: string | null
          brand: string
          condition: Database["public"]["Enums"]["valuation_condition"]
          contact_channel: Database["public"]["Enums"]["valuation_channel"]
          created_at: string
          customer_notes: string | null
          email: string
          estimated_value_max: number | null
          estimated_value_min: number | null
          estimated_value_rationale: string | null
          estimated_value_typical: number | null
          expenses_eur: number | null
          first_name: string
          fuel: Database["public"]["Enums"]["valuation_fuel"]
          gearbox: Database["public"]["Enums"]["valuation_gearbox"]
          has_tuev: Database["public"]["Enums"]["valuation_tuev"]
          id: string
          last_name: string
          lead_score: number | null
          mileage: number
          model: string
          phone: string
          photo_urls: string[]
          preferred_date: string
          preferred_time: Database["public"]["Enums"]["valuation_time"]
          purchase_price: number | null
          purchased_at: string | null
          sale_price: number | null
          sold_at: string | null
          status: Database["public"]["Enums"]["valuation_lead_status"]
          updated_at: string
          user_id: string | null
          year: number
        }
        Insert: {
          accident_free: Database["public"]["Enums"]["valuation_yesno"]
          admin_note?: string | null
          brand: string
          condition: Database["public"]["Enums"]["valuation_condition"]
          contact_channel: Database["public"]["Enums"]["valuation_channel"]
          created_at?: string
          customer_notes?: string | null
          email: string
          estimated_value_max?: number | null
          estimated_value_min?: number | null
          estimated_value_rationale?: string | null
          estimated_value_typical?: number | null
          expenses_eur?: number | null
          first_name: string
          fuel: Database["public"]["Enums"]["valuation_fuel"]
          gearbox: Database["public"]["Enums"]["valuation_gearbox"]
          has_tuev: Database["public"]["Enums"]["valuation_tuev"]
          id?: string
          last_name: string
          lead_score?: number | null
          mileage: number
          model: string
          phone: string
          photo_urls?: string[]
          preferred_date: string
          preferred_time: Database["public"]["Enums"]["valuation_time"]
          purchase_price?: number | null
          purchased_at?: string | null
          sale_price?: number | null
          sold_at?: string | null
          status?: Database["public"]["Enums"]["valuation_lead_status"]
          updated_at?: string
          user_id?: string | null
          year: number
        }
        Update: {
          accident_free?: Database["public"]["Enums"]["valuation_yesno"]
          admin_note?: string | null
          brand?: string
          condition?: Database["public"]["Enums"]["valuation_condition"]
          contact_channel?: Database["public"]["Enums"]["valuation_channel"]
          created_at?: string
          customer_notes?: string | null
          email?: string
          estimated_value_max?: number | null
          estimated_value_min?: number | null
          estimated_value_rationale?: string | null
          estimated_value_typical?: number | null
          expenses_eur?: number | null
          first_name?: string
          fuel?: Database["public"]["Enums"]["valuation_fuel"]
          gearbox?: Database["public"]["Enums"]["valuation_gearbox"]
          has_tuev?: Database["public"]["Enums"]["valuation_tuev"]
          id?: string
          last_name?: string
          lead_score?: number | null
          mileage?: number
          model?: string
          phone?: string
          photo_urls?: string[]
          preferred_date?: string
          preferred_time?: Database["public"]["Enums"]["valuation_time"]
          purchase_price?: number | null
          purchased_at?: string | null
          sale_price?: number | null
          sold_at?: string | null
          status?: Database["public"]["Enums"]["valuation_lead_status"]
          updated_at?: string
          user_id?: string | null
          year?: number
        }
        Relationships: []
      }
      valuation_market_data: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          max_price: number | null
          median_price: number | null
          min_price: number | null
          raw: Json | null
          recommended_price: number | null
          sample_count: number | null
          source: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          max_price?: number | null
          median_price?: number | null
          min_price?: number | null
          raw?: Json | null
          recommended_price?: number | null
          sample_count?: number | null
          source: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          max_price?: number | null
          median_price?: number | null
          min_price?: number | null
          raw?: Json | null
          recommended_price?: number | null
          sample_count?: number | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "valuation_market_data_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "valuation_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_photo_analysis: {
        Row: {
          analysis: Json
          analyzed_at: string
          id: string
          lead_id: string
          revaluation: Json | null
        }
        Insert: {
          analysis: Json
          analyzed_at?: string
          id?: string
          lead_id: string
          revaluation?: Json | null
        }
        Update: {
          analysis?: Json
          analyzed_at?: string
          id?: string
          lead_id?: string
          revaluation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "valuation_photo_analysis_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "valuation_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      valuation_purchase_contracts: {
        Row: {
          contract_data: Json
          generated_at: string
          generated_by: string | null
          id: string
          lead_id: string
          pdf_url: string | null
        }
        Insert: {
          contract_data: Json
          generated_at?: string
          generated_by?: string | null
          id?: string
          lead_id: string
          pdf_url?: string | null
        }
        Update: {
          contract_data?: Json
          generated_at?: string
          generated_by?: string | null
          id?: string
          lead_id?: string
          pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "valuation_purchase_contracts_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "valuation_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          brand: string
          category: string
          color: string
          cover_image: string | null
          created_at: string
          description: string
          drive: string
          featured: boolean
          fuel: string
          gallery: string[]
          highlights: string[]
          hp: number
          id: string
          is_active: boolean
          km: number
          model: string
          price: number
          slug: string
          sort_order: number
          transmission: string
          updated_at: string
          year: number
        }
        Insert: {
          brand: string
          category: string
          color: string
          cover_image?: string | null
          created_at?: string
          description?: string
          drive: string
          featured?: boolean
          fuel: string
          gallery?: string[]
          highlights?: string[]
          hp: number
          id?: string
          is_active?: boolean
          km: number
          model: string
          price: number
          slug: string
          sort_order?: number
          transmission: string
          updated_at?: string
          year: number
        }
        Update: {
          brand?: string
          category?: string
          color?: string
          cover_image?: string | null
          created_at?: string
          description?: string
          drive?: string
          featured?: boolean
          fuel?: string
          gallery?: string[]
          highlights?: string[]
          hp?: number
          id?: string
          is_active?: boolean
          km?: number
          model?: string
          price?: number
          slug?: string
          sort_order?: number
          transmission?: string
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      vermittlung_anfragen: {
        Row: {
          body_types: string[] | null
          brand: string | null
          budget_max: number | null
          color: string | null
          created_at: string
          email: string
          first_name: string
          fuel: string | null
          gearbox: string | null
          id: string
          km_max: number | null
          last_name: string
          model: string | null
          notes: string | null
          phone: string | null
          status: string
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          body_types?: string[] | null
          brand?: string | null
          budget_max?: number | null
          color?: string | null
          created_at?: string
          email: string
          first_name: string
          fuel?: string | null
          gearbox?: string | null
          id?: string
          km_max?: number | null
          last_name: string
          model?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          body_types?: string[] | null
          brand?: string | null
          budget_max?: number | null
          color?: string | null
          created_at?: string
          email?: string
          first_name?: string
          fuel?: string | null
          gearbox?: string | null
          id?: string
          km_max?: number | null
          last_name?: string
          model?: string | null
          notes?: string | null
          phone?: string | null
          status?: string
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      dyno_booking_status:
        | "angefragt"
        | "bestaetigt"
        | "durchgefuehrt"
        | "storniert"
      dyno_service:
        | "leistungsmessung"
        | "tuning_session"
        | "vorher_nachher"
        | "datenlogging"
      lead_status:
        | "neu"
        | "in_bearbeitung"
        | "angebot_versendet"
        | "abgeschlossen"
        | "abgelehnt"
      valuation_channel: "telefon" | "email" | "whatsapp"
      valuation_condition:
        | "sehr_gut"
        | "gut"
        | "gebraucht"
        | "maengel"
        | "defekt"
      valuation_fuel: "benzin" | "diesel" | "hybrid" | "elektro" | "lpg" | "cng"
      valuation_gearbox: "manuell" | "automatik"
      valuation_lead_status:
        | "neu"
        | "qualifiziert"
        | "kontaktiert"
        | "termin"
        | "gekauft"
        | "abgesagt"
      valuation_time: "vormittag" | "nachmittag" | "abend" | "egal"
      valuation_tuev: "ja" | "nein" | "abgelaufen"
      valuation_yesno: "ja" | "nein"
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
      app_role: ["admin", "moderator", "user"],
      dyno_booking_status: [
        "angefragt",
        "bestaetigt",
        "durchgefuehrt",
        "storniert",
      ],
      dyno_service: [
        "leistungsmessung",
        "tuning_session",
        "vorher_nachher",
        "datenlogging",
      ],
      lead_status: [
        "neu",
        "in_bearbeitung",
        "angebot_versendet",
        "abgeschlossen",
        "abgelehnt",
      ],
      valuation_channel: ["telefon", "email", "whatsapp"],
      valuation_condition: [
        "sehr_gut",
        "gut",
        "gebraucht",
        "maengel",
        "defekt",
      ],
      valuation_fuel: ["benzin", "diesel", "hybrid", "elektro", "lpg", "cng"],
      valuation_gearbox: ["manuell", "automatik"],
      valuation_lead_status: [
        "neu",
        "qualifiziert",
        "kontaktiert",
        "termin",
        "gekauft",
        "abgesagt",
      ],
      valuation_time: ["vormittag", "nachmittag", "abend", "egal"],
      valuation_tuev: ["ja", "nein", "abgelaufen"],
      valuation_yesno: ["ja", "nein"],
    },
  },
} as const
