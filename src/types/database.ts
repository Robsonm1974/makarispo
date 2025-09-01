export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          tenant_id: string
          school_id: string
          name: string
          event_date: string | null
          event_end_date: string | null
          commission_percent: number | null
          notes: string | null
          status: string
          products_enabled: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          school_id: string
          name: string
          event_date?: string | null
          event_end_date?: string | null
          commission_percent?: number | null
          notes?: string | null
          status?: string
          products_enabled?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          school_id?: string
          name?: string
          event_date?: string | null
          event_end_date?: string | null
          commission_percent?: number | null
          notes?: string | null
          status?: string
          products_enabled?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          tenant_id: string
          participant_id: string | null
          buyer_name: string
          buyer_email: string
          buyer_phone: string | null
          total_amount: number
          status: string
          payment_id: string | null
          payment_method: string | null
          delivery_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          participant_id?: string | null
          buyer_name: string
          buyer_email: string
          buyer_phone?: string | null
          total_amount: number
          status?: string
          payment_id?: string | null
          payment_method?: string | null
          delivery_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          participant_id?: string | null
          buyer_name?: string
          buyer_email?: string
          buyer_phone?: string | null
          total_amount?: number
          status?: string
          payment_id?: string | null
          payment_method?: string | null
          delivery_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      participants: {
        Row: {
          id: string
          event_id: string
          name: string
          class: string | null
          qr_code: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          class?: string | null
          qr_code: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          name?: string
          class?: string | null
          qr_code?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          }
        ]
      }
      photos: {
        Row: {
          id: string
          participant_id: string
          filename: string
          original_filename: string | null
          url: string
          thumbnail_url: string | null
          file_size: number | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          filename: string
          original_filename?: string | null
          url: string
          thumbnail_url?: string | null
          file_size?: number | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          filename?: string
          original_filename?: string | null
          url?: string
          thumbnail_url?: string | null
          file_size?: number | null
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          tenant_id: string
          name: string
          description: string | null
          price: number
          mockup_url: string | null
          category: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          description?: string | null
          price: number
          mockup_url?: string | null
          category?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          description?: string | null
          price?: number
          mockup_url?: string | null
          category?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      schools: {
        Row: {
          id: string
          tenant_id: string
          name: string
          address: string | null
          director_name: string | null
          director_photo_url: string | null
          phone: string | null
          email: string | null
          type: string | null
          students_count: number | null
          school_photo_url: string | null
          director_message: string | null
          social_media: Json | null
          notes: string | null
          slug: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          address?: string | null
          director_name?: string | null
          director_photo_url?: string | null
          phone?: string | null
          email?: string | null
          type?: string | null
          students_count?: number | null
          school_photo_url?: string | null
          director_message?: string | null
          social_media?: Json | null
          notes?: string | null
          slug?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          name?: string
          address?: string | null
          director_name?: string | null
          director_photo_url?: string | null
          phone?: string | null
          email?: string | null
          type?: string | null
          students_count?: number | null
          school_photo_url?: string | null
          director_message?: string | null
          social_media?: Json | null
          notes?: string | null
          slug?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schools_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      tenants: {
        Row: {
          id: string
          email: string
          name: string
          whatsapp: string | null
          city: string | null
          state: string | null
          bio: string | null
          plan: string
          logo_url: string | null
          slug: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          whatsapp?: string | null
          city?: string | null
          state?: string | null
          bio?: string | null
          plan?: string
          logo_url?: string | null
          slug?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          whatsapp?: string | null
          city?: string | null
          state?: string | null
          bio?: string | null
          plan?: string
          logo_url?: string | null
          slug?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}