-- AI Insights Table for storing generated insights
-- Run this in your Supabase SQL Editor

-- Create AI insights table
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_ai_insights_client ON ai_insights(client_nric);
CREATE INDEX IF NOT EXISTS idx_ai_insights_generated ON ai_insights(generated_at);

-- Add RLS (Row Level Security) policies if needed
-- ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_ai_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_updated
CREATE TRIGGER update_ai_insights_updated_at
    BEFORE UPDATE ON ai_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_insights_updated_at();

-- Insert sample data (optional - for testing)
-- INSERT INTO ai_insights (client_nric, insights, summary) VALUES 
-- ('123456789012', 
--  '[{"text": "Client shows strong digital banking adoption with 85% of transactions through mobile app", "priority": "MEDIUM", "type": "digital_behavior", "estimatedValue": 5000}, {"text": "High credit card utilization at 78% indicates potential for debt consolidation products", "priority": "HIGH", "type": "credit_opportunity", "estimatedValue": 15000}]',
--  '{"totalOpportunities": 2, "estimatedValue": 20000, "topPriority": "credit_opportunity"}'
-- ); 