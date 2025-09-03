import { supabase } from '@/lib/supabase-config'

// Storage configuration
export const storageConfig = {
  // Bucket names
  buckets: {
    photos: 'photos',
    thumbnails: 'thumbnails',
    avatars: 'avatars'
  },

  // File size limits (in bytes)
  limits: {
    photo: 10 * 1024 * 1024, // 10MB
    thumbnail: 1 * 1024 * 1024, // 1MB
    avatar: 2 * 1024 * 1024 // 2MB
  },

  // Allowed file types
  allowedTypes: {
    photos: ['image/jpeg', 'image/png', 'image/webp'],
    thumbnails: ['image/jpeg', 'image/png', 'image/webp'],
    avatars: ['image/jpeg', 'image/png', 'image/webp']
  }
}

// Storage utilities
export const storageUtils = {
  // Upload file to storage
  async uploadFile(bucket: string, path: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Error uploading file:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in uploadFile:', error)
      throw error
    }
  },

  // Download file from storage
  async downloadFile(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path)

      if (error) {
        console.error('Error downloading file:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in downloadFile:', error)
      throw error
    }
  },

  // Delete file from storage
  async deleteFile(bucket: string, path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path])

      if (error) {
        console.error('Error deleting file:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in deleteFile:', error)
      throw error
    }
  },

  // List files in bucket
  async listFiles(bucket: string, path?: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path || '')

      if (error) {
        console.error('Error listing files:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in listFiles:', error)
      throw error
    }
  },

  // Get file info
  async getFileInfo(bucket: string, path: string) {
    try {
      const { data } = await supabase.storage
        .from(bucket)
        .getPublicUrl(path)

      return {
        publicUrl: data.publicUrl,
        path: path,
        bucket: bucket
      }
    } catch (error) {
      console.error('Error in getFileInfo:', error)
      throw error
    }
  },

  // Create signed URL for private files
  async createSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (error) {
        console.error('Error creating signed URL:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error in createSignedUrl:', error)
      throw error
    }
  }
}

// Photo-specific utilities
export const photoUtils = {
  // Upload photo
  async uploadPhoto(file: File, participantId: string) {
    const fileName = `${participantId}/${Date.now()}-${file.name}`
    const path = `photos/${fileName}`

    try {
      const data = await storageUtils.uploadFile(storageConfig.buckets.photos, path, file)
      
      return {
        ...data,
        path: path,
        fileName: fileName,
        participantId: participantId
      }
    } catch (error) {
      console.error('Error uploading photo:', error)
      throw error
    }
  },

  // Generate thumbnail
  async generateThumbnail(file: File, participantId: string) {
    const fileName = `${participantId}/thumb-${Date.now()}-${file.name}`
    const path = `thumbnails/${fileName}`

    try {
      // Create thumbnail (you might want to use a library like sharp for this)
      const thumbnailFile = file // For now, just use the original file
      
      const data = await storageUtils.uploadFile(storageConfig.buckets.thumbnails, path, thumbnailFile)
      
      return {
        ...data,
        path: path,
        fileName: fileName,
        participantId: participantId
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error)
      throw error
    }
  },

  // Get photo URL
  async getPhotoUrl(path: string) {
    try {
      const fileInfo = await storageUtils.getFileInfo(storageConfig.buckets.photos, path)
      return fileInfo.publicUrl
    } catch (error) {
      console.error('Error getting photo URL:', error)
      throw error
    }
  },

  // Get thumbnail URL
  async getThumbnailUrl(path: string) {
    try {
      const fileInfo = await storageUtils.getFileInfo(storageConfig.buckets.thumbnails, path)
      return fileInfo.publicUrl
    } catch (error) {
      console.error('Error getting thumbnail URL:', error)
      throw error
    }
  },

  // Delete photo and thumbnail
  async deletePhoto(photoPath: string, thumbnailPath?: string) {
    try {
      await storageUtils.deleteFile(storageConfig.buckets.photos, photoPath)
      
      if (thumbnailPath) {
        await storageUtils.deleteFile(storageConfig.buckets.thumbnails, thumbnailPath)
      }
      
      return true
    } catch (error) {
      console.error('Error deleting photo:', error)
      throw error
    }
  }
}

// Avatar utilities
export const avatarUtils = {
  // Upload avatar
  async uploadAvatar(file: File, userId: string) {
    const fileName = `${userId}-${Date.now()}-${file.name}`
    const path = `avatars/${fileName}`

    try {
      const data = await storageUtils.uploadFile(storageConfig.buckets.avatars, path, file)
      
      return {
        ...data,
        path: path,
        fileName: fileName,
        userId: userId
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  },

  // Get avatar URL
  async getAvatarUrl(path: string) {
    try {
      const fileInfo = await storageUtils.getFileInfo(storageConfig.buckets.avatars, path)
      return fileInfo.publicUrl
    } catch (error) {
      console.error('Error getting avatar URL:', error)
      throw error
    }
  },

  // Delete avatar
  async deleteAvatar(path: string) {
    try {
      await storageUtils.deleteFile(storageConfig.buckets.avatars, path)
      return true
    } catch (error) {
      console.error('Error deleting avatar:', error)
      throw error
    }
  }
}

// Validation utilities
export const validationUtils = {
  // Validate file size
  validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize
  },

  // Validate file type
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type)
  },

  // Validate photo file
  validatePhotoFile(file: File): { isValid: boolean; error?: string } {
    if (!validationUtils.validateFileSize(file, storageConfig.limits.photo)) {
      return {
        isValid: false,
        error: `File size must be less than ${storageConfig.limits.photo / (1024 * 1024)}MB`
      }
    }

    if (!validationUtils.validateFileType(file, storageConfig.allowedTypes.photos)) {
      return {
        isValid: false,
        error: 'File type not allowed. Please use JPEG, PNG, or WebP'
      }
    }

    return { isValid: true }
  },

  // Validate avatar file
  validateAvatarFile(file: File): { isValid: boolean; error?: string } {
    if (!validationUtils.validateFileSize(file, storageConfig.limits.avatar)) {
      return {
        isValid: false,
        error: `File size must be less than ${storageConfig.limits.avatar / (1024 * 1024)}MB`
      }
    }

    if (!validationUtils.validateFileType(file, storageConfig.allowedTypes.avatars)) {
      return {
        isValid: false,
        error: 'File type not allowed. Please use JPEG, PNG, or WebP'
      }
    }

    return { isValid: true }
  }
}

// Export default configuration
const storageConfiguration = {
  config: storageConfig,
  utils: storageUtils,
  photo: photoUtils,
  avatar: avatarUtils,
  // schoolImage: schoolImageUtils, // TODO: Implement schoolImageUtils
  validation: validationUtils
}

export default storageConfiguration