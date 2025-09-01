-- Storage Buckets Configuration for PHOTOMANAGER V2
-- Multi-tenant SaaS for School Photography

-- Create storage buckets (execute como service_role)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('photos', 'photos', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('thumbnails', 'thumbnails', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']),
  ('mockups', 'mockups', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- STORAGE POLICIES (Execute como service_role)
-- ========================================

-- Configure bucket policies for photos
CREATE POLICY "Public can view photos" ON storage.objects
    FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'photos' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own photos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own photos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'photos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Configure bucket policies for thumbnails
CREATE POLICY "Public can view thumbnails" ON storage.objects
    FOR SELECT USING (bucket_id = 'thumbnails');

CREATE POLICY "Authenticated users can upload thumbnails" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'thumbnails' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own thumbnails" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'thumbnails' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own thumbnails" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'thumbnails' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Configure bucket policies for logos
CREATE POLICY "Public can view logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Authenticated users can upload logos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'logos' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can update own logos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'logos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own logos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'logos' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Configure bucket policies for mockups
CREATE POLICY "Public can view mockups" ON storage.objects
    FOR SELECT USING (bucket_id = 'mockups');

CREATE POLICY "Authenticated users can upload mockups" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'mockups' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own mockups" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'mockups' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own mockups" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'mockups' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ========================================
-- STORAGE UTILITY FUNCTIONS
-- ========================================

-- Create function to get storage usage for tenant
CREATE OR REPLACE FUNCTION get_tenant_storage_usage(tenant_id UUID)
RETURNS TABLE (
    bucket_name TEXT,
    file_count BIGINT,
    total_size BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.name::TEXT as bucket_name,
        COUNT(o.id)::BIGINT as file_count,
        COALESCE(SUM(o.metadata->>'size')::BIGINT, 0) as total_size
    FROM storage.buckets b
    LEFT JOIN storage.objects o ON b.id = o.bucket_id 
        AND o.name LIKE tenant_id::TEXT || '/%'
    WHERE b.id IN ('photos', 'thumbnails', 'logos', 'mockups')
    GROUP BY b.id, b.name
    ORDER BY b.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get file metadata
CREATE OR REPLACE FUNCTION get_file_metadata(file_path TEXT, bucket_name TEXT)
RETURNS JSONB AS $$
DECLARE
    file_metadata JSONB;
BEGIN
    SELECT 
        jsonb_build_object(
            'id', o.id,
            'name', o.name,
            'bucket_id', o.bucket_id,
            'size', o.metadata->>'size',
            'mime_type', o.metadata->>'mimetype',
            'created_at', o.created_at,
            'updated_at', o.updated_at,
            'public_url', storage.get_public_url(bucket_name, o.name)->>'publicUrl'
        )
    INTO file_metadata
    FROM storage.objects o
    WHERE o.name = file_path AND o.bucket_id = bucket_name;
    
    RETURN file_metadata;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- PERMISSIONS
-- ========================================

-- Grant permissions for storage functions
GRANT EXECUTE ON FUNCTION get_tenant_storage_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_file_metadata(TEXT, TEXT) TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name ON storage.objects(bucket_id, name);
CREATE INDEX IF NOT EXISTS idx_storage_objects_tenant ON storage.objects(name) WHERE name LIKE '%/%';

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON FUNCTION get_tenant_storage_usage(UUID) IS 'Get storage usage statistics for a specific tenant';
COMMENT ON FUNCTION get_file_metadata(TEXT, TEXT) IS 'Get metadata for a specific file in storage';

-- ========================================
-- EXECUTION NOTES
-- ========================================

-- IMPORTANTE: Execute este script como service_role no Supabase
-- 1. Vá para SQL Editor no Supabase Dashboard
-- 2. Selecione "service_role" no dropdown de role
-- 3. Execute o script completo

-- Alternativamente, execute apenas a criação dos buckets:
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES ('photos', 'photos', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

-- As políticas podem ser criadas posteriormente via Dashboard ou como service_role
