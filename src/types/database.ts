// Database Types for PHOTOMANAGER V2
// Multi-tenant SaaS for School Photography

export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          email: string;
          name: string;
          whatsapp: string | null;
          city: string | null;
          state: string | null;
          bio: string | null;
          plan: 'gratuito' | 'iniciante' | 'pro';
          logo_url: string | null;
          slug: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          whatsapp?: string | null;
          city?: string | null;
          state?: string | null;
          bio?: string | null;
          plan?: 'gratuito' | 'iniciante' | 'pro';
          logo_url?: string | null;
          slug: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          whatsapp?: string | null;
          city?: string | null;
          state?: string | null;
          bio?: string | null;
          plan?: 'gratuito' | 'iniciante' | 'pro';
          logo_url?: string | null;
          slug?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          address: string | null;
          director_name: string | null;
          director_photo_url: string | null;
          phone: string | null;
          email: string | null;
          type: 'publica' | 'privada' | null;
          students_count: number | null;
          school_photo_url: string | null;
          director_message: string | null;
          social_media: any | null;
          notes: string | null;
          slug: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          address?: string | null;
          director_name?: string | null;
          director_photo_url?: string | null;
          phone?: string | null;
          email?: string | null;
          type?: 'publica' | 'privada' | null;
          students_count?: number | null;
          school_photo_url?: string | null;
          director_message?: string | null;
          social_media?: any | null;
          notes?: string | null;
          slug?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          address?: string | null;
          director_name?: string | null;
          director_photo_url?: string | null;
          phone?: string | null;
          email?: string | null;
          type?: 'publica' | 'privada' | null;
          students_count?: number | null;
          school_photo_url?: string | null;
          director_message?: string | null;
          social_media?: any | null;
          notes?: string | null;
          slug?: string | null;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          tenant_id: string;
          school_id: string;
          name: string;
          event_date: string | null;
          event_end_date: string | null;
          commission_percent: number;
          notes: string | null;
          status: 'planned' | 'active' | 'completed';
          products_enabled: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          school_id: string;
          name: string;
          event_date?: string | null;
          event_end_date?: string | null;
          commission_percent?: number;
          notes?: string | null;
          status?: 'planned' | 'active' | 'completed';
          products_enabled?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          school_id?: string;
          name?: string;
          event_date?: string | null;
          event_end_date?: string | null;
          commission_percent?: number;
          notes?: string | null;
          status?: 'planned' | 'active' | 'completed';
          products_enabled?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      participants: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          class: string | null;
          qr_code: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          class?: string | null;
          qr_code: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          class?: string | null;
          qr_code?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      photos: {
        Row: {
          id: string;
          participant_id: string;
          filename: string;
          original_filename: string | null;
          url: string;
          thumbnail_url: string | null;
          file_size: number | null;
          uploaded_at: string;
        };
        Insert: {
          id?: string;
          participant_id: string;
          filename: string;
          original_filename?: string | null;
          url: string;
          thumbnail_url?: string | null;
          file_size?: number | null;
          uploaded_at?: string;
        };
        Update: {
          id?: string;
          participant_id?: string;
          filename?: string;
          original_filename?: string | null;
          url?: string;
          thumbnail_url?: string | null;
          file_size?: number | null;
          uploaded_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          price: number;
          mockup_url: string | null;
          category: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          price: number;
          mockup_url?: string | null;
          category?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          mockup_url?: string | null;
          category?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          tenant_id: string;
          participant_id: string | null;
          buyer_name: string;
          buyer_email: string;
          buyer_phone: string | null;
          total_amount: number;
          status: 'pending' | 'paid' | 'producing' | 'delivered';
          payment_id: string | null;
          payment_method: string | null;
          delivery_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          participant_id?: string | null;
          buyer_name: string;
          buyer_email: string;
          buyer_phone?: string | null;
          total_amount: number;
          status?: 'pending' | 'paid' | 'producing' | 'delivered';
          payment_id?: string | null;
          payment_method?: string | null;
          delivery_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          participant_id?: string | null;
          buyer_name?: string;
          buyer_email?: string;
          buyer_phone?: string | null;
          total_amount?: number;
          status?: 'pending' | 'paid' | 'producing' | 'delivered';
          payment_id?: string | null;
          payment_method?: string | null;
          delivery_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          photo_id: string | null;
          quantity: number;
          unit_price: number;
          customization: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          photo_id?: string | null;
          quantity?: number;
          unit_price: number;
          customization?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          photo_id?: string | null;
          quantity?: number;
          unit_price?: number;
          customization?: any | null;
          created_at?: string;
        };
      };
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
