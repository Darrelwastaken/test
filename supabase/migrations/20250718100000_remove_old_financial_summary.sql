-- Remove old financial_summary table
-- This table is being replaced by the new comprehensive financial summary tables:
-- - financial_assets
-- - relationship_profitability
-- - credit_utilization
-- - risk_indicators
-- - financial_trends
-- - asset_utilization
-- - emergency_fund_analysis

-- Drop the old financial_summary table
DROP TABLE IF EXISTS financial_summary CASCADE;

-- Remove any references to the old table
-- (No foreign key constraints to remove since it was a standalone table) 