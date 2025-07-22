-- Test data for the new comprehensive client data structure
-- This will help test the EditClientInfo component

-- Insert test client
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

-- Insert manual financial inputs
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

-- Insert transaction behavioral data
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