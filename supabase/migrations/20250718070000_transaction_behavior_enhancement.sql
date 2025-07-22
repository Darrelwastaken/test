-- Enhanced Transaction Behavior Tables

-- Recent transactions summary table
CREATE TABLE recent_transactions_summary (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    total_transactions INTEGER,
    total_volume NUMERIC,
    average_transaction NUMERIC,
    most_active_day TEXT,
    period_days INTEGER DEFAULT 30,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categorised spending table
CREATE TABLE categorised_spending (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    category TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    transaction_count INTEGER,
    period_month TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Large or unusual transactions table
CREATE TABLE large_unusual_transactions (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL, -- 'large_transfer', 'unusual_spending', 'suspicious_activity'
    amount NUMERIC NOT NULL,
    description TEXT,
    transaction_date DATE,
    recipient_account TEXT,
    merchant_name TEXT,
    risk_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
    flagged BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Fund transfers table
CREATE TABLE fund_transfers (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    transfer_type TEXT NOT NULL, -- 'intra_bank', 'inter_bank', 'cross_border'
    amount NUMERIC NOT NULL,
    recipient_name TEXT,
    recipient_account TEXT,
    transfer_date DATE,
    transaction_count INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ATM and POS activity table
CREATE TABLE atm_pos_activity (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'atm_withdrawal', 'pos_purchase'
    amount NUMERIC NOT NULL,
    transaction_count INTEGER,
    average_amount NUMERIC,
    location TEXT,
    merchant_category TEXT,
    period_month TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- FX transactions table
CREATE TABLE fx_transactions (
    id SERIAL PRIMARY KEY,
    client_nric TEXT REFERENCES clients(nric) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL, -- 'currency_purchase', 'currency_sale', 'international_transfer'
    base_currency TEXT NOT NULL,
    quote_currency TEXT NOT NULL,
    base_amount NUMERIC NOT NULL,
    quote_amount NUMERIC NOT NULL,
    exchange_rate NUMERIC NOT NULL,
    transaction_date DATE,
    recipient_country TEXT,
    recipient_name TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_recent_transactions_client ON recent_transactions_summary(client_nric);
CREATE INDEX idx_categorised_spending_client ON categorised_spending(client_nric);
CREATE INDEX idx_large_unusual_client ON large_unusual_transactions(client_nric);
CREATE INDEX idx_fund_transfers_client ON fund_transfers(client_nric);
CREATE INDEX idx_atm_pos_client ON atm_pos_activity(client_nric);
CREATE INDEX idx_fx_transactions_client ON fx_transactions(client_nric); 