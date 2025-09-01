// Database utilities for PHOTOMANAGER V2
// Common database operations and helpers

import { supabase, createServerSupabaseClient } from '@/lib/supabase-config'
import type { Tables, Inserts, Updates } from '@/types/database'

// Tenant management utilities
export const tenantUtils = {
  // Get tenant by slug
  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .eq('active', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Get tenant by email
  async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('email', email)
      .eq('active', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new tenant
  async create(tenantData: Inserts<'tenants'>) {
    const { data, error } = await supabase
      .from('tenants')
      .insert(tenantData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update tenant
  async update(id: string, updates: Updates<'tenants'>) {
    const { data, error } = await supabase
      .from('tenants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// School management utilities
export const schoolUtils = {
  // Get schools by tenant
  async getByTenant(tenantId: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .order('name')
    
    if (error) throw error
    return data
  },

  // Get school by slug within tenant
  async getBySlug(tenantId: string, slug: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('slug', slug)
      .eq('active', true)
      .single()
    
    if (error) throw error
    return data
  },

  // Create school
  async create(schoolData: Inserts<'schools'>) {
    const { data, error } = await supabase
      .from('schools')
      .insert(schoolData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Event management utilities
export const eventUtils = {
  // Get events by school
  async getBySchool(schoolId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('school_id', schoolId)
      .order('event_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get active events
  async getActive() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'active')
      .order('event_date')
    
    if (error) throw error
    return data
  }
}

// Participant management utilities
export const participantUtils = {
  // Get participants by event
  async getByEvent(eventId: string) {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('event_id', eventId)
      .order('name')
    
    if (error) throw error
    return data
  },

  // Get participant by QR code
  async getByQRCode(qrCode: string) {
    const { data, error } = await supabase
      .from('participants')
      .select(`
        *,
        events!inner(*),
        schools!inner(*),
        tenants!inner(*)
      `)
      .eq('qr_code', qrCode)
      .single()
    
    if (error) throw error
    return data
  },

  // Generate unique QR code
  async generateQRCode(): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let qrCode: string
    let exists: boolean
    
    do {
      qrCode = 'PMV2-'
      for (let i = 0; i < 8; i++) {
        qrCode += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      const { data } = await supabase
        .from('participants')
        .select('id')
        .eq('qr_code', qrCode)
        .single()
      
      exists = !!data
    } while (exists)
    
    return qrCode
  }
}

// Photo management utilities
export const photoUtils = {
  // Get photos by participant
  async getByParticipant(participantId: string) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('participant_id', participantId)
      .order('uploaded_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Upload photo metadata
  async uploadMetadata(photoData: Inserts<'photos'>) {
    const { data, error } = await supabase
      .from('photos')
      .insert(photoData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Product management utilities
export const productUtils = {
  // Get products by tenant
  async getByTenant(tenantId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('active', true)
      .order('name')
    
    if (error) throw error
    return data
  },

  // Get active products
  async getActive() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('name')
    
    if (error) throw error
    return data
  }
}

// Order management utilities
export const orderUtils = {
  // Get orders by tenant
  async getByTenant(tenantId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        participants(*),
        order_items(
          *,
          products(*),
          photos(*)
        )
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get order with details
  async getWithDetails(orderId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        participants(*),
        order_items(
          *,
          products(*),
          photos(*)
        )
      `)
      .eq('id', orderId)
      .single()
    
    if (error) throw error
    return data
  },

  // Create order with items
  async createWithItems(orderData: Inserts<'orders'>, items: Inserts<'order_items'>[]) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single()
    
    if (orderError) throw orderError
    
    if (items.length > 0) {
      const itemsWithOrderId = items.map(item => ({
        ...item,
        order_id: order.id
      }))
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsWithOrderId)
      
      if (itemsError) throw itemsError
    }
    
    return order
  }
}

// Search utilities
export const searchUtils = {
  // Search participants by name or QR code
  async searchParticipants(query: string, tenantId?: string) {
    let queryBuilder = supabase
      .from('participants')
      .select(`
        *,
        events!inner(
          *,
          schools!inner(
            *,
            tenants!inner(*)
          )
        )
      `)
      .or(`name.ilike.%${query}%,qr_code.ilike.%${query}%`)
    
    if (tenantId) {
      queryBuilder = queryBuilder.eq('events.schools.tenants.id', tenantId)
    }
    
    const { data, error } = await queryBuilder.limit(10)
    
    if (error) throw error
    return data
  },

  // Search schools by name
  async searchSchools(query: string, tenantId?: string) {
    let queryBuilder = supabase
      .from('schools')
      .select('*')
      .ilike('name', `%${query}%`)
      .eq('active', true)
    
    if (tenantId) {
      queryBuilder = queryBuilder.eq('tenant_id', tenantId)
    }
    
    const { data, error } = await queryBuilder.limit(10)
    
    if (error) throw error
    return data
  }
}

// Analytics utilities
export const analyticsUtils = {
  // Get tenant statistics
  async getTenantStats(tenantId: string) {
    const { data: schools } = await supabase
      .from('schools')
      .select('id')
      .eq('tenant_id', tenantId)
      .eq('active', true)
    
    const schoolIds = schools?.map(s => s.id) || []
    
    const [eventsCount, participantsCount, photosCount, ordersCount] = await Promise.all([
      supabase.from('events').select('id', { count: 'exact' }).in('school_id', schoolIds),
      supabase.from('participants').select('id', { count: 'exact' }).in('event_id', 
        supabase.from('events').select('id').in('school_id', schoolIds)
      ),
      supabase.from('photos').select('id', { count: 'exact' }).in('participant_id',
        supabase.from('participants').select('id').in('event_id',
          supabase.from('events').select('id').in('school_id', schoolIds)
        )
      ),
      supabase.from('orders').select('id', { count: 'exact' }).eq('tenant_id', tenantId)
    ])
    
    return {
      schools: schools?.length || 0,
      events: eventsCount.count || 0,
      participants: participantsCount.count || 0,
      photos: photosCount.count || 0,
      orders: ordersCount.count || 0
    }
  }
}

// Export all utilities
export const dbUtils = {
  tenants: tenantUtils,
  schools: schoolUtils,
  events: eventUtils,
  participants: participantUtils,
  photos: photoUtils,
  products: productUtils,
  orders: orderUtils,
  search: searchUtils,
  analytics: analyticsUtils
}
