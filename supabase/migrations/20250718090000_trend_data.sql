-- Create trend data tables for different transaction types
-- This will store monthly trend data for CASA, Cards, Investments, and Loans

-- CASA Trend Data
CREATE TABLE IF NOT EXISTS casa_trend_data (
    id SERIAL PRIMARY KEY,
    client_nric VARCHAR(14) REFERENCES clients(nric) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    transactions_count INTEGER DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    deposits_amount DECIMAL(15,2) DEFAULT 0,
    withdrawals_amount DECIMAL(15,2) DEFAULT 0,
    average_transaction DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_nric, month_year)
);

-- Cards Trend Data
CREATE TABLE IF NOT EXISTS cards_trend_data (
    id SERIAL PRIMARY KEY,
    client_nric VARCHAR(14) REFERENCES clients(nric) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    transactions_count INTEGER DEFAULT 0,
    total_spending DECIMAL(15,2) DEFAULT 0,
    total_payments DECIMAL(15,2) DEFAULT 0,
    average_spending DECIMAL(15,2) DEFAULT 0,
    credit_utilization_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_nric, month_year)
);

-- Investments Trend Data
CREATE TABLE IF NOT EXISTS investments_trend_data (
    id SERIAL PRIMARY KEY,
    client_nric VARCHAR(14) REFERENCES clients(nric) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    transactions_count INTEGER DEFAULT 0,
    total_invested DECIMAL(15,2) DEFAULT 0,
    total_withdrawn DECIMAL(15,2) DEFAULT 0,
    net_investment DECIMAL(15,2) DEFAULT 0,
    portfolio_value DECIMAL(15,2) DEFAULT 0,
    return_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_nric, month_year)
);

-- Loans Trend Data
CREATE TABLE IF NOT EXISTS loans_trend_data (
    id SERIAL PRIMARY KEY,
    client_nric VARCHAR(14) REFERENCES clients(nric) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    transactions_count INTEGER DEFAULT 0,
    total_borrowed DECIMAL(15,2) DEFAULT 0,
    total_repaid DECIMAL(15,2) DEFAULT 0,
    outstanding_balance DECIMAL(15,2) DEFAULT 0,
    interest_paid DECIMAL(15,2) DEFAULT 0,
    loan_utilization_rate DECIMAL(5,2) DEFAULT 0, -- Percentage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_nric, month_year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_casa_trend_client_month ON casa_trend_data(client_nric, month_year);
CREATE INDEX IF NOT EXISTS idx_cards_trend_client_month ON cards_trend_data(client_nric, month_year);
CREATE INDEX IF NOT EXISTS idx_investments_trend_client_month ON investments_trend_data(client_nric, month_year);
CREATE INDEX IF NOT EXISTS idx_loans_trend_client_month ON loans_trend_data(client_nric, month_year);

-- Create triggers to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_casa_trend_updated_at BEFORE UPDATE ON casa_trend_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cards_trend_updated_at BEFORE UPDATE ON cards_trend_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investments_trend_updated_at BEFORE UPDATE ON investments_trend_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loans_trend_updated_at BEFORE UPDATE ON loans_trend_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 