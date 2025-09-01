-- Row Level Security (RLS) Policies for PHOTOMANAGER V2
-- Multi-tenant SaaS for School Photography

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ========================================
-- TENANTS TABLE POLICIES
-- ========================================

-- Public read access to active tenants (for public pages)
CREATE POLICY "Public can view active tenants" ON tenants
    FOR SELECT USING (active = true);

-- Tenants can read their own data
CREATE POLICY "Tenants can view own data" ON tenants
    FOR SELECT USING (auth.uid()::text = id::text);

-- Tenants can update their own data
CREATE POLICY "Tenants can update own data" ON tenants
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Service role can manage all tenants (for admin operations)
CREATE POLICY "Service role can manage tenants" ON tenants
    FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- SCHOOLS TABLE POLICIES
-- ========================================

-- Public read access to active schools (for public pages)
CREATE POLICY "Public can view active schools" ON schools
    FOR SELECT USING (active = true);

-- Tenants can view schools they own
CREATE POLICY "Tenants can view own schools" ON schools
    FOR SELECT USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can insert schools
CREATE POLICY "Tenants can create schools" ON schools
    FOR INSERT WITH CHECK (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can update their schools
CREATE POLICY "Tenants can update own schools" ON schools
    FOR UPDATE USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can delete their schools
CREATE POLICY "Tenants can delete own schools" ON schools
    FOR DELETE USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- ========================================
-- EVENTS TABLE POLICIES
-- ========================================

-- Public read access to active events (for public pages)
CREATE POLICY "Public can view active events" ON events
    FOR SELECT USING (
        school_id IN (
            SELECT id FROM schools WHERE active = true
        )
    );

-- Tenants can view events from their schools
CREATE POLICY "Tenants can view own events" ON events
    FOR SELECT USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can create events in their schools
CREATE POLICY "Tenants can create events" ON events
    FOR INSERT WITH CHECK (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can update their events
CREATE POLICY "Tenants can update own events" ON events
    FOR UPDATE USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can delete their events
CREATE POLICY "Tenants can delete own events" ON events
    FOR DELETE USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- ========================================
-- PARTICIPANTS TABLE POLICIES
-- ========================================

-- Public read access to participants (for QR code lookup)
CREATE POLICY "Public can view participants" ON participants
    FOR SELECT USING (
        event_id IN (
            SELECT id FROM events 
            WHERE school_id IN (
                SELECT id FROM schools WHERE active = true
            )
        )
    );

-- Tenants can view participants from their events
CREATE POLICY "Tenants can view own participants" ON participants
    FOR SELECT USING (
        event_id IN (
            SELECT id FROM events 
            WHERE tenant_id IN (
                SELECT id FROM tenants 
                WHERE id::text = auth.uid()::text
            )
        )
    );

-- Tenants can create participants in their events
CREATE POLICY "Tenants can create participants" ON participants
    FOR INSERT WITH CHECK (
        event_id IN (
            SELECT id FROM events 
            WHERE tenant_id IN (
                SELECT id FROM tenants 
                WHERE id::text = auth.uid()::text
            )
        )
    );

-- Tenants can update their participants
CREATE POLICY "Tenants can update own participants" ON participants
    FOR UPDATE USING (
        event_id IN (
            SELECT id FROM events 
            WHERE tenant_id IN (
                SELECT id FROM tenants 
                WHERE id::text = auth.uid()::text
            )
        )
    );

-- Tenants can delete their participants
CREATE POLICY "Tenants can delete own participants" ON participants
    FOR DELETE USING (
        event_id IN (
            SELECT id FROM events 
            WHERE tenant_id IN (
                SELECT id FROM tenants 
                WHERE id::text = auth.uid()::text
            )
        )
    );

-- ========================================
-- PHOTOS TABLE POLICIES
-- ========================================

-- Public read access to photos (for public galleries)
CREATE POLICY "Public can view photos" ON photos
    FOR SELECT USING (
        participant_id IN (
            SELECT id FROM participants 
            WHERE event_id IN (
                SELECT id FROM events 
                WHERE school_id IN (
                    SELECT id FROM schools WHERE active = true
                )
            )
        )
    );

-- Tenants can view photos from their participants
CREATE POLICY "Tenants can view own photos" ON photos
    FOR SELECT USING (
        participant_id IN (
            SELECT id FROM participants 
            WHERE event_id IN (
                SELECT id FROM events 
                WHERE tenant_id IN (
                    SELECT id FROM tenants 
                    WHERE id::text = auth.uid()::text
                )
            )
        )
    );

-- Tenants can upload photos for their participants
CREATE POLICY "Tenants can create photos" ON photos
    FOR INSERT WITH CHECK (
        participant_id IN (
            SELECT id FROM participants 
            WHERE event_id IN (
                SELECT id FROM events 
                WHERE tenant_id IN (
                    SELECT id FROM tenants 
                    WHERE id::text = auth.uid()::text
                )
            )
        )
    );

-- Tenants can update their photos
CREATE POLICY "Tenants can update own photos" ON photos
    FOR UPDATE USING (
        participant_id IN (
            SELECT id FROM participants 
            WHERE event_id IN (
                SELECT id FROM events 
                WHERE tenant_id IN (
                    SELECT id FROM tenants 
                    WHERE id::text = auth.uid()::text
                )
            )
        )
    );

-- Tenants can delete their photos
CREATE POLICY "Tenants can delete own photos" ON photos
    FOR DELETE USING (
        participant_id IN (
            SELECT id FROM participants 
            WHERE event_id IN (
                SELECT id FROM events 
                WHERE tenant_id IN (
                    SELECT id FROM tenants 
                    WHERE id::text = auth.uid()::text
                )
            )
        )
    );

-- ========================================
-- PRODUCTS TABLE POLICIES
-- ========================================

-- Public read access to active products (for e-commerce)
CREATE POLICY "Public can view active products" ON products
    FOR SELECT USING (active = true);

-- Tenants can view their products
CREATE POLICY "Tenants can view own products" ON products
    FOR SELECT USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can create products
CREATE POLICY "Tenants can create products" ON products
    FOR INSERT WITH CHECK (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can update their products
CREATE POLICY "Tenants can update own products" ON products
    FOR UPDATE USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can delete their products
CREATE POLICY "Tenants can delete own products" ON products
    FOR DELETE USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- ========================================
-- ORDERS TABLE POLICIES
-- ========================================

-- Public can create orders (for e-commerce)
CREATE POLICY "Public can create orders" ON orders
    FOR INSERT WITH CHECK (true);

-- Public can view their own orders
CREATE POLICY "Public can view own orders" ON orders
    FOR SELECT USING (
        buyer_email = auth.jwt() ->> 'email' OR
        buyer_email IN (
            SELECT email FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can view orders from their events
CREATE POLICY "Tenants can view own orders" ON orders
    FOR SELECT USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- Tenants can update order status
CREATE POLICY "Tenants can update own orders" ON orders
    FOR UPDATE USING (
        tenant_id IN (
            SELECT id FROM tenants 
            WHERE id::text = auth.uid()::text
        )
    );

-- ========================================
-- ORDER_ITEMS TABLE POLICIES
-- ========================================

-- Public can view order items for their orders
CREATE POLICY "Public can view own order items" ON order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE buyer_email = auth.jwt() ->> 'email'
        )
    );

-- Tenants can view order items from their orders
CREATE POLICY "Tenants can view own order items" ON order_items
    FOR SELECT USING (
        order_id IN (
            SELECT id FROM orders 
            WHERE tenant_id IN (
                SELECT id FROM tenants 
                WHERE id::text = auth.uid()::text
            )
        )
    );

-- Public can create order items
CREATE POLICY "Public can create order items" ON order_items
    FOR INSERT WITH CHECK (true);

-- ========================================
-- FUNCTION TO GET CURRENT TENANT ID
-- ========================================

CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid()::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- FUNCTION TO CHECK TENANT ACCESS
-- ========================================

CREATE OR REPLACE FUNCTION check_tenant_access(table_name TEXT, record_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    tenant_id UUID;
BEGIN
    -- Get tenant ID from the record
    EXECUTE format('SELECT tenant_id FROM %I WHERE id = $1', table_name)
    INTO tenant_id
    USING record_id;
    
    -- Check if current user has access to this tenant
    RETURN tenant_id = get_current_tenant_id();
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- GRANT PERMISSIONS
-- ========================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant permissions on sequences
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE tenants IS 'Photographer accounts and tenant information';
COMMENT ON TABLE schools IS 'Schools managed by tenants';
COMMENT ON TABLE events IS 'Photo session events';
COMMENT ON TABLE participants IS 'Students participating in events';
COMMENT ON TABLE photos IS 'Photos linked to participants';
COMMENT ON TABLE products IS 'Customizable products for sale';
COMMENT ON TABLE orders IS 'E-commerce transactions';
COMMENT ON TABLE order_items IS 'Individual items in orders';

COMMENT ON FUNCTION get_current_tenant_id() IS 'Get current user tenant ID for RLS policies';
COMMENT ON FUNCTION check_tenant_access(TEXT, UUID) IS 'Check if user has access to tenant data';
