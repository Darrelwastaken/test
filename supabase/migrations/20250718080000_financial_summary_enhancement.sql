-- Enhanced Financial Summary Tables
-- This migration adds comprehensive financial data tables for the Financial Summary page

-- Financial assets table
CREATE TABLE financial_assets (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    total_assets NUMERIC NOT NULL DEFAULT 0,
    total_liabilities NUMERIC NOT NULL DEFAULT 0,
    net_position NUMERIC NOT NULL DEFAULT 0,
    casa_balance NUMERIC NOT NULL DEFAULT 0,
    fixed_deposits NUMERIC NOT NULL DEFAULT 0,
    investment_funds NUMERIC NOT NULL DEFAULT 0,
    insurance_policies NUMERIC NOT NULL DEFAULT 0,
    other_assets NUMERIC NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Monthly cash flow table
CREATE TABLE monthly_cashflow (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
    inflow NUMERIC NOT NULL DEFAULT 0,
    outflow NUMERIC NOT NULL DEFAULT 0,
    net_flow NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Product holdings table
CREATE TABLE product_holdings (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_type TEXT NOT NULL, -- 'savings', 'fixed_deposit', 'investment', 'insurance'
    count INTEGER NOT NULL DEFAULT 1,
    value NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Relationship and profitability table
CREATE TABLE relationship_profitability (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    relationship_tier TEXT NOT NULL DEFAULT 'Standard', -- 'Standard', 'Premium', 'Priority', 'Private'
    profitability_score INTEGER NOT NULL DEFAULT 0, -- 0-100
    customer_lifetime_value NUMERIC NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Credit utilization table
CREATE TABLE credit_utilization (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    total_limit NUMERIC NOT NULL DEFAULT 0,
    used_amount NUMERIC NOT NULL DEFAULT 0,
    utilization_rate NUMERIC NOT NULL DEFAULT 0, -- Calculated field
    credit_health TEXT NOT NULL DEFAULT 'Good', -- 'Excellent', 'Good', 'Fair', 'Poor'
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Risk indicators table
CREATE TABLE risk_indicators (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    indicator_type TEXT NOT NULL, -- 'late_payment', 'overdraft_usage', 'credit_score', 'dsr_ratio'
    status TEXT NOT NULL, -- 'None', 'Excellent', 'Good', 'Fair', 'Poor'
    severity TEXT NOT NULL DEFAULT 'low', -- 'low', 'medium', 'high'
    value NUMERIC,
    threshold NUMERIC,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Financial trends table (for chart data)
CREATE TABLE financial_trends (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    month TEXT NOT NULL, -- Format: 'MMM' (Jan, Feb, etc.)
    year INTEGER NOT NULL,
    total_assets NUMERIC NOT NULL DEFAULT 0,
    total_liabilities NUMERIC NOT NULL DEFAULT 0,
    net_worth NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Asset utilization table
CREATE TABLE asset_utilization (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    utilization_percentage NUMERIC NOT NULL DEFAULT 0,
    liquid_assets NUMERIC NOT NULL DEFAULT 0,
    invested_assets NUMERIC NOT NULL DEFAULT 0,
    total_assets NUMERIC NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Emergency fund analysis table
CREATE TABLE emergency_fund_analysis (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    emergency_fund_ratio NUMERIC NOT NULL DEFAULT 0, -- Percentage of 3-month expenses
    three_month_expenses NUMERIC NOT NULL DEFAULT 0,
    current_emergency_fund NUMERIC NOT NULL DEFAULT 0,
    recommended_emergency_fund NUMERIC NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_financial_assets_client ON financial_assets(client_nric);
CREATE INDEX idx_monthly_cashflow_client ON monthly_cashflow(client_nric);
CREATE INDEX idx_product_holdings_client ON product_holdings(client_nric);
CREATE INDEX idx_relationship_profitability_client ON relationship_profitability(client_nric);
CREATE INDEX idx_credit_utilization_client ON credit_utilization(client_nric);
CREATE INDEX idx_risk_indicators_client ON risk_indicators(client_nric);
CREATE INDEX idx_financial_trends_client ON financial_trends(client_nric);
CREATE INDEX idx_asset_utilization_client ON asset_utilization(client_nric);
CREATE INDEX idx_emergency_fund_client ON emergency_fund_analysis(client_nric);

-- Add constraints
ALTER TABLE relationship_profitability ADD CONSTRAINT check_profitability_score CHECK (profitability_score >= 0 AND profitability_score <= 100);
ALTER TABLE relationship_profitability ADD CONSTRAINT check_relationship_tier CHECK (relationship_tier IN ('Standard', 'Premium', 'Priority', 'Private'));
ALTER TABLE credit_utilization ADD CONSTRAINT check_utilization_rate CHECK (utilization_rate >= 0 AND utilization_rate <= 100);
ALTER TABLE credit_utilization ADD CONSTRAINT check_credit_health CHECK (credit_health IN ('Excellent', 'Good', 'Fair', 'Poor'));
ALTER TABLE risk_indicators ADD CONSTRAINT check_severity CHECK (severity IN ('low', 'medium', 'high'));
ALTER TABLE asset_utilization ADD CONSTRAINT check_utilization_percentage CHECK (utilization_percentage >= 0 AND utilization_percentage <= 100);
ALTER TABLE emergency_fund_analysis ADD CONSTRAINT check_emergency_fund_ratio CHECK (emergency_fund_ratio >= 0);

-- Create a function to update utilization rate automatically
CREATE OR REPLACE FUNCTION update_credit_utilization_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_limit > 0 THEN
        NEW.utilization_rate = (NEW.used_amount / NEW.total_limit) * 100;
    ELSE
        NEW.utilization_rate = 0;
    END IF;
    
    -- Update credit health based on utilization rate
    IF NEW.utilization_rate <= 30 THEN
        NEW.credit_health = 'Excellent';
    ELSIF NEW.utilization_rate <= 50 THEN
        NEW.credit_health = 'Good';
    ELSIF NEW.utilization_rate <= 70 THEN
        NEW.credit_health = 'Fair';
    ELSE
        NEW.credit_health = 'Poor';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic utilization rate calculation
CREATE TRIGGER trigger_update_credit_utilization_rate
    BEFORE INSERT OR UPDATE ON credit_utilization
    FOR EACH ROW
    EXECUTE FUNCTION update_credit_utilization_rate();

-- Create a function to update asset utilization percentage
CREATE OR REPLACE FUNCTION update_asset_utilization_percentage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_assets > 0 THEN
        NEW.utilization_percentage = ((NEW.invested_assets / NEW.total_assets) * 100);
    ELSE
        NEW.utilization_percentage = 0;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic asset utilization calculation
CREATE TRIGGER trigger_update_asset_utilization_percentage
    BEFORE INSERT OR UPDATE ON asset_utilization
    FOR EACH ROW
    EXECUTE FUNCTION update_asset_utilization_percentage(); 