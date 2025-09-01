-- Database Triggers for PHOTOMANAGER V2
-- Multi-tenant SaaS for School Photography

-- ========================================
-- AUDIT TRIGGERS
-- ========================================

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    user_id UUID,
    tenant_id UUID,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id);

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    audit_row audit_logs;
    user_id UUID;
    tenant_id UUID;
BEGIN
    -- Get current user ID
    user_id := auth.uid();
    
    -- Get tenant ID from context or record
    IF TG_TABLE_NAME = 'tenants' THEN
        tenant_id := COALESCE(NEW.id, OLD.id);
    ELSIF TG_TABLE_NAME IN ('schools', 'events', 'products', 'orders') THEN
        tenant_id := COALESCE(NEW.tenant_id, OLD.tenant_id);
    ELSIF TG_TABLE_NAME = 'participants' THEN
        SELECT e.tenant_id INTO tenant_id 
        FROM events e 
        WHERE e.id = COALESCE(NEW.event_id, OLD.event_id);
    ELSIF TG_TABLE_NAME = 'photos' THEN
        SELECT e.tenant_id INTO tenant_id 
        FROM participants p 
        JOIN events e ON p.event_id = e.id 
        WHERE p.id = COALESCE(NEW.participant_id, OLD.participant_id);
    ELSIF TG_TABLE_NAME = 'order_items' THEN
        SELECT o.tenant_id INTO tenant_id 
        FROM orders o 
        WHERE o.id = COALESCE(NEW.order_id, OLD.order_id);
    END IF;
    
    -- Create audit row
    audit_row := ROW(
        gen_random_uuid(),
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
        user_id,
        tenant_id,
        NOW(),
        inet_client_addr(),
        current_setting('request.headers')::jsonb->>'user-agent'
    );
    
    INSERT INTO audit_logs VALUES (audit_row.*);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit triggers for all tables
CREATE TRIGGER audit_tenants_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tenants
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_schools_trigger
    AFTER INSERT OR UPDATE OR DELETE ON schools
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_events_trigger
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_participants_trigger
    AFTER INSERT OR UPDATE OR DELETE ON participants
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_photos_trigger
    AFTER INSERT OR UPDATE OR DELETE ON photos
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_products_trigger
    AFTER INSERT OR UPDATE OR DELETE ON products
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_orders_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_order_items_trigger
    AFTER INSERT OR UPDATE OR DELETE ON order_items
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- ========================================
-- DATA INTEGRITY TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers for tables that have this column
CREATE TRIGGER update_tenants_updated_at
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_updated_at
    BEFORE UPDATE ON participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- BUSINESS LOGIC TRIGGERS
-- ========================================

-- Function to validate event dates
CREATE OR REPLACE FUNCTION validate_event_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if event_end_date is after event_date
    IF NEW.event_end_date IS NOT NULL AND NEW.event_date IS NOT NULL THEN
        IF NEW.event_end_date <= NEW.event_date THEN
            RAISE EXCEPTION 'Data de fim do evento deve ser posterior à data de início';
        END IF;
    END IF;
    
    -- Check if event date is not in the past (allow past dates for historical data)
    -- IF NEW.event_date < CURRENT_DATE THEN
    --     RAISE EXCEPTION 'Data do evento não pode ser no passado';
    -- END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create event date validation trigger
CREATE TRIGGER validate_event_dates_trigger
    BEFORE INSERT OR UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION validate_event_dates();

-- Function to validate participant QR code uniqueness
CREATE OR REPLACE FUNCTION validate_qr_code_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if QR code already exists
    IF EXISTS (
        SELECT 1 FROM participants 
        WHERE qr_code = NEW.qr_code 
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'Código QR já existe';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create QR code validation trigger
CREATE TRIGGER validate_qr_code_uniqueness_trigger
    BEFORE INSERT OR UPDATE ON participants
    FOR EACH ROW EXECUTE FUNCTION validate_qr_code_uniqueness();

-- Function to validate order amounts
CREATE OR REPLACE FUNCTION validate_order_amounts()
RETURNS TRIGGER AS $$
DECLARE
    calculated_total DECIMAL(10,2);
BEGIN
    -- Calculate total from order items
    SELECT COALESCE(SUM(unit_price * quantity), 0)
    INTO calculated_total
    FROM order_items
    WHERE order_id = NEW.id;
    
    -- Validate total amount
    IF ABS(NEW.total_amount - calculated_total) > 0.01 THEN
        RAISE EXCEPTION 'Valor total do pedido não corresponde aos itens (esperado: %, atual: %)', 
            calculated_total, NEW.total_amount;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create order amount validation trigger
CREATE TRIGGER validate_order_amounts_trigger
    AFTER INSERT OR UPDATE ON order_items
    FOR EACH ROW EXECUTE FUNCTION validate_order_amounts();

-- ========================================
-- PERFORMANCE TRIGGERS
-- ========================================

-- Function to update participant count in events
CREATE OR REPLACE FUNCTION update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment participant count
        UPDATE events 
        SET participant_count = COALESCE(participant_count, 0) + 1
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement participant count
        UPDATE events 
        SET participant_count = GREATEST(COALESCE(participant_count, 0) - 1, 0)
        WHERE id = OLD.event_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.event_id != NEW.event_id THEN
        -- Decrement old event count
        UPDATE events 
        SET participant_count = GREATEST(COALESCE(participant_count, 0) - 1, 0)
        WHERE id = OLD.event_id;
        -- Increment new event count
        UPDATE events 
        SET participant_count = COALESCE(participant_count, 0) + 1
        WHERE id = NEW.event_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create participant count trigger
CREATE TRIGGER update_event_participant_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON participants
    FOR EACH ROW EXECUTE FUNCTION update_event_participant_count();

-- Function to update school event count
CREATE OR REPLACE FUNCTION update_school_event_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment event count
        UPDATE schools 
        SET event_count = COALESCE(event_count, 0) + 1
        WHERE id = NEW.school_id;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement event count
        UPDATE schools 
        SET event_count = GREATEST(COALESCE(event_count, 0) - 1, 0)
        WHERE id = OLD.school_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.school_id != NEW.school_id THEN
        -- Decrement old school count
        UPDATE schools 
        SET event_count = GREATEST(COALESCE(event_count, 0) - 1, 0)
        WHERE id = OLD.school_id;
        -- Increment new school count
        UPDATE schools 
        SET event_count = COALESCE(event_count, 0) + 1
        WHERE id = NEW.school_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create school event count trigger
CREATE TRIGGER update_school_event_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW EXECUTE FUNCTION update_school_event_count();

-- ========================================
-- NOTIFICATION TRIGGERS
-- ========================================

-- Function to send notifications (placeholder for future implementation)
CREATE OR REPLACE FUNCTION send_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- This is a placeholder for future notification system
    -- Could integrate with email, SMS, or push notifications
    
    -- Example: Log notification event
    INSERT INTO audit_logs (
        table_name, 
        record_id, 
        operation, 
        new_data, 
        user_id, 
        tenant_id
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        'NOTIFICATION',
        jsonb_build_object(
            'message', 'Notification sent for ' || TG_TABLE_NAME,
            'operation', TG_OP
        ),
        auth.uid(),
        CASE 
            WHEN TG_TABLE_NAME = 'tenants' THEN COALESCE(NEW.id, OLD.id)
            WHEN TG_TABLE_NAME IN ('schools', 'events', 'products', 'orders') THEN COALESCE(NEW.tenant_id, OLD.tenant_id)
            ELSE NULL
        END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create notification triggers for important operations
CREATE TRIGGER send_notification_tenant_trigger
    AFTER INSERT OR UPDATE ON tenants
    FOR EACH ROW EXECUTE FUNCTION send_notification();

CREATE TRIGGER send_notification_order_trigger
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION send_notification();

-- ========================================
-- CLEANUP TRIGGERS
-- ========================================

-- Function to cleanup soft-deleted records (if implementing soft delete)
CREATE OR REPLACE FUNCTION cleanup_soft_deleted_records()
RETURNS TRIGGER AS $$
BEGIN
    -- This is a placeholder for soft delete cleanup
    -- Could archive or permanently delete old records
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- GRANT PERMISSIONS
-- ========================================

-- Grant permissions for audit functions
GRANT EXECUTE ON FUNCTION audit_trigger_function() TO authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION validate_event_dates() TO authenticated;
GRANT EXECUTE ON FUNCTION validate_qr_code_uniqueness() TO authenticated;
GRANT EXECUTE ON FUNCTION validate_order_amounts() TO authenticated;
GRANT EXECUTE ON FUNCTION update_event_participant_count() TO authenticated;
GRANT EXECUTE ON FUNCTION update_school_event_count() TO authenticated;
GRANT EXECUTE ON FUNCTION send_notification() TO authenticated;

-- Grant permissions on audit_logs table
GRANT SELECT ON audit_logs TO authenticated;
GRANT INSERT ON audit_logs TO authenticated;

-- ========================================
-- COMMENTS
-- ========================================

COMMENT ON TABLE audit_logs IS 'Audit trail for all database operations';
COMMENT ON FUNCTION audit_trigger_function() IS 'Main audit trigger function';
COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically update updated_at timestamp';
COMMENT ON FUNCTION validate_event_dates() IS 'Validate event date logic';
COMMENT ON FUNCTION validate_qr_code_uniqueness() IS 'Ensure QR code uniqueness';
COMMENT ON FUNCTION validate_order_amounts() IS 'Validate order total amounts';
COMMENT ON FUNCTION update_event_participant_count() IS 'Maintain participant count in events';
COMMENT ON FUNCTION update_school_event_count() IS 'Maintain event count in schools';
COMMENT ON FUNCTION send_notification() IS 'Send notifications for important events';
