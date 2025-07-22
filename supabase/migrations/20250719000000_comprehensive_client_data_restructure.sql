-- Comprehensive Client Data Restructure
-- This migration creates a new structure separating manually input data from calculated data

-- 1. Enhanced Client Profile Table (Manual Input)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS relationship_tier TEXT DEFAULT 'Standard';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS credit_score INTEGER;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS dsr_ratio NUMERIC; -- Debt Service Ratio
ALTER TABLE clients ADD COLUMN IF NOT EXISTS birthday DATE; -- Calculated from NRIC but stored for performance

-- Add constraints for new fields
ALTER TABLE clients ADD CONSTRAINT check_relationship_tier CHECK (relationship_tier IN ('Standard', 'Premium', 'Priority', 'Private'));
ALTER TABLE clients ADD CONSTRAINT check_credit_score CHECK (credit_score >= 300 AND credit_score <= 850);
ALTER TABLE clients ADD CONSTRAINT check_dsr_ratio CHECK (dsr_ratio >= 0 AND dsr_ratio <= 100);

-- 2. Manual Input Financial Data Table
CREATE TABLE IF NOT EXISTS manual_financial_inputs (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    
    -- Key Financial Figures (Manual Input)
    casa_balance NUMERIC NOT NULL DEFAULT 0,
    fixed_deposit_amount NUMERIC NOT NULL DEFAULT 0,
    investment_portfolio_value NUMERIC NOT NULL DEFAULT 0,
    insurance_value NUMERIC NOT NULL DEFAULT 0,
    other_assets_value NUMERIC NOT NULL DEFAULT 0,
    
    -- Liabilities (Manual Input)
    loan_outstanding_balance NUMERIC NOT NULL DEFAULT 0,
    credit_card_limit NUMERIC NOT NULL DEFAULT 0,
    credit_card_used_amount NUMERIC NOT NULL DEFAULT 0,
    overdraft_limit NUMERIC NOT NULL DEFAULT 0,
    overdraft_used_amount NUMERIC NOT NULL DEFAULT 0,
    
    -- Cash Flow (Manual Input)
    monthly_inflow NUMERIC NOT NULL DEFAULT 0,
    monthly_outflow NUMERIC NOT NULL DEFAULT 0,
    
    -- Emergency Fund (Manual Input)
    three_month_expenses NUMERIC NOT NULL DEFAULT 0,
    current_emergency_fund NUMERIC NOT NULL DEFAULT 0,
    
    -- Product Holdings (Manual Input)
    product_holdings JSONB DEFAULT '[]', -- Array of {name, type, value, count}
    
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(client_nric)
);

-- 3. Calculated Financial Data Table
CREATE TABLE IF NOT EXISTS calculated_financial_data (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    
    -- Calculated Totals
    total_assets NUMERIC NOT NULL DEFAULT 0,
    total_liabilities NUMERIC NOT NULL DEFAULT 0,
    net_position NUMERIC NOT NULL DEFAULT 0,
    total_portfolio_value NUMERIC NOT NULL DEFAULT 0,
    
    -- Calculated Cash Flow
    monthly_net_cash_flow NUMERIC NOT NULL DEFAULT 0,
    average_monthly_casa NUMERIC NOT NULL DEFAULT 0,
    casa_peak_month TEXT,
    casa_peak_value NUMERIC NOT NULL DEFAULT 0,
    
    -- Calculated Ratios
    utilization_rate NUMERIC NOT NULL DEFAULT 0, -- Credit utilization
    asset_utilization_rate NUMERIC NOT NULL DEFAULT 0, -- Asset utilization
    emergency_fund_ratio NUMERIC NOT NULL DEFAULT 0,
    
    -- Calculated Metrics
    average_transaction_amount NUMERIC NOT NULL DEFAULT 0,
    profitability_score INTEGER NOT NULL DEFAULT 0,
    
    -- Calculated from NRIC
    calculated_birthday DATE,
    calculated_age INTEGER,
    
    last_calculated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(client_nric)
);

-- 4. Transaction Behavioral Data Table (Manual Input)
CREATE TABLE IF NOT EXISTS transaction_behavioral_data (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    
    -- Categorized Spending (Manual Input)
    categorized_spending JSONB DEFAULT '{}', -- {groceries: amount, utilities: amount, etc.}
    
    -- Transaction Volumes (Manual Input)
    fund_transfers_volume NUMERIC NOT NULL DEFAULT 0,
    fund_transfers_count INTEGER NOT NULL DEFAULT 0,
    pos_purchases_volume NUMERIC NOT NULL DEFAULT 0,
    pos_purchases_count INTEGER NOT NULL DEFAULT 0,
    atm_withdrawals_volume NUMERIC NOT NULL DEFAULT 0,
    atm_withdrawals_count INTEGER NOT NULL DEFAULT 0,
    fx_transactions_volume NUMERIC NOT NULL DEFAULT 0,
    fx_transactions_count INTEGER NOT NULL DEFAULT 0,
    
    -- Unusual Transactions (Manual Input)
    unusual_transactions JSONB DEFAULT '[]', -- Array of {date, description, amount, type}
    
    -- Calculated Transaction Metrics
    total_transaction_volume NUMERIC NOT NULL DEFAULT 0,
    total_transaction_count INTEGER NOT NULL DEFAULT 0,
    average_transaction_size NUMERIC NOT NULL DEFAULT 0,
    
    last_updated TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(client_nric)
);

-- 5. Financial Trends Table (Calculated from monthly snapshots)
CREATE TABLE IF NOT EXISTS financial_trends_monthly (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
    
    -- Monthly Snapshots
    casa_balance NUMERIC NOT NULL DEFAULT 0,
    total_assets NUMERIC NOT NULL DEFAULT 0,
    total_liabilities NUMERIC NOT NULL DEFAULT 0,
    net_worth NUMERIC NOT NULL DEFAULT 0,
    credit_utilization NUMERIC NOT NULL DEFAULT 0,
    investment_value NUMERIC NOT NULL DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(client_nric, month_year)
);

-- Create indexes for better performance
CREATE INDEX idx_manual_financial_client ON manual_financial_inputs(client_nric);
CREATE INDEX idx_calculated_financial_client ON calculated_financial_data(client_nric);
CREATE INDEX idx_transaction_behavioral_client ON transaction_behavioral_data(client_nric);
CREATE INDEX idx_financial_trends_client_month ON financial_trends_monthly(client_nric, month_year);

-- Create functions to automatically calculate derived fields

-- Function to calculate birthday from NRIC
CREATE OR REPLACE FUNCTION calculate_birthday_from_nric(nric_input TEXT)
RETURNS DATE AS $$
DECLARE
    birth_date DATE;
    year_part TEXT;
    month_part TEXT;
    day_part TEXT;
    full_year INTEGER;
BEGIN
    -- Extract date parts from NRIC (format: YYMMDD-XX-XXXX)
    year_part := substring(nric_input from 1 for 2);
    month_part := substring(nric_input from 3 for 2);
    day_part := substring(nric_input from 5 for 2);
    
    -- Determine full year (assuming 2000s for now, could be enhanced with logic)
    full_year := 2000 + year_part::INTEGER;
    
    -- Create date
    birth_date := make_date(full_year, month_part::INTEGER, day_part::INTEGER);
    
    RETURN birth_date;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update calculated financial data
CREATE OR REPLACE FUNCTION update_calculated_financial_data()
RETURNS TRIGGER AS $$
DECLARE
    total_assets_val NUMERIC;
    total_liabilities_val NUMERIC;
    net_position_val NUMERIC;
    utilization_rate_val NUMERIC;
    emergency_fund_ratio_val NUMERIC;
    net_cash_flow_val NUMERIC;
    avg_transaction_val NUMERIC;
    birthday_val DATE;
    age_val INTEGER;
BEGIN
    -- Calculate totals
    total_assets_val := NEW.casa_balance + NEW.fixed_deposit_amount + NEW.investment_portfolio_value + NEW.insurance_value + NEW.other_assets_value;
    total_liabilities_val := NEW.loan_outstanding_balance + NEW.credit_card_used_amount + NEW.overdraft_used_amount;
    net_position_val := total_assets_val - total_liabilities_val;
    
    -- Calculate utilization rate
    IF (NEW.credit_card_limit + NEW.overdraft_limit) > 0 THEN
        utilization_rate_val := ((NEW.credit_card_used_amount + NEW.overdraft_used_amount) / (NEW.credit_card_limit + NEW.overdraft_limit)) * 100;
    ELSE
        utilization_rate_val := 0;
    END IF;
    
    -- Calculate emergency fund ratio
    IF NEW.three_month_expenses > 0 THEN
        emergency_fund_ratio_val := (NEW.current_emergency_fund / NEW.three_month_expenses) * 100;
    ELSE
        emergency_fund_ratio_val := 0;
    END IF;
    
    -- Calculate net cash flow
    net_cash_flow_val := NEW.monthly_inflow - NEW.monthly_outflow;
    
    -- Calculate birthday and age
    birthday_val := calculate_birthday_from_nric(NEW.client_nric);
    IF birthday_val IS NOT NULL THEN
        age_val := EXTRACT(YEAR FROM AGE(CURRENT_DATE, birthday_val));
    ELSE
        age_val := NULL;
    END IF;
    
    -- Insert or update calculated data
    INSERT INTO calculated_financial_data (
        client_nric, total_assets, total_liabilities, net_position,
        utilization_rate, emergency_fund_ratio, monthly_net_cash_flow,
        calculated_birthday, calculated_age, last_calculated
    ) VALUES (
        NEW.client_nric, total_assets_val, total_liabilities_val, net_position_val,
        utilization_rate_val, emergency_fund_ratio_val, net_cash_flow_val,
        birthday_val, age_val, NOW()
    )
    ON CONFLICT (client_nric) DO UPDATE SET
        total_assets = EXCLUDED.total_assets,
        total_liabilities = EXCLUDED.total_liabilities,
        net_position = EXCLUDED.net_position,
        utilization_rate = EXCLUDED.utilization_rate,
        emergency_fund_ratio = EXCLUDED.emergency_fund_ratio,
        monthly_net_cash_flow = EXCLUDED.monthly_net_cash_flow,
        calculated_birthday = EXCLUDED.calculated_birthday,
        calculated_age = EXCLUDED.calculated_age,
        last_calculated = NOW();
    
    -- Update client table with birthday
    UPDATE clients SET birthday = birthday_val WHERE nric = NEW.client_nric;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update transaction behavioral calculations
CREATE OR REPLACE FUNCTION update_transaction_calculations()
RETURNS TRIGGER AS $$
DECLARE
    total_volume NUMERIC;
    total_count INTEGER;
    avg_size NUMERIC;
BEGIN
    -- Calculate totals
    total_volume := NEW.fund_transfers_volume + NEW.pos_purchases_volume + NEW.atm_withdrawals_volume + NEW.fx_transactions_volume;
    total_count := NEW.fund_transfers_count + NEW.pos_purchases_count + NEW.atm_withdrawals_count + NEW.fx_transactions_count;
    
    -- Calculate average transaction size
    IF total_count > 0 THEN
        avg_size := total_volume / total_count;
    ELSE
        avg_size := 0;
    END IF;
    
    -- Update calculated fields
    NEW.total_transaction_volume := total_volume;
    NEW.total_transaction_count := total_count;
    NEW.average_transaction_size := avg_size;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_calculated_financial
    AFTER INSERT OR UPDATE ON manual_financial_inputs
    FOR EACH ROW
    EXECUTE FUNCTION update_calculated_financial_data();

CREATE TRIGGER trigger_update_transaction_calculations
    BEFORE INSERT OR UPDATE ON transaction_behavioral_data
    FOR EACH ROW
    EXECUTE FUNCTION update_transaction_calculations();

-- Add constraints
ALTER TABLE manual_financial_inputs ADD CONSTRAINT check_positive_amounts CHECK (
    casa_balance >= 0 AND fixed_deposit_amount >= 0 AND investment_portfolio_value >= 0 AND
    insurance_value >= 0 AND other_assets_value >= 0 AND loan_outstanding_balance >= 0 AND
    credit_card_limit >= 0 AND credit_card_used_amount >= 0 AND overdraft_limit >= 0 AND
    overdraft_used_amount >= 0 AND monthly_inflow >= 0 AND monthly_outflow >= 0 AND
    three_month_expenses >= 0 AND current_emergency_fund >= 0
);

ALTER TABLE calculated_financial_data ADD CONSTRAINT check_calculated_ratios CHECK (
    utilization_rate >= 0 AND utilization_rate <= 100 AND
    asset_utilization_rate >= 0 AND asset_utilization_rate <= 100 AND
    emergency_fund_ratio >= 0 AND profitability_score >= 0 AND profitability_score <= 100
); 