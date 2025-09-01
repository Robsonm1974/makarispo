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
          commission_percent?: string | null
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
          event_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          total_amount: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          event_id: string
          customer_name: string
          customer_email: string
          customer_phone: string
          total_amount: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          event_id?: string
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          total_amount?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
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
          file_path: string
          file_name: string
          file_size: number
          mime_type: string
          uploaded_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          participant_id: string
          file_path: string
          file_name: string
          file_size: number
          mime_type: string
          uploaded_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          participant_id?: string
          file_path?: string
          file_name?: string
          file_size?: number
          mime_type?: string
          uploaded_at?: string
          created_at?: string
          updated_at?: string
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
          category: string | null
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
          category?: string | null
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
          category?: string | null
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
          name: string
          domain: string | null
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          settings?: Json | null
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

// Exportar tipos úteis para uso em outros arquivos
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]
export type Functions<T extends keyof Database['public']['Functions']> = Database['public']['Functions'][T]
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
export type CompositeTypes<T extends keyof Database['public']['CompositeTypes']> = Database['public']['CompositeTypes'][T]

// Tipos específicos para cada tabela
export type Events = Tables<'events'>
export type EventsInsert = Tables<'events'>['Insert']
export type EventsUpdate = Tables<'events'>['Update']

export type Participants = Tables<'participants'>
export type ParticipantsInsert = Tables<'participants'>['Insert']
export type ParticipantsUpdate = Tables<'participants'>['Update']

export type Schools = Tables<'schools'>
export type SchoolsInsert = Tables<'schools'>['Insert']
export type SchoolsUpdate = Tables<'schools'>['Update']

export type Photos = Tables<'photos'>
export type PhotosInsert = Tables<'photos'>['Insert']
export type PhotosUpdate = Tables<'photos'>['Update']

export type Products = Tables<'products'>
export type ProductsInsert = Tables<'products'>['Insert']
export type ProductsUpdate = Tables<'products'>['Update']

export type Orders = Tables<'orders'>
export type OrdersInsert = Tables<'orders'>['Insert']
export type OrdersUpdate = Tables<'orders'>['Update']

export type OrderItems = Tables<'order_items'>
export type OrderItemsInsert = Tables<'order_items'>['Insert']
export type OrderItemsUpdate = Tables<'order_items'>['Update']

export type Tenants = Tables<'tenants'>
export type TenantsInsert = Tables<'tenants'>['Insert']
export type TenantsUpdate = Tables<'tenants'>['Update']