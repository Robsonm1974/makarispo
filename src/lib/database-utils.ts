import { supabase } from '@/lib/supabase-config'
import type { Database } from '@/types/database'

// Tenant management utilities
export const tenantUtils = {
  // Get tenant by ID
  async getTenantById(tenantId: string) {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()

    if (error) {
      console.error('Error fetching tenant:', error)
      return null
    }

    return data
  },

  // Create new tenant
  async createTenant(tenantData: Database['public']['Tables']['tenants']['Insert']) {
    const { data, error } = await supabase
      .from('tenants')
      .insert([tenantData])
      .select()
      .single()

    if (error) {
      console.error('Error creating tenant:', error)
      throw error
    }

    return data
  },

  // Update tenant
  async updateTenant(tenantId: string, updateData: Partial<Database['public']['Tables']['tenants']['Update']>) {
    const { data, error } = await supabase
      .from('tenants')
      .update(updateData)
      .eq('id', tenantId)
      .select()
      .single()

    if (error) {
      console.error('Error updating tenant:', error)
      throw error
    }

    return data
  },

  // Delete tenant
  async deleteTenant(tenantId: string) {
    const { error } = await supabase
      .from('tenants')
      .delete()
      .eq('id', tenantId)

    if (error) {
      console.error('Error deleting tenant:', error)
      throw error
    }

    return true
  }
}

// School management utilities
export const schoolUtils = {
  // Get schools by tenant
  async getSchoolsByTenant(tenantId: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching schools:', error)
      return []
    }

    return data || []
  },

  // Create new school
  async createSchool(schoolData: Database['public']['Tables']['schools']['Insert']) {
    const { data, error } = await supabase
      .from('schools')
      .insert([schoolData])
      .select()
      .single()

    if (error) {
      console.error('Error creating school:', error)
      throw error
    }

    return data
  },

  // Update school
  async updateSchool(schoolId: string, updateData: Partial<Database['public']['Tables']['schools']['Update']>) {
    const { data, error } = await supabase
      .from('schools')
      .update(updateData)
      .eq('id', schoolId)
      .select()
      .single()

    if (error) {
      console.error('Error updating school:', error)
      throw error
    }

    return data
  },

  // Delete school
  async deleteSchool(schoolId: string) {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', schoolId)

    if (error) {
      console.error('Error deleting school:', error)
      throw error
    }

    return true
  }
}

// Event management utilities
export const eventUtils = {
  // Get events by tenant
  async getEventsByTenant(tenantId: string) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return data || []
  },

  // Create new event
  async createEvent(eventData: Database['public']['Tables']['events']['Insert']) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single()

    if (error) {
      console.error('Error creating event:', error)
      throw error
    }

    return data
  },

  // Update event
  async updateEvent(eventId: string, updateData: Partial<Database['public']['Tables']['events']['Update']>) {
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)
      .select()
      .single()

    if (error) {
      console.error('Error updating event:', error)
      throw error
    }

    return data
  },

  // Delete event
  async deleteEvent(eventId: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId)

    if (error) {
      console.error('Error deleting event:', error)
      throw error
    }

    return true
  }
}

// Participant management utilities
export const participantUtils = {
  // Get participants by event
  async getParticipantsByEvent(eventId: string) {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('event_id', eventId)
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching participants:', error)
      return []
    }

    return data || []
  },

  // Create new participant
  async createParticipant(participantData: Database['public']['Tables']['participants']['Insert']) {
    const { data, error } = await supabase
      .from('participants')
      .insert([participantData])
      .select()
      .single()

    if (error) {
      console.error('Error creating participant:', error)
      throw error
    }

    return data
  },

  // Update participant
  async updateParticipant(participantId: string, updateData: Partial<Database['public']['Tables']['participants']['Update']>) {
    const { data, error } = await supabase
      .from('participants')
      .update(updateData)
      .eq('id', participantId)
      .select()
      .single()

    if (error) {
      console.error('Error updating participant:', error)
      throw error
    }

    return data
  },

  // Delete participant
  async deleteParticipant(participantId: string) {
    const { error } = await supabase
      .from('participants')
      .delete()
      .eq('id', participantId)

    if (error) {
      console.error('Error deleting participant:', error)
      throw error
    }

    return true
  }
}