// Storage Configuration for PHOTOMANAGER V2
// Multi-tenant SaaS for School Photography

import { supabase } from './supabase-config'

// Storage configuration
export const storageConfig = {
  // Bucket names
  buckets: {
    photos: 'photos',
    thumbnails: 'thumbnails',
    logos: 'logos',
    mockups: 'mockups'
  },
  
  // File size limits (in bytes)
  limits: {
    photo: 10 * 1024 * 1024, // 10MB
    thumbnail: 2 * 1024 * 1024, // 2MB
    logo: 5 * 1024 * 1024, // 5MB
    mockup: 10 * 1024 * 1024 // 10MB
  },
  
  // Allowed file types
  allowedTypes: {
    photos: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    logos: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
    mockups: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  
  // Image processing options
  imageProcessing: {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    thumbnailWidth: 300,
    thumbnailHeight: 300
  }
}

// Storage utilities
export const storageUtils = {
  // Upload photo
  async uploadPhoto(
    file: File,
    participantId: string,
    eventId: string,
    tenantId: string
  ) {
    try {
      // Validate file
      if (!this.validateFile(file, 'photos')) {
        throw new Error('Tipo de arquivo não suportado')
      }
      
      if (file.size > storageConfig.limits.photo) {
        throw new Error('Arquivo muito grande')
      }
      
      // Generate unique filename
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop()
      const filename = `photo_${participantId}_${eventId}_${timestamp}_${randomId}.${extension}`
      
      // Upload to photos bucket
      const { data: photoData, error: photoError } = await supabase.storage
        .from(storageConfig.buckets.photos)
        .upload(`${tenantId}/${eventId}/${filename}`, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (photoError) throw photoError
      
      // Get public URL
      const { data: photoUrl } = supabase.storage
        .from(storageConfig.buckets.photos)
        .getPublicUrl(`${tenantId}/${eventId}/${filename}`)
      
      // Create thumbnail
      const thumbnail = await this.createThumbnail(file)
      const thumbnailFilename = `thumb_${filename}`
      
      const { data: thumbnailData, error: thumbnailError } = await supabase.storage
        .from(storageConfig.buckets.thumbnails)
        .upload(`${tenantId}/${eventId}/${thumbnailFilename}`, thumbnail, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (thumbnailError) throw thumbnailError
      
      // Get thumbnail URL
      const { data: thumbnailUrl } = supabase.storage
        .from(storageConfig.buckets.thumbnails)
        .getPublicUrl(`${tenantId}/${eventId}/${thumbnailFilename}`)
      
      return {
        filename: filename,
        originalFilename: file.name,
        url: photoUrl.publicUrl,
        thumbnailUrl: thumbnailUrl.publicUrl,
        fileSize: file.size,
        path: photoData.path
      }
    } catch (error) {
      throw error
    }
  },

  // Upload logo
  async uploadLogo(file: File, tenantId: string) {
    try {
      // Validate file
      if (!this.validateFile(file, 'logos')) {
        throw new Error('Tipo de arquivo não suportado')
      }
      
      if (file.size > storageConfig.limits.logo) {
        throw new Error('Arquivo muito grande')
      }
      
      // Generate filename
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const filename = `logo_${tenantId}_${timestamp}.${extension}`
      
      // Upload to logos bucket
      const { data, error } = await supabase.storage
        .from(storageConfig.buckets.logos)
        .upload(`${tenantId}/${filename}`, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) throw error
      
      // Get public URL
      const { data: url } = supabase.storage
        .from(storageConfig.buckets.logos)
        .getPublicUrl(`${tenantId}/${filename}`)
      
      return {
        filename: filename,
        url: url.publicUrl,
        path: data.path
      }
    } catch (error) {
      throw error
    }
  },

  // Upload mockup
  async uploadMockup(file: File, tenantId: string, productId: string) {
    try {
      // Validate file
      if (!this.validateFile(file, 'mockups')) {
        throw new Error('Tipo de arquivo não suportado')
      }
      
      if (file.size > storageConfig.limits.mockup) {
        throw new Error('Arquivo muito grande')
      }
      
      // Generate filename
      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const filename = `mockup_${productId}_${timestamp}.${extension}`
      
      // Upload to mockups bucket
      const { data, error } = await supabase.storage
        .from(storageConfig.buckets.mockups)
        .upload(`${tenantId}/${filename}`, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) throw error
      
      // Get public URL
      const { data: url } = supabase.storage
        .from(storageConfig.buckets.mockups)
        .getPublicUrl(`${tenantId}/${filename}`)
      
      return {
        filename: filename,
        url: url.publicUrl,
        path: data.path
      }
    } catch (error) {
      throw error
    }
  },

  // Delete file
  async deleteFile(bucket: string, path: string) {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])
      
      if (error) throw error
      
      return true
    } catch (error) {
      throw error
    }
  },

  // Delete photo and thumbnail
  async deletePhoto(photoPath: string, thumbnailPath: string) {
    try {
      await Promise.all([
        this.deleteFile(storageConfig.buckets.photos, photoPath),
        this.deleteFile(storageConfig.buckets.thumbnails, thumbnailPath)
      ])
      
      return true
    } catch (error) {
      throw error
    }
  },

  // List files in bucket
  async listFiles(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path)
      
      if (error) throw error
      
      return data
    } catch (error) {
      throw error
    }
  },

  // Get file info
  async getFileInfo(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .getPublicUrl(path)
      
      if (error) throw error
      
      return data
    } catch (error) {
      throw error
    }
  },

  // Validate file type
  validateFile(file: File, type: keyof typeof storageConfig.allowedTypes) {
    return storageConfig.allowedTypes[type].includes(file.type)
  },

  // Create thumbnail from image
  async createThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate dimensions
        const { maxWidth, maxHeight, thumbnailWidth, thumbnailHeight } = storageConfig.imageProcessing
        
        let { width, height } = img
        
        // Resize if too large
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        // Set canvas size
        canvas.width = thumbnailWidth
        canvas.height = thumbnailHeight
        
        // Draw and resize image
        ctx?.drawImage(img, 0, 0, width, height, 0, 0, thumbnailWidth, thumbnailHeight)
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Falha ao criar thumbnail'))
            }
          },
          'image/jpeg',
          storageConfig.imageProcessing.quality
        )
      }
      
      img.onerror = () => reject(new Error('Falha ao carregar imagem'))
      img.src = URL.createObjectURL(file)
    })
  },

  // Get storage usage for tenant
  async getStorageUsage(tenantId: string) {
    try {
      const [photos, thumbnails, logos, mockups] = await Promise.all([
        this.listFiles(storageConfig.buckets.photos, tenantId),
        this.listFiles(storageConfig.buckets.thumbnails, tenantId),
        this.listFiles(storageConfig.buckets.logos, tenantId),
        this.listFiles(storageConfig.buckets.mockups, tenantId)
      ])
      
      // Calculate total size (this is a simplified calculation)
      const totalFiles = [
        ...(photos || []),
        ...(thumbnails || []),
        ...(logos || []),
        ...(mockups || [])
      ].length
      
      return {
        totalFiles,
        buckets: {
          photos: photos?.length || 0,
          thumbnails: thumbnails?.length || 0,
          logos: logos?.length || 0,
          mockups: mockups?.length || 0
        }
      }
    } catch (error) {
      throw error
    }
  }
}

// Storage middleware
export const storageMiddleware = {
  // Check file size
  checkFileSize(file: File, type: keyof typeof storageConfig.limits) {
    return file.size <= storageConfig.limits[type]
  },

  // Check file type
  checkFileType(file: File, type: keyof typeof storageConfig.allowedTypes) {
    return storageConfig.allowedTypes[type].includes(file.type)
  },

  // Sanitize filename
  sanitizeFilename(filename: string) {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase()
  }
}

// Export all storage utilities
export default {
  config: storageConfig,
  utils: storageUtils,
  middleware: storageMiddleware
}
