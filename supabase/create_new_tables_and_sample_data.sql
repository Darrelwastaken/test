-- Create New Table Structure and Sample Data
-- Copy and paste this into your Supabase SQL Editor

-- 1. Create manual_financial_inputs table
CREATE TABLE IF NOT EXISTS manual_financial_inputs (
    id SERIAL PRIMARY KEY,
    client_nric VARCHAR(20) NOT NULL,
    casa_balance DECIMAL(15,2) DEFAULT 0,
    fixed_deposit_amount DECIMAL(15,2) DEFAULT 0,
    investment_portfolio_value DECIMAL(15,2) DEFAULT 0,
    insurance_value DECIMAL(15,2) DEFAULT 0,
    other_assets_value DECIMAL(15,2) DEFAULT 0,
    loan_outstanding_balance DECIMAL(15,2) DEFAULT 0,
    credit_card_limit DECIMAL(15,2) DEFAULT 0,
    credit_card_used_amount DECIMAL(15,2) DEFAULT 0,
    overdraft_limit DECIMAL(15,2) DEFAULT 0,
    overdraft_used_amount DECIMAL(15,2) DEFAULT 0,
    monthly_inflow DECIMAL(15,2) DEFAULT 0,
    monthly_outflow DECIMAL(15,2) DEFAULT 0,
    three_month_expenses DECIMAL(15,2) DEFAULT 0,
    current_emergency_fund DECIMAL(15,2) DEFAULT 0,
    product_holdings JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create calculated_financial_data table
CREATE TABLE IF NOT EXISTS calculated_financial_data (
    id SERIAL PRIMARY KEY,
    client_nric VARCHAR(20) NOT NULL,
    total_assets DECIMAL(15,2) DEFAULT 0,
    total_liabilities DECIMAL(15,2) DEFAULT 0,
    net_position DECIMAL(15,2) DEFAULT 0,
    total_portfolio_value DECIMAL(15,2) DEFAULT 0,
    monthly_net_cash_flow DECIMAL(15,2) DEFAULT 0,
    average_monthly_casa DECIMAL(15,2) DEFAULT 0,
    casa_peak_month VARCHAR(10),
    casa_peak_value DECIMAL(15,2) DEFAULT 0,
    utilization_rate DECIMAL(5,2) DEFAULT 0,
    asset_utilization_rate DECIMAL(5,2) DEFAULT 0,
    emergency_fund_ratio DECIMAL(5,2) DEFAULT 0,
    average_transaction_amount DECIMAL(15,2) DEFAULT 0,
    profitability_score DECIMAL(5,2) DEFAULT 0,
    calculated_birthday DATE,
    calculated_age INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create transaction_behavioral_data table
CREATE TABLE IF NOT EXISTS transaction_behavioral_data (
    id SERIAL PRIMARY KEY,
    client_nric VARCHAR(20) NOT NULL,
    categorized_spending JSONB DEFAULT '{}',
    fund_transfers_volume DECIMAL(15,2) DEFAULT 0,
    fund_transfers_count INTEGER DEFAULT 0,
    pos_purchases_volume DECIMAL(15,2) DEFAULT 0,
    pos_purchases_count INTEGER DEFAULT 0,
    atm_withdrawals_volume DECIMAL(15,2) DEFAULT 0,
    atm_withdrawals_count INTEGER DEFAULT 0,
    fx_transactions_volume DECIMAL(15,2) DEFAULT 0,
    fx_transactions_count INTEGER DEFAULT 0,
    unusual_transactions JSONB DEFAULT '[]',
    total_transaction_volume DECIMAL(15,2) DEFAULT 0,
    total_transaction_count INTEGER DEFAULT 0,
    average_transaction_size DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create financial_trends_monthly table
CREATE TABLE IF NOT EXISTS financial_trends_monthly (
    id SERIAL PRIMARY KEY,
    client_nric VARCHAR(20) NOT NULL,
    month_year VARCHAR(7) NOT NULL,
    casa_balance DECIMAL(15,2) DEFAULT 0,
    total_assets DECIMAL(15,2) DEFAULT 0,
    total_liabilities DECIMAL(15,2) DEFAULT 0,
    net_worth DECIMAL(15,2) DEFAULT 0,
    credit_utilization DECIMAL(5,2) DEFAULT 0,
    investment_value DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(client_nric, month_year)
);

-- 5. Insert sample data into manual_financial_inputs
INSERT INTO manual_financial_inputs (
    client_nric,
    casa_balance,
    fixed_deposit_amount,
    investment_portfolio_value,
    insurance_value,
    other_assets_value,
    loan_outstanding_balance,
    credit_card_limit,
    credit_card_used_amount,
    overdraft_limit,
    overdraft_used_amount,
    monthly_inflow,
    monthly_outflow,
    three_month_expenses,
    current_emergency_fund,
    product_holdings
) VALUES 
    ('850102-14-5678', 50000, 200000, 300000, 150000, 500000, 217000, 20000, 8000, 10000, 0, 50000, 35000, 105000, 50000, 
     '[{"name": "Savings Account", "type": "savings", "value": 50000, "count": 1}, {"name": "Fixed Deposit", "type": "investment", "value": 200000, "count": 2}, {"name": "Investment Fund", "type": "investment", "value": 300000, "count": 1}, {"name": "Life Insurance", "type": "insurance", "value": 150000, "count": 1}]'),
    
    ('900615-08-1234', 75000, 150000, 450000, 200000, 300000, 155000, 30000, 12000, 15000, 0, 75000, 45000, 135000, 75000,
     '[{"name": "Premium Savings", "type": "savings", "value": 75000, "count": 1}, {"name": "Term Deposit", "type": "investment", "value": 150000, "count": 1}, {"name": "Equity Fund", "type": "investment", "value": 450000, "count": 1}, {"name": "Health Insurance", "type": "insurance", "value": 200000, "count": 1}]'),
    
    ('870320-03-9876', 30000, 100000, 200000, 100000, 200000, 93000, 15000, 6000, 8000, 0, 40000, 30000, 90000, 30000,
     '[{"name": "Basic Savings", "type": "savings", "value": 30000, "count": 1}, {"name": "Short-term Deposit", "type": "investment", "value": 100000, "count": 1}, {"name": "Bond Fund", "type": "investment", "value": 200000, "count": 1}, {"name": "Term Insurance", "type": "insurance", "value": 100000, "count": 1}]');

-- 6. Insert sample data into calculated_financial_data
INSERT INTO calculated_financial_data (
    client_nric,
    total_assets,
    total_liabilities,
    net_position,
    total_portfolio_value,
    monthly_net_cash_flow,
    average_monthly_casa,
    casa_peak_month,
    casa_peak_value,
    utilization_rate,
    asset_utilization_rate,
    emergency_fund_ratio,
    average_transaction_amount,
    profitability_score,
    calculated_birthday,
    calculated_age
) VALUES 
    ('850102-14-5678', 1200000, 310000, 890000, 500000, 15000, 50000, 'Dec', 50000, 40.0, 80.0, 47.6, 2500, 85.0, '1985-01-02', 38),
    ('900615-08-1234', 1250000, 200000, 1050000, 600000, 30000, 75000, 'Dec', 75000, 40.0, 85.0, 55.6, 3000, 90.0, '1990-06-15', 33),
    ('870320-03-9876', 630000, 101000, 529000, 300000, 10000, 30000, 'Dec', 30000, 40.0, 75.0, 33.3, 2000, 80.0, '1987-03-20', 36);

-- 7. Insert sample data into transaction_behavioral_data
INSERT INTO transaction_behavioral_data (
    client_nric,
    categorized_spending,
    fund_transfers_volume,
    fund_transfers_count,
    pos_purchases_volume,
    pos_purchases_count,
    atm_withdrawals_volume,
    atm_withdrawals_count,
    fx_transactions_volume,
    fx_transactions_count,
    unusual_transactions,
    total_transaction_volume,
    total_transaction_count,
    average_transaction_size
) VALUES 
    ('850102-14-5678', 
     '{"groceries": 2000, "utilities": 1500, "entertainment": 1000, "transport": 800, "shopping": 1200}', 
     50000, 20, 10000, 30, 20000, 15, 5000, 3, 
     '[{"date": "2024-01-15", "amount": 5000, "type": "large_purchase"}, {"date": "2024-02-20", "amount": 3000, "type": "unusual_transfer"}]',
     85000, 68, 1250),
    
    ('900615-08-1234', 
     '{"groceries": 2500, "utilities": 1800, "entertainment": 1500, "transport": 1000, "shopping": 2000}', 
     75000, 25, 15000, 40, 25000, 20, 8000, 5, 
     '[{"date": "2024-01-10", "amount": 8000, "type": "investment_purchase"}, {"date": "2024-03-05", "amount": 4000, "type": "travel_expense"}]',
     123000, 90, 1367),
    
    ('870320-03-9876', 
     '{"groceries": 1500, "utilities": 1200, "entertainment": 800, "transport": 600, "shopping": 1000}', 
     30000, 15, 8000, 25, 15000, 12, 3000, 2, 
     '[{"date": "2024-02-15", "amount": 2500, "type": "medical_expense"}, {"date": "2024-03-10", "amount": 2000, "type": "home_repair"}]',
     56000, 54, 1037);

-- 8. Insert sample data into financial_trends_monthly
INSERT INTO financial_trends_monthly (
    client_nric,
    month_year,
    casa_balance,
    total_assets,
    total_liabilities,
    net_worth,
    credit_utilization,
    investment_value
) VALUES 
    ('850102-14-5678', '2024-01', 45000, 1180000, 310000, 870000, 40.0, 300000),
    ('850102-14-5678', '2024-02', 48000, 1190000, 310000, 880000, 40.0, 300000),
    ('850102-14-5678', '2024-03', 52000, 1200000, 310000, 890000, 40.0, 300000),
    ('850102-14-5678', '2024-04', 50000, 1200000, 310000, 890000, 40.0, 300000),
    
    ('900615-08-1234', '2024-01', 70000, 1230000, 200000, 1030000, 40.0, 450000),
    ('900615-08-1234', '2024-02', 72000, 1240000, 200000, 1040000, 40.0, 450000),
    ('900615-08-1234', '2024-03', 75000, 1250000, 200000, 1050000, 40.0, 450000),
    ('900615-08-1234', '2024-04', 75000, 1250000, 200000, 1050000, 40.0, 450000),
    
    ('870320-03-9876', '2024-01', 28000, 620000, 101000, 519000, 40.0, 200000),
    ('870320-03-9876', '2024-02', 29000, 625000, 101000, 524000, 40.0, 200000),
    ('870320-03-9876', '2024-03', 30000, 630000, 101000, 529000, 40.0, 200000),
    ('870320-03-9876', '2024-04', 30000, 630000, 101000, 529000, 40.0, 200000);

-- 9. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_manual_financial_inputs_nric ON manual_financial_inputs(client_nric);
CREATE INDEX IF NOT EXISTS idx_calculated_financial_data_nric ON calculated_financial_data(client_nric);
CREATE INDEX IF NOT EXISTS idx_transaction_behavioral_data_nric ON transaction_behavioral_data(client_nric);
CREATE INDEX IF NOT EXISTS idx_financial_trends_monthly_nric ON financial_trends_monthly(client_nric);
CREATE INDEX IF NOT EXISTS idx_financial_trends_monthly_date ON financial_trends_monthly(month_year);

-- 10. Add RLS (Row Level Security) policies if needed
ALTER TABLE manual_financial_inputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculated_financial_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_behavioral_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_trends_monthly ENABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'New table structure created and populated with sample data successfully!' as status; 