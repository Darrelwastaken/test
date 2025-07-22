-- Sample Data for New Table Structure
-- Copy and paste this into your Supabase SQL Editor

-- 1. Insert sample data into manual_financial_inputs
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
     '[{"name": "Savings Account", "type": "savings", "value": 50000, "count": 1}, {"name": "Fixed Deposit 1", "type": "fixed_deposit", "value": 100000, "count": 1}, {"name": "Fixed Deposit 2", "type": "fixed_deposit", "value": 100000, "count": 1}, {"name": "Investment Fund A", "type": "investment", "value": 150000, "count": 1}, {"name": "Investment Fund B", "type": "investment", "value": 150000, "count": 1}, {"name": "Life Insurance", "type": "insurance", "value": 150000, "count": 1}]'),
    
    ('850102-14-5679', 30000, 150000, 200000, 100000, 320000, 175000, 15000, 6000, 7500, 0, 35000, 25000, 75000, 30000,
     '[{"name": "Savings Account", "type": "savings", "value": 30000, "count": 1}, {"name": "Fixed Deposit", "type": "fixed_deposit", "value": 150000, "count": 1}, {"name": "Investment Fund", "type": "investment", "value": 200000, "count": 1}, {"name": "Life Insurance", "type": "insurance", "value": 100000, "count": 1}]'),
    
    ('900101-01-1234', 50000, 100000, 75000, 25000, 15000, 200000, 50000, 15000, 10000, 0, 8000, 6000, 18000, 25000,
     '[{"name": "Savings Account", "type": "savings", "value": 50000, "count": 1}, {"name": "Fixed Deposit", "type": "fixed_deposit", "value": 100000, "count": 2}, {"name": "Unit Trust", "type": "investment", "value": 75000, "count": 3}, {"name": "Life Insurance", "type": "insurance", "value": 25000, "count": 1}]')
ON CONFLICT (client_nric) DO NOTHING;

-- 2. Insert sample data into calculated_financial_data
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
    ('850102-14-5678', 1200000, 310000, 890000, 300000, 15000, 50000, 'Dec', 50000, 40, 80, 120, 304, 85, '1985-01-02', 38),
    ('850102-14-5679', 800000, 250000, 550000, 200000, 10000, 30000, 'Dec', 30000, 40, 65, 100, 265, 65, '1985-01-02', 38),
    ('900101-01-1234', 265000, 200000, 65000, 75000, 2000, 50000, 'Dec', 50000, 30, 25, 139, 250, 75, '1990-01-01', 33)
ON CONFLICT (client_nric) DO NOTHING;

-- 3. Insert sample data into transaction_behavioral_data
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
     '{"groceries": 2800, "utilities": 950, "entertainment": 850, "transport": 650, "travel": 2200, "healthcare": 420}', 
     63600, 30, 15200, 52, 67000, 15, 4575, 2, 
     '[{"date": "2024-12-15", "description": "Large Transfer to John Smith", "amount": 5000, "type": "large_transfer"}, {"date": "2024-12-12", "description": "Unusual spending at Electronics Store", "amount": 2800, "type": "unusual_spending"}]',
     15800, 52, 304),
    
    ('850102-14-5679', 
     '{"groceries": 2340, "utilities": 850, "entertainment": 720, "transport": 580, "travel": 1890, "healthcare": 380}', 
     47400, 25, 13800, 50, 48000, 12, 3450, 2,
     '[{"date": "2024-12-14", "description": "Large Transfer to Family Member", "amount": 3500, "type": "large_transfer"}, {"date": "2024-12-10", "description": "Unusual spending at Luxury Store", "amount": 1800, "type": "unusual_spending"}]',
     12450, 47, 265),
    
    ('900101-01-1234', 
     '{"groceries": 1200, "utilities": 500, "transportation": 800, "entertainment": 600, "shopping": 1500, "dining": 1000}', 
     15000, 25, 8000, 45, 3000, 8, 5000, 3,
     '[{"date": "2024-01-15", "description": "Large transfer to investment account", "amount": 10000, "type": "investment"}, {"date": "2024-02-20", "description": "Unusual ATM withdrawal", "amount": 2000, "type": "atm"}]',
     15000, 50, 300)
ON CONFLICT (client_nric) DO NOTHING;

-- 4. Insert sample data into financial_trends_monthly
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
    ('850102-14-5678', '2024-01', 125000, 1150000, 315000, 835000, 25.5, 20200),
    ('850102-14-5678', '2024-02', 138000, 1160000, 312000, 848000, 27.6, 22440),
    ('850102-14-5678', '2024-03', 142000, 1170000, 310000, 860000, 26.4, 23690),
    ('850102-14-5678', '2024-04', 156000, 1180000, 308000, 872000, 30.6, 26000),
    ('850102-14-5678', '2024-05', 148000, 1190000, 306000, 884000, 28.8, 28350),
    ('850102-14-5678', '2024-06', 165000, 1200000, 310000, 890000, 33.6, 31800),
    ('850102-14-5678', '2024-07', 178000, 1210000, 308000, 902000, 35.4, 35310),
    ('850102-14-5678', '2024-08', 185000, 1220000, 306000, 914000, 37.2, 37800),
    ('850102-14-5678', '2024-09', 192000, 1230000, 304000, 926000, 39.6, 40330),
    ('850102-14-5678', '2024-10', 198000, 1240000, 302000, 938000, 41.4, 43200),
    ('850102-14-5678', '2024-11', 205000, 1250000, 300000, 950000, 43.5, 46010),
    ('850102-14-5678', '2024-12', 212000, 1200000, 310000, 890000, 45.6, 49050),
    
    ('850102-14-5679', '2024-01', 85000, 780000, 255000, 525000, 19.5, 12120),
    ('850102-14-5679', '2024-02', 92000, 785000, 253000, 532000, 21.6, 15300),
    ('850102-14-5679', '2024-03', 98000, 790000, 251000, 539000, 23.4, 18540),
    ('850102-14-5679', '2024-04', 105000, 795000, 249000, 546000, 25.5, 21840),
    ('850102-14-5679', '2024-05', 112000, 800000, 250000, 550000, 27.6, 25200),
    ('850102-14-5679', '2024-06', 118000, 800000, 250000, 550000, 29.4, 28620),
    ('850102-14-5679', '2024-07', 125000, 800000, 250000, 550000, 31.5, 32100),
    ('850102-14-5679', '2024-08', 132000, 800000, 250000, 550000, 33.6, 35640),
    ('850102-14-5679', '2024-09', 138000, 800000, 250000, 550000, 35.4, 39240),
    ('850102-14-5679', '2024-10', 145000, 800000, 250000, 550000, 37.5, 42900),
    ('850102-14-5679', '2024-11', 152000, 800000, 250000, 550000, 39.6, 46620),
    ('850102-14-5679', '2024-12', 158000, 800000, 250000, 550000, 41.4, 50400)
ON CONFLICT (client_nric, month_year) DO NOTHING;

-- 5. Update calculated birthdays and ages from NRIC
UPDATE calculated_financial_data 
SET 
    calculated_birthday = calculate_birthday_from_nric(client_nric),
    calculated_age = EXTRACT(YEAR FROM AGE(CURRENT_DATE, calculate_birthday_from_nric(client_nric)))
WHERE calculated_birthday IS NULL;

-- 6. Update client table with birthdays
UPDATE clients 
SET birthday = calculate_birthday_from_nric(nric)
WHERE birthday IS NULL;

-- Success message
SELECT 'Sample data has been successfully inserted into the new table structure!' as status; 