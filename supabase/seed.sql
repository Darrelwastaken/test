-- Seed data for clients
INSERT INTO clients (nric, name, email, status, risk_profile, nationality, gender, marital_status, employment_status) VALUES
  ('850102-14-5678', 'David Williams', 'david.williams@email.com', 'Active', 'Moderate', 'Malaysian', 'Male', 'Married', 'Employed'),
  ('850102-14-5679', 'Sarah Johnson', 'sarah.johnson@email.com', 'Active', 'Conservative', 'Malaysian', 'Female', 'Single', 'Self-Employed');

-- Seed data for dashboard_metrics
INSERT INTO dashboard_metrics (client_nric, assets, cashflow, monthly_cashflow, account_balances, transactions_heatmap, months) VALUES
  ('850102-14-5678', 1200000, 50000, ARRAY[10000, 12000, 11000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000, 21000], '{"casa": 50000, "fd": 200000, "loans": 300000, "cards": 10000}', ARRAY[10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32], ARRAY['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']),
  ('850102-14-5679', 800000, 35000, ARRAY[8000, 9000, 8500, 9500, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000], '{"casa": 30000, "fd": 150000, "loans": 200000, "cards": 8000}', ARRAY[8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30], ARRAY['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']);



-- Seed data for transaction_behavior
INSERT INTO transaction_behavior (client_nric, casa_deposits, casa_withdrawals, card_spending, card_payments) VALUES
  ('850102-14-5678', ARRAY[1000, 1200, 1100], ARRAY[800, 900, 950], ARRAY[500, 600, 700], ARRAY[400, 450, 500]),
  ('850102-14-5679', ARRAY[800, 900, 850], ARRAY[600, 700, 750], ARRAY[300, 400, 500], ARRAY[250, 300, 350]);

-- Seed data for investments_portfolio
INSERT INTO investments_portfolio (client_nric, holdings) VALUES
  ('850102-14-5678', '[{"asset": "Stock A", "type": "Stock", "balance": 100000}, {"asset": "Bond B", "type": "Bond", "balance": 50000}]'),
  ('850102-14-5679', '[{"asset": "Bond C", "type": "Bond", "balance": 80000}, {"asset": "ETF D", "type": "ETF", "balance": 40000}]');

-- Trend Data for David Williams (850102-14-5678)
-- CASA Trend Data
INSERT INTO casa_trend_data (client_nric, month_year, transactions_count, total_amount, deposits_amount, withdrawals_amount, average_transaction) VALUES
  ('850102-14-5678', '2024-01', 45, 125000, 80000, 45000, 2777.78),
  ('850102-14-5678', '2024-02', 52, 138000, 90000, 48000, 2653.85),
  ('850102-14-5678', '2024-03', 48, 142000, 95000, 47000, 2958.33),
  ('850102-14-5678', '2024-04', 55, 156000, 105000, 51000, 2836.36),
  ('850102-14-5678', '2024-05', 50, 148000, 98000, 50000, 2960.00),
  ('850102-14-5678', '2024-06', 58, 165000, 110000, 55000, 2844.83),
  ('850102-14-5678', '2024-07', 62, 178000, 120000, 58000, 2870.97),
  ('850102-14-5678', '2024-08', 65, 185000, 125000, 60000, 2846.15),
  ('850102-14-5678', '2024-09', 68, 192000, 130000, 62000, 2823.53),
  ('850102-14-5678', '2024-10', 70, 198000, 135000, 63000, 2828.57),
  ('850102-14-5678', '2024-11', 72, 205000, 140000, 65000, 2847.22),
  ('850102-14-5678', '2024-12', 75, 212000, 145000, 67000, 2826.67);

-- Cards Trend Data
INSERT INTO cards_trend_data (client_nric, month_year, transactions_count, total_spending, total_payments, average_spending, credit_utilization_rate) VALUES
  ('850102-14-5678', '2024-01', 28, 8500, 8500, 303.57, 25.5),
  ('850102-14-5678', '2024-02', 32, 9200, 9200, 287.50, 27.6),
  ('850102-14-5678', '2024-03', 30, 8800, 8800, 293.33, 26.4),
  ('850102-14-5678', '2024-04', 35, 10200, 10200, 291.43, 30.6),
  ('850102-14-5678', '2024-05', 33, 9600, 9600, 290.91, 28.8),
  ('850102-14-5678', '2024-06', 38, 11200, 11200, 294.74, 33.6),
  ('850102-14-5678', '2024-07', 40, 11800, 11800, 295.00, 35.4),
  ('850102-14-5678', '2024-08', 42, 12400, 12400, 295.24, 37.2),
  ('850102-14-5678', '2024-09', 45, 13200, 13200, 293.33, 39.6),
  ('850102-14-5678', '2024-10', 48, 13800, 13800, 287.50, 41.4),
  ('850102-14-5678', '2024-11', 50, 14500, 14500, 290.00, 43.5),
  ('850102-14-5678', '2024-12', 52, 15200, 15200, 292.31, 45.6);

-- Investments Trend Data
INSERT INTO investments_trend_data (client_nric, month_year, transactions_count, total_invested, total_withdrawn, net_investment, portfolio_value, return_rate) VALUES
  ('850102-14-5678', '2024-01', 8, 25000, 5000, 20000, 20200, 1.0),
  ('850102-14-5678', '2024-02', 10, 30000, 8000, 22000, 22440, 2.0),
  ('850102-14-5678', '2024-03', 12, 35000, 12000, 23000, 23690, 3.0),
  ('850102-14-5678', '2024-04', 15, 40000, 15000, 25000, 26000, 4.0),
  ('850102-14-5678', '2024-05', 18, 45000, 18000, 27000, 28350, 5.0),
  ('850102-14-5678', '2024-06', 20, 50000, 20000, 30000, 31800, 6.0),
  ('850102-14-5678', '2024-07', 22, 55000, 22000, 33000, 35310, 7.0),
  ('850102-14-5678', '2024-08', 25, 60000, 25000, 35000, 37800, 8.0),
  ('850102-14-5678', '2024-09', 28, 65000, 28000, 37000, 40330, 9.0),
  ('850102-14-5678', '2024-10', 30, 70000, 30000, 40000, 43200, 8.0),
  ('850102-14-5678', '2024-11', 32, 75000, 32000, 43000, 46010, 7.0),
  ('850102-14-5678', '2024-12', 35, 80000, 35000, 45000, 49050, 9.0);

-- Loans Trend Data
INSERT INTO loans_trend_data (client_nric, month_year, transactions_count, total_borrowed, total_repaid, outstanding_balance, interest_paid, loan_utilization_rate) VALUES
  ('850102-14-5678', '2024-01', 3, 50000, 5000, 45000, 450, 45.0),
  ('850102-14-5678', '2024-02', 4, 55000, 6000, 49000, 490, 49.0),
  ('850102-14-5678', '2024-03', 5, 60000, 7000, 53000, 530, 53.0),
  ('850102-14-5678', '2024-04', 6, 65000, 8000, 57000, 570, 57.0),
  ('850102-14-5678', '2024-05', 7, 70000, 9000, 61000, 610, 61.0),
  ('850102-14-5678', '2024-06', 8, 75000, 10000, 65000, 650, 65.0),
  ('850102-14-5678', '2024-07', 9, 80000, 11000, 69000, 690, 69.0),
  ('850102-14-5678', '2024-08', 10, 85000, 12000, 73000, 730, 73.0),
  ('850102-14-5678', '2024-09', 11, 90000, 13000, 77000, 770, 77.0),
  ('850102-14-5678', '2024-10', 12, 95000, 14000, 81000, 810, 81.0),
  ('850102-14-5678', '2024-11', 13, 100000, 15000, 85000, 850, 85.0),
  ('850102-14-5678', '2024-12', 14, 105000, 16000, 89000, 890, 89.0);

-- Trend Data for Sarah Johnson (850102-14-5679)
-- CASA Trend Data
INSERT INTO casa_trend_data (client_nric, month_year, transactions_count, total_amount, deposits_amount, withdrawals_amount, average_transaction) VALUES
  ('850102-14-5679', '2024-01', 35, 85000, 55000, 30000, 2428.57),
  ('850102-14-5679', '2024-02', 38, 92000, 60000, 32000, 2421.05),
  ('850102-14-5679', '2024-03', 40, 98000, 65000, 33000, 2450.00),
  ('850102-14-5679', '2024-04', 42, 105000, 70000, 35000, 2500.00),
  ('850102-14-5679', '2024-05', 45, 112000, 75000, 37000, 2488.89),
  ('850102-14-5679', '2024-06', 48, 118000, 80000, 38000, 2458.33),
  ('850102-14-5679', '2024-07', 50, 125000, 85000, 40000, 2500.00),
  ('850102-14-5679', '2024-08', 52, 132000, 90000, 42000, 2538.46),
  ('850102-14-5679', '2024-09', 55, 138000, 95000, 43000, 2509.09),
  ('850102-14-5679', '2024-10', 58, 145000, 100000, 45000, 2500.00),
  ('850102-14-5679', '2024-11', 60, 152000, 105000, 47000, 2533.33),
  ('850102-14-5679', '2024-12', 62, 158000, 110000, 48000, 2548.39);

-- Cards Trend Data
INSERT INTO cards_trend_data (client_nric, month_year, transactions_count, total_spending, total_payments, average_spending, credit_utilization_rate) VALUES
  ('850102-14-5679', '2024-01', 22, 6500, 6500, 295.45, 19.5),
  ('850102-14-5679', '2024-02', 25, 7200, 7200, 288.00, 21.6),
  ('850102-14-5679', '2024-03', 28, 7800, 7800, 278.57, 23.4),
  ('850102-14-5679', '2024-04', 30, 8500, 8500, 283.33, 25.5),
  ('850102-14-5679', '2024-05', 32, 9200, 9200, 287.50, 27.6),
  ('850102-14-5679', '2024-06', 35, 9800, 9800, 280.00, 29.4),
  ('850102-14-5679', '2024-07', 38, 10500, 10500, 276.32, 31.5),
  ('850102-14-5679', '2024-08', 40, 11200, 11200, 280.00, 33.6),
  ('850102-14-5679', '2024-09', 42, 11800, 11800, 280.95, 35.4),
  ('850102-14-5679', '2024-10', 45, 12500, 12500, 277.78, 37.5),
  ('850102-14-5679', '2024-11', 48, 13200, 13200, 275.00, 39.6),
  ('850102-14-5679', '2024-12', 50, 13800, 13800, 276.00, 41.4);

-- Investments Trend Data
INSERT INTO investments_trend_data (client_nric, month_year, transactions_count, total_invested, total_withdrawn, net_investment, portfolio_value, return_rate) VALUES
  ('850102-14-5679', '2024-01', 6, 15000, 3000, 12000, 12120, 1.0),
  ('850102-14-5679', '2024-02', 8, 20000, 5000, 15000, 15300, 2.0),
  ('850102-14-5679', '2024-03', 10, 25000, 7000, 18000, 18540, 3.0),
  ('850102-14-5679', '2024-04', 12, 30000, 9000, 21000, 21840, 4.0),
  ('850102-14-5679', '2024-05', 15, 35000, 11000, 24000, 25200, 5.0),
  ('850102-14-5679', '2024-06', 18, 40000, 13000, 27000, 28620, 6.0),
  ('850102-14-5679', '2024-07', 20, 45000, 15000, 30000, 32100, 7.0),
  ('850102-14-5679', '2024-08', 22, 50000, 17000, 33000, 35640, 8.0),
  ('850102-14-5679', '2024-09', 25, 55000, 19000, 36000, 39240, 9.0),
  ('850102-14-5679', '2024-10', 28, 60000, 21000, 39000, 42900, 10.0),
  ('850102-14-5679', '2024-11', 30, 65000, 23000, 42000, 46620, 11.0),
  ('850102-14-5679', '2024-12', 32, 70000, 25000, 45000, 50400, 12.0);

-- Loans Trend Data
INSERT INTO loans_trend_data (client_nric, month_year, transactions_count, total_borrowed, total_repaid, outstanding_balance, interest_paid, loan_utilization_rate) VALUES
  ('850102-14-5679', '2024-01', 2, 30000, 3000, 27000, 270, 27.0),
  ('850102-14-5679', '2024-02', 3, 35000, 4000, 31000, 310, 31.0),
  ('850102-14-5679', '2024-03', 4, 40000, 5000, 35000, 350, 35.0),
  ('850102-14-5679', '2024-04', 5, 45000, 6000, 39000, 390, 39.0),
  ('850102-14-5679', '2024-05', 6, 50000, 7000, 43000, 430, 43.0),
  ('850102-14-5679', '2024-06', 7, 55000, 8000, 47000, 470, 47.0),
  ('850102-14-5679', '2024-07', 8, 60000, 9000, 51000, 510, 51.0),
  ('850102-14-5679', '2024-08', 9, 65000, 10000, 55000, 550, 55.0),
  ('850102-14-5679', '2024-09', 10, 70000, 11000, 59000, 590, 59.0),
  ('850102-14-5679', '2024-10', 11, 75000, 12000, 63000, 630, 63.0),
  ('850102-14-5679', '2024-11', 12, 80000, 13000, 67000, 670, 67.0),
  ('850102-14-5679', '2024-12', 13, 85000, 14000, 71000, 710, 71.0);

-- Financial Summary Data

-- Financial assets for David Williams
INSERT INTO financial_assets (client_nric, total_assets, total_liabilities, net_position, casa_balance, fixed_deposits, investment_funds, insurance_policies, other_assets) VALUES
('850102-14-5678', 1200000, 310000, 890000, 50000, 200000, 300000, 150000, 500000);

-- Financial assets for Sarah Johnson  
INSERT INTO financial_assets (client_nric, total_assets, total_liabilities, net_position, casa_balance, fixed_deposits, investment_funds, insurance_policies, other_assets) VALUES
('850102-14-5679', 800000, 250000, 550000, 30000, 150000, 200000, 100000, 320000);

-- Monthly cash flow data
INSERT INTO monthly_cashflow (client_nric, month_year, inflow, outflow, net_flow) VALUES
('850102-14-5678', '2024-12', 50000, 35000, 15000),
('850102-14-5678', '2024-11', 48000, 32000, 16000),
('850102-14-5678', '2024-10', 52000, 38000, 14000),
('850102-14-5679', '2024-12', 35000, 25000, 10000),
('850102-14-5679', '2024-11', 33000, 23000, 10000),
('850102-14-5679', '2024-10', 37000, 27000, 10000);

-- Product holdings
INSERT INTO product_holdings (client_nric, product_name, product_type, count, value) VALUES
('850102-14-5678', 'Savings Account', 'savings', 1, 50000),
('850102-14-5678', 'Fixed Deposit 1', 'fixed_deposit', 1, 100000),
('850102-14-5678', 'Fixed Deposit 2', 'fixed_deposit', 1, 100000),
('850102-14-5678', 'Investment Fund A', 'investment', 1, 150000),
('850102-14-5678', 'Investment Fund B', 'investment', 1, 150000),
('850102-14-5678', 'Life Insurance', 'insurance', 1, 150000),
('850102-14-5679', 'Savings Account', 'savings', 1, 30000),
('850102-14-5679', 'Fixed Deposit', 'fixed_deposit', 1, 150000),
('850102-14-5679', 'Investment Fund', 'investment', 1, 200000),
('850102-14-5679', 'Life Insurance', 'insurance', 1, 100000);

-- Relationship and profitability
INSERT INTO relationship_profitability (client_nric, relationship_tier, profitability_score, customer_lifetime_value) VALUES
('850102-14-5678', 'Premium', 85, 250000),
('850102-14-5679', 'Standard', 65, 150000);

-- Credit utilization
INSERT INTO credit_utilization (client_nric, total_limit, used_amount, utilization_rate, credit_health) VALUES
('850102-14-5678', 20000, 8000, 40, 'Good'),
('850102-14-5679', 15000, 6000, 40, 'Good');

-- Risk indicators
INSERT INTO risk_indicators (client_nric, indicator_type, status, severity, value, threshold) VALUES
('850102-14-5678', 'late_payment', 'None', 'low', 0, 1),
('850102-14-5678', 'overdraft_usage', 'None', 'low', 0, 1000),
('850102-14-5678', 'credit_score', 'Excellent', 'low', 750, 700),
('850102-14-5678', 'dsr_ratio', 'Healthy', 'low', 25, 40),
('850102-14-5679', 'late_payment', 'None', 'low', 0, 1),
('850102-14-5679', 'overdraft_usage', 'None', 'low', 0, 1000),
('850102-14-5679', 'credit_score', 'Good', 'low', 720, 700),
('850102-14-5679', 'dsr_ratio', 'Healthy', 'low', 30, 40);

-- Financial trends
INSERT INTO financial_trends (client_nric, month, year, total_assets, total_liabilities, net_worth) VALUES
('850102-14-5678', 'Jan', 2024, 1150000, 315000, 835000),
('850102-14-5678', 'Feb', 2024, 1160000, 312000, 848000),
('850102-14-5678', 'Mar', 2024, 1170000, 310000, 860000),
('850102-14-5678', 'Apr', 2024, 1180000, 308000, 872000),
('850102-14-5678', 'May', 2024, 1190000, 306000, 884000),
('850102-14-5678', 'Jun', 2024, 1200000, 310000, 890000),
('850102-14-5679', 'Jan', 2024, 780000, 255000, 525000),
('850102-14-5679', 'Feb', 2024, 785000, 253000, 532000),
('850102-14-5679', 'Mar', 2024, 790000, 251000, 539000),
('850102-14-5679', 'Apr', 2024, 795000, 249000, 546000),
('850102-14-5679', 'May', 2024, 800000, 250000, 550000),
('850102-14-5679', 'Jun', 2024, 800000, 250000, 550000);

-- Asset utilization
INSERT INTO asset_utilization (client_nric, utilization_percentage, liquid_assets, invested_assets, total_assets) VALUES
('850102-14-5678', 75, 250000, 900000, 1200000),
('850102-14-5679', 65, 180000, 520000, 800000);

-- Emergency fund analysis
INSERT INTO emergency_fund_analysis (client_nric, emergency_fund_ratio, three_month_expenses, current_emergency_fund, recommended_emergency_fund) VALUES
('850102-14-5678', 120, 105000, 126000, 105000),
('850102-14-5679', 100, 75000, 75000, 75000);

-- Seed data for liabilities_credit
INSERT INTO liabilities_credit (client_nric, liabilities, credit_lines) VALUES
  ('850102-14-5678', '[{"name": "Home Loan", "type": "Mortgage", "balance": 300000}]', '[{"name": "Visa Platinum", "type": "Credit Card", "limit": 20000}]'),
  ('850102-14-5679', '[{"name": "Home Loan", "type": "Mortgage", "balance": 200000}, {"name": "Personal Loan", "type": "Personal", "balance": 50000}]', '[{"name": "Mastercard Gold", "type": "Credit Card", "limit": 15000}]');

-- Enhanced Transaction Behavior Data

-- Test data for the new comprehensive client data structure
-- This will help test the EditClientInfo component

-- Insert test client with enhanced fields
INSERT INTO clients (nric, name, email, status, risk_profile, nationality, gender, marital_status, employment_status, relationship_tier, credit_score, dsr_ratio) 
VALUES (
  '900101-01-1234',
  'Ahmad bin Abdullah',
  'ahmad.abdullah@email.com',
  'Active',
  'Moderate',
  'Malaysian',
  'Male',
  'Married',
  'Employed',
  'Premium',
  750,
  35.5
) ON CONFLICT (nric) DO NOTHING;

-- Insert manual financial inputs for test client
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
) VALUES (
  '900101-01-1234',
  50000.00,
  100000.00,
  75000.00,
  25000.00,
  15000.00,
  200000.00,
  50000.00,
  15000.00,
  10000.00,
  0.00,
  8000.00,
  6000.00,
  18000.00,
  25000.00,
  '[
    {"name": "Savings Account", "type": "savings", "value": 50000, "count": 1},
    {"name": "Fixed Deposit", "type": "fixed_deposit", "value": 100000, "count": 2},
    {"name": "Unit Trust", "type": "investment", "value": 75000, "count": 3},
    {"name": "Life Insurance", "type": "insurance", "value": 25000, "count": 1}
  ]'
) ON CONFLICT (client_nric) DO NOTHING;

-- Insert transaction behavioral data for test client
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
  unusual_transactions
) VALUES (
  '900101-01-1234',
  '{
    "groceries": 1200.00,
    "utilities": 500.00,
    "transportation": 800.00,
    "entertainment": 600.00,
    "shopping": 1500.00,
    "dining": 1000.00
  }',
  15000.00,
  25,
  8000.00,
  45,
  3000.00,
  8,
  5000.00,
  3,
  '[
    {"date": "2024-01-15", "description": "Large transfer to investment account", "amount": 10000, "type": "investment"},
    {"date": "2024-02-20", "description": "Unusual ATM withdrawal", "amount": 2000, "type": "atm"}
  ]'
) ON CONFLICT (client_nric) DO NOTHING;

-- Recent transactions summary
INSERT INTO recent_transactions_summary (client_nric, total_transactions, total_volume, average_transaction, most_active_day, period_days) VALUES
  ('850102-14-5678', 52, 15800, 304, 'Wednesday', 30),
  ('850102-14-5679', 47, 12450, 265, 'Wednesday', 30);

-- Categorised spending
INSERT INTO categorised_spending (client_nric, category, amount, transaction_count, period_month) VALUES
  -- David Williams spending
  ('850102-14-5678', 'Groceries', 2800, 12, 'Dec 2024'),
  ('850102-14-5678', 'Travel', 2200, 3, 'Dec 2024'),
  ('850102-14-5678', 'Utilities', 950, 4, 'Dec 2024'),
  ('850102-14-5678', 'Entertainment', 850, 8, 'Dec 2024'),
  ('850102-14-5678', 'Transportation', 650, 15, 'Dec 2024'),
  ('850102-14-5678', 'Healthcare', 420, 3, 'Dec 2024'),
  -- Sarah Johnson spending
  ('850102-14-5679', 'Groceries', 2340, 10, 'Dec 2024'),
  ('850102-14-5679', 'Travel', 1890, 2, 'Dec 2024'),
  ('850102-14-5679', 'Utilities', 850, 3, 'Dec 2024'),
  ('850102-14-5679', 'Entertainment', 720, 6, 'Dec 2024'),
  ('850102-14-5679', 'Transportation', 580, 12, 'Dec 2024'),
  ('850102-14-5679', 'Healthcare', 380, 2, 'Dec 2024');

-- Large or unusual transactions
INSERT INTO large_unusual_transactions (client_nric, transaction_type, amount, description, transaction_date, recipient_account, merchant_name, risk_level, flagged) VALUES
  ('850102-14-5678', 'large_transfer', 5000, 'Large Transfer to John Smith', '2024-12-15', '1234567890', 'John Smith', 'high', true),
  ('850102-14-5678', 'unusual_spending', 2800, 'Unusual spending at Electronics Store', '2024-12-12', NULL, 'Electronics Store', 'medium', true),
  ('850102-14-5679', 'large_transfer', 3500, 'Large Transfer to Family Member', '2024-12-14', '9876543210', 'Family Member', 'medium', true),
  ('850102-14-5679', 'unusual_spending', 1800, 'Unusual spending at Luxury Store', '2024-12-10', NULL, 'Luxury Store', 'medium', true);

-- Fund transfers
INSERT INTO fund_transfers (client_nric, transfer_type, amount, recipient_name, recipient_account, transfer_date, transaction_count) VALUES
  -- David Williams transfers
  ('850102-14-5678', 'intra_bank', 3200, 'John Smith', '1234567890', '2024-12-15', 8),
  ('850102-14-5678', 'inter_bank', 1800, 'Jane Doe', 'CIMB123456', '2024-12-10', 3),
  ('850102-14-5678', 'cross_border', 2500, 'International Recipient', 'SWIFT123456', '2024-12-05', 1),
  -- Sarah Johnson transfers
  ('850102-14-5679', 'intra_bank', 2800, 'Family Member', '9876543210', '2024-12-14', 6),
  ('850102-14-5679', 'inter_bank', 1200, 'Business Partner', 'MAYBANK789', '2024-12-08', 2),
  ('850102-14-5679', 'cross_border', 1800, 'Singapore Family', 'DBS123456', '2024-12-03', 1);

-- ATM and POS activity
INSERT INTO atm_pos_activity (client_nric, activity_type, amount, transaction_count, average_amount, location, merchant_category, period_month) VALUES
  -- David Williams ATM/POS
  ('850102-14-5678', 'atm_withdrawal', 1500, 5, 300, 'Kuala Lumpur', NULL, 'Dec 2024'),
  ('850102-14-5678', 'pos_purchase', 4680, 23, 203, 'Various', 'Retail', 'Dec 2024'),
  -- Sarah Johnson ATM/POS
  ('850102-14-5679', 'atm_withdrawal', 1200, 4, 300, 'Petaling Jaya', NULL, 'Dec 2024'),
  ('850102-14-5679', 'pos_purchase', 3850, 19, 203, 'Various', 'Retail', 'Dec 2024');

-- FX transactions
INSERT INTO fx_transactions (client_nric, transaction_type, base_currency, quote_currency, base_amount, quote_amount, exchange_rate, transaction_date, recipient_country, recipient_name) VALUES
  ('850102-14-5678', 'currency_purchase', 'MYR', 'USD', 2075, 500, 4.15, '2024-12-10', 'United States', NULL),
  ('850102-14-5678', 'international_transfer', 'MYR', 'SGD', 2500, 750, 3.33, '2024-12-08', 'Singapore', 'Singapore Family'),
  ('850102-14-5679', 'currency_purchase', 'MYR', 'USD', 1650, 400, 4.125, '2024-12-12', 'United States', NULL),
  ('850102-14-5679', 'international_transfer', 'MYR', 'SGD', 1800, 540, 3.33, '2024-12-03', 'Singapore', 'Singapore Family'); 