-- Additional Performance Indexes for PHOTOMANAGER V2
-- Multi-tenant SaaS for School Photography

-- ========================================
-- COMPOSITE INDEXES FOR COMMON QUERIES
-- ========================================

-- Tenant-based queries
CREATE INDEX IF NOT EXISTS idx_tenants_active_slug ON tenants(active, slug);
CREATE INDEX IF NOT EXISTS idx_tenants_plan_active ON tenants(plan, active);
CREATE INDEX IF NOT EXISTS idx_tenants_email_active ON tenants(email, active);

-- School-based queries
CREATE INDEX IF NOT EXISTS idx_schools_tenant_active ON schools(tenant_id, active);
CREATE INDEX IF NOT EXISTS idx_schools_tenant_slug_active ON schools(tenant_id, slug, active);
CREATE INDEX IF NOT EXISTS idx_schools_type_active ON schools(type, active);
-- Removido: CREATE INDEX IF NOT EXISTS idx_schools_city_state ON schools(city, state);
-- A tabela schools não tem colunas city/state no schema atual

-- Event-based queries
CREATE INDEX IF NOT EXISTS idx_events_tenant_school_status ON events(tenant_id, school_id, status);
CREATE INDEX IF NOT EXISTS idx_events_school_date ON events(school_id, event_date);
CREATE INDEX IF NOT EXISTS idx_events_tenant_status ON events(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_events_date_range ON events(event_date, event_end_date);
CREATE INDEX IF NOT EXISTS idx_events_commission ON events(commission_percent);

-- Participant-based queries
CREATE INDEX IF NOT EXISTS idx_participants_event_class ON participants(event_id, class);
CREATE INDEX IF NOT EXISTS idx_participants_qr_active ON participants(qr_code, event_id);
CREATE INDEX IF NOT EXISTS idx_participants_name_event ON participants(name, event_id);

-- Photo-based queries
CREATE INDEX IF NOT EXISTS idx_photos_participant_upload ON photos(participant_id, uploaded_at);
CREATE INDEX IF NOT EXISTS idx_photos_filename ON photos(filename);
CREATE INDEX IF NOT EXISTS idx_photos_size ON photos(file_size);

-- Product-based queries
CREATE INDEX IF NOT EXISTS idx_products_tenant_category ON products(tenant_id, category, active);
CREATE INDEX IF NOT EXISTS idx_products_price_range ON products(price, active);
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products(category, active);

-- Order-based queries
CREATE INDEX IF NOT EXISTS idx_orders_tenant_status ON orders(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_email ON orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_orders_date_status ON orders(created_at, status);
CREATE INDEX IF NOT EXISTS idx_orders_amount_range ON orders(total_amount);
CREATE INDEX IF NOT EXISTS idx_orders_participant ON orders(participant_id);

-- Order items queries
CREATE INDEX IF NOT EXISTS idx_order_items_order_product ON order_items(order_id, product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_photo ON order_items(photo_id);

-- ========================================
-- FULL-TEXT SEARCH INDEXES
-- ========================================

-- Enable full-text search on relevant text fields
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE events ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create GIN indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_tenants_search ON tenants USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_schools_search ON schools USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_events_search ON events USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_participants_search ON participants USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING GIN(search_vector);

-- ========================================
-- PARTIAL INDEXES FOR OPTIMIZATION
-- ========================================

-- Index only active records
CREATE INDEX IF NOT EXISTS idx_schools_active_partial ON schools(tenant_id, name) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_events_active_partial ON events(tenant_id, school_id) WHERE status != 'completed';
CREATE INDEX IF NOT EXISTS idx_products_active_partial ON products(tenant_id, category) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_orders_pending_partial ON orders(tenant_id, created_at) WHERE status = 'pending';

-- Index only recent records
CREATE INDEX IF NOT EXISTS idx_photos_recent_partial ON photos(participant_id, uploaded_at) WHERE uploaded_at > NOW() - INTERVAL '1 year';
CREATE INDEX IF NOT EXISTS idx_orders_recent_partial ON orders(tenant_id, created_at) WHERE created_at > NOW() - INTERVAL '1 year';

-- ========================================
-- FUNCTIONAL INDEXES
-- ========================================

-- Index on lowercase email for case-insensitive searches
CREATE INDEX IF NOT EXISTS idx_tenants_email_lower ON tenants(LOWER(email));

-- Index on slug for URL routing
CREATE INDEX IF NOT EXISTS idx_tenants_slug_lower ON tenants(LOWER(slug));
CREATE INDEX IF NOT EXISTS idx_schools_slug_lower ON schools(LOWER(slug));

-- Index on date parts for date-based queries
CREATE INDEX IF NOT EXISTS idx_events_year_month ON events(EXTRACT(YEAR FROM event_date), EXTRACT(MONTH FROM event_date));
CREATE INDEX IF NOT EXISTS idx_orders_year_month ON orders(EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at));

-- ========================================
-- COVERING INDEXES FOR COMMON SELECTS
-- ========================================

-- Covering index for tenant profile queries
CREATE INDEX IF NOT EXISTS idx_tenants_profile ON tenants(id, name, email, plan, active, logo_url, slug);

-- Covering index for school list queries
CREATE INDEX IF NOT EXISTS idx_schools_list ON schools(tenant_id, id, name, type, students_count, active, slug);

-- Covering index for event list queries
CREATE INDEX IF NOT EXISTS idx_events_list ON events(tenant_id, school_id, id, name, event_date, status, commission_percent);

-- Covering index for participant list queries
CREATE INDEX IF NOT EXISTS idx_participants_list ON participants(event_id, id, name, class, qr_code);

-- Covering index for product catalog queries
CREATE INDEX IF NOT EXISTS idx_products_catalog ON products(tenant_id, id, name, price, category, active);

-- ========================================
-- STATISTICS AND ANALYTICS INDEXES
-- ========================================

-- Indexes for reporting queries
CREATE INDEX IF NOT EXISTS idx_orders_monthly_stats ON orders(tenant_id, DATE_TRUNC('month', created_at), status, total_amount);
CREATE INDEX IF NOT EXISTS idx_events_monthly_stats ON events(tenant_id, DATE_TRUNC('month', event_date), status);
CREATE INDEX IF NOT EXISTS idx_photos_monthly_stats ON photos(uploaded_at) WHERE uploaded_at > NOW() - INTERVAL '1 year';

-- ========================================
-- INDEX MAINTENANCE
-- ========================================

-- Function to analyze table statistics
CREATE OR REPLACE FUNCTION analyze_table_stats()
RETURNS VOID AS $$
BEGIN
    ANALYZE tenants;
    ANALYZE schools;
    ANALYZE events;
    ANALYZE participants;
    ANALYZE photos;
    ANALYZE products;
    ANALYZE orders;
    ANALYZE order_items;
    -- Removido: ANALYZE audit_logs; -- Tabela pode não existir ainda
END;
$$ LANGUAGE plpgsql;

-- Function to get index usage statistics
CREATE OR REPLACE FUNCTION get_index_usage_stats()
RETURNS TABLE (
    table_name TEXT,
    index_name TEXT,
    index_scans BIGINT,
    index_tuples_read BIGINT,
    index_tuples_fetched BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname::TEXT,
        indexname::TEXT,
        idx_scan::BIGINT,
        idx_tup_read::BIGINT,
        idx_tup_fetch::BIGINT
    FROM pg_stat_user_indexes
    WHERE schemaname = 'public'
    ORDER BY idx_scan DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get table statistics
CREATE OR REPLACE FUNCTION get_table_stats()
RETURNS TABLE (
    table_name TEXT,
    total_rows BIGINT,
    total_size TEXT,
    index_size TEXT,
    table_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::TEXT,
        t.n_tup_ins + t.n_tup_upd + t.n_tup_del::BIGINT as total_rows,
        pg_size_pretty(pg_total_relation_size(c.oid))::TEXT as total_size,
        pg_size_pretty(pg_indexes_size(c.oid))::TEXT as index_size,
        pg_size_pretty(pg_relation_size(c.oid))::TEXT as table_size
    FROM pg_stat_user_tables t
    JOIN pg_class c ON c.relname = t.relname
    WHERE t.schemaname = 'public'
    ORDER BY pg_total_relation_size(c.oid) DESC;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- GRANT PERMISSIONS
-- ========================================

-- Grant permissions for maintenance functions
GRANT EXECUTE ON FUNCTION analyze_table_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_index_usage_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_stats() TO authenticated;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON FUNCTION analyze_table_stats() IS 'Analyze table statistics for query optimization';
COMMENT ON FUNCTION get_index_usage_stats() IS 'Get index usage statistics for performance monitoring';
COMMENT ON FUNCTION get_table_stats() IS 'Get table size and row count statistics';

-- ========================================
-- INDEX CREATION NOTES
-- ========================================

-- These indexes are designed for:
-- 1. Multi-tenant queries (tenant_id filters)
-- 2. Common filtering operations (status, active, dates)
-- 3. Full-text search capabilities
-- 4. Reporting and analytics queries
-- 5. URL routing (slug-based queries)
-- 6. Performance monitoring and maintenance

-- Monitor index usage with:
-- SELECT * FROM get_index_usage_stats();
-- SELECT * FROM get_table_stats();

-- Regular maintenance:
-- SELECT analyze_table_stats();
