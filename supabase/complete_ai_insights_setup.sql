-- Complete AI Insights Setup for Banking Analysis System
-- Run this in your Supabase SQL Editor to set up the AI insights storage system

-- ============================================================================
-- AI INSIGHTS TABLE
-- ============================================================================

-- Create AI insights table for storing generated insights
CREATE TABLE IF NOT EXISTS ai_insights (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    
    -- Insight data
    insights JSONB NOT NULL DEFAULT '[]', -- Array of insight objects
    summary JSONB NOT NULL DEFAULT '{}', -- Summary object with totalOpportunities, estimatedValue, topPriority
    
    -- Metadata
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Version tracking for regeneration
    data_version TEXT DEFAULT '1.0', -- Hash or version of client data when insights were generated
    
    UNIQUE(client_nric)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_insights_client ON ai_insights(client_nric);
CREATE INDEX IF NOT EXISTS idx_ai_insights_generated ON ai_insights(generated_at);

-- ============================================================================
-- TRIGGER FUNCTION FOR AUTO-UPDATING TIMESTAMP
-- ============================================================================

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_ai_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_updated
DROP TRIGGER IF EXISTS update_ai_insights_updated_at ON ai_insights;
CREATE TRIGGER update_ai_insights_updated_at
    BEFORE UPDATE ON ai_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_insights_updated_at();

-- ============================================================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- ============================================================================

-- Insert sample AI insights for testing (uncomment if needed)
/*
INSERT INTO ai_insights (client_nric, insights, summary) VALUES 
('123456789012', 
 '[{"text": "Client shows strong digital banking adoption with 85% of transactions through mobile app", "priority": "MEDIUM", "type": "digital_behavior", "estimatedValue": 5000}, {"text": "High credit card utilization at 78% indicates potential for debt consolidation products", "priority": "HIGH", "type": "credit_opportunity", "estimatedValue": 15000}]',
 '{"totalOpportunities": 2, "estimatedValue": 20000, "topPriority": "credit_opportunity"}'
) ON CONFLICT (client_nric) DO NOTHING;
*/

-- ============================================================================
-- UTILITY FUNCTIONS (OPTIONAL)
-- ============================================================================

-- Function to get insights for a client
CREATE OR REPLACE FUNCTION get_client_insights(client_nric_param TEXT)
RETURNS TABLE (
    insights JSONB,
    summary JSONB,
    generated_at TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ai.insights,
        ai.summary,
        ai.generated_at,
        ai.last_updated
    FROM ai_insights ai
    WHERE ai.client_nric = client_nric_param;
END;
$$ LANGUAGE plpgsql;

-- Function to check if insights exist for a client
CREATE OR REPLACE FUNCTION has_insights(client_nric_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    insight_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO insight_count
    FROM ai_insights
    WHERE client_nric = client_nric_param;
    
    RETURN insight_count > 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CLEANUP FUNCTION (OPTIONAL)
-- ============================================================================

-- Function to clean up old insights (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_insights()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM ai_insights
    WHERE generated_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if table was created successfully
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'ai_insights'
ORDER BY ordinal_position;

-- Check if indexes were created
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'ai_insights';

-- Check if triggers were created
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'ai_insights';

-- ============================================================================
-- USAGE EXAMPLES
-- ============================================================================

/*
-- Example: Insert insights for a client
INSERT INTO ai_insights (client_nric, insights, summary) VALUES 
('123456789012', 
 '[{"text": "High savings rate indicates potential for investment products", "priority": "HIGH", "type": "investment_opportunity", "estimatedValue": 25000}]',
 '{"totalOpportunities": 1, "estimatedValue": 25000, "topPriority": "investment_opportunity"}'
) ON CONFLICT (client_nric) 
DO UPDATE SET 
    insights = EXCLUDED.insights,
    summary = EXCLUDED.summary,
    data_version = EXCLUDED.data_version,
    last_updated = NOW();

-- Example: Get insights for a client
SELECT * FROM get_client_insights('123456789012');

-- Example: Check if client has insights
SELECT has_insights('123456789012');

-- Example: Clean up old insights
SELECT cleanup_old_insights();
*/ 