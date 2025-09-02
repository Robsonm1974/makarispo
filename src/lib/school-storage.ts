import { supabase } from '@/lib/supabase-config'

// School storage configuration
export const schoolStorageConfig = {
  bucket: 'school-images',
  limits: {
    schoolImage: 5 * 1024 * 1024, // 5MB
    directorImage: 3 * 1024 * 1024 // 3MB
  },
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
}

// School storage utilities
export const schoolStorageUtils = {
  // Upload school photo
  async uploadSchoolPhoto(file: File, schoolId: string): Promise<{ path: string; url: string }> {
    try {
      const fileName = `${schoolId}/school-${Date.now()}-${file.name}`
      const path = `schools/${fileName}`

      const { data, error } = await supabase.storage
        .from(schoolStorageConfig.bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading school photo:', error)
        throw error
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(schoolStorageConfig.bucket)
        .getPublicUrl(path)

      return {
        path: path,
        url: urlData.publicUrl
      }
    } catch (error) {
      console.error('Error in uploadSchoolPhoto:', error)
      throw error
    }
  },

  // Upload director photo
  async uploadDirectorPhoto(file: File, schoolId: string): Promise<{ path: string; url: string }> {
    try {
      const fileName = `${schoolId}/director-${Date.now()}-${file.name}`
      const path = `directors/${fileName}`

      const { data, error } = await supabase.storage
        .from(schoolStorageConfig.bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading director photo:', error)
        throw error
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(schoolStorageConfig.bucket)
        .getPublicUrl(path)

      return {
        path: path,
        url: urlData.publicUrl
      }
    } catch (error) {
      console.error('Error in uploadDirectorPhoto:', error)
      throw error
    }
  },

  // Delete school photo
  async deleteSchoolPhoto(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(schoolStorageConfig.bucket)
        .remove([path])

      if (error) {
        console.error('Error deleting school photo:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error in deleteSchoolPhoto:', error)
      throw error
    }
  },

  // Delete director photo
  async deleteDirectorPhoto(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(schoolStorageConfig.bucket)
        .remove([path])

      if (error) {
        console.error('Error deleting director photo:', error)
        throw error
      }

      return true
    } catch (error) {
      console.error('Error in deleteDirectorPhoto:', error)
      throw error
    }
  },

  // Get public URL
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(schoolStorageConfig.bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}

// Validation utilities for school images
export const schoolImageValidation = {
  // Validate file size
  validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize
  },

  // Validate file type
  validateFileType(file: File): boolean {
    return schoolStorageConfig.allowedTypes.includes(file.type)
  },

  // Validate school image
  validateSchoolImage(file: File): { isValid: boolean; error?: string } {
    if (!this.validateFileSize(file, schoolStorageConfig.limits.schoolImage)) {
      return {
        isValid: false,
        error: `File size must be less than ${schoolStorageConfig.limits.schoolImage / (1024 * 1024)}MB`
      }
    }

    if (!this.validateFileType(file)) {
      return {
        isValid: false,
        error: 'File type not allowed. Please use JPEG, PNG, or WebP'
      }
    }

    return { isValid: true }
  },

  // Validate director image
  validateDirectorImage(file: File): { isValid: boolean; error?: string } {
    if (!this.validateFileSize(file, schoolStorageConfig.limits.directorImage)) {
      return {
        isValid: false,
        error: `File size must be less than ${schoolStorageConfig.limits.directorImage / (1024 * 1024)}MB`
      }
    }

    if (!this.validateFileType(file)) {
      return {
        isValid: false,
        error: 'File type not allowed. Please use JPEG, PNG, or WebP'
      }
    }

    return { isValid: true }
  }
}
