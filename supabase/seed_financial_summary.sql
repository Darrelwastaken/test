-- Seed data for Financial Summary tables
-- This file populates the new financial summary tables with sample data

-- Insert financial assets data
INSERT INTO financial_assets (client_nric, total_assets, total_liabilities, net_position, casa_balance, fixed_deposits, investment_funds, insurance_policies, other_assets) VALUES
('880101015432', 1250000, 450000, 800000, 150000, 500000, 400000, 200000, 0),
('880202025678', 850000, 320000, 530000, 80000, 300000, 250000, 150000, 70000),
('880303036789', 2100000, 680000, 1420000, 300000, 800000, 600000, 400000, 0),
('880404047890', 650000, 280000, 370000, 50000, 200000, 150000, 100000, 150000),
('880505058901', 1800000, 520000, 1280000, 200000, 600000, 500000, 300000, 200000);

-- Insert monthly cash flow data (last 6 months)
INSERT INTO monthly_cashflow (client_nric, month_year, inflow, outflow, net_flow) VALUES
-- Client 1
('880101015432', '2024-01', 85000, 62000, 23000),
('880101015432', '2024-02', 87000, 65000, 22000),
('880101015432', '2024-03', 82000, 60000, 22000),
('880101015432', '2024-04', 89000, 68000, 21000),
('880101015432', '2024-05', 86000, 63000, 23000),
('880101015432', '2024-06', 88000, 64000, 24000),

-- Client 2
('880202025678', '2024-01', 65000, 48000, 17000),
('880202025678', '2024-02', 68000, 52000, 16000),
('880202025678', '2024-03', 62000, 45000, 17000),
('880202025678', '2024-04', 70000, 54000, 16000),
('880202025678', '2024-05', 66000, 49000, 17000),
('880202025678', '2024-06', 69000, 51000, 18000),

-- Client 3
('880303036789', '2024-01', 120000, 85000, 35000),
('880303036789', '2024-02', 125000, 88000, 37000),
('880303036789', '2024-03', 118000, 82000, 36000),
('880303036789', '2024-04', 130000, 92000, 38000),
('880303036789', '2024-05', 122000, 86000, 36000),
('880303036789', '2024-06', 128000, 90000, 38000),

-- Client 4
('880404047890', '2024-01', 45000, 38000, 7000),
('880404047890', '2024-02', 48000, 42000, 6000),
('880404047890', '2024-03', 42000, 35000, 7000),
('880404047890', '2024-04', 50000, 44000, 6000),
('880404047890', '2024-05', 46000, 39000, 7000),
('880404047890', '2024-06', 49000, 41000, 8000),

-- Client 5
('880505058901', '2024-01', 95000, 68000, 27000),
('880505058901', '2024-02', 98000, 72000, 26000),
('880505058901', '2024-03', 92000, 65000, 27000),
('880505058901', '2024-04', 100000, 75000, 25000),
('880505058901', '2024-05', 96000, 69000, 27000),
('880505058901', '2024-06', 99000, 71000, 28000);

-- Insert product holdings data
INSERT INTO product_holdings (client_nric, product_name, product_type, count, value) VALUES
-- Client 1
('880101015432', 'Savings Account', 'savings', 2, 150000),
('880101015432', 'Fixed Deposits', 'fixed_deposit', 3, 500000),
('880101015432', 'Investment Funds', 'investment', 4, 400000),
('880101015432', 'Insurance Policies', 'insurance', 2, 200000),

-- Client 2
('880202025678', 'Savings Account', 'savings', 1, 80000),
('880202025678', 'Fixed Deposits', 'fixed_deposit', 2, 300000),
('880202025678', 'Investment Funds', 'investment', 3, 250000),
('880202025678', 'Insurance Policies', 'insurance', 1, 150000),
('880202025678', 'Unit Trusts', 'investment', 1, 70000),

-- Client 3
('880303036789', 'Savings Account', 'savings', 3, 300000),
('880303036789', 'Fixed Deposits', 'fixed_deposit', 4, 800000),
('880303036789', 'Investment Funds', 'investment', 5, 600000),
('880303036789', 'Insurance Policies', 'insurance', 3, 400000),

-- Client 4
('880404047890', 'Savings Account', 'savings', 1, 50000),
('880404047890', 'Fixed Deposits', 'fixed_deposit', 1, 200000),
('880404047890', 'Investment Funds', 'investment', 2, 150000),
('880404047890', 'Insurance Policies', 'insurance', 1, 100000),
('880404047890', 'Other Investments', 'investment', 1, 150000),

-- Client 5
('880505058901', 'Savings Account', 'savings', 2, 200000),
('880505058901', 'Fixed Deposits', 'fixed_deposit', 3, 600000),
('880505058901', 'Investment Funds', 'investment', 4, 500000),
('880505058901', 'Insurance Policies', 'insurance', 2, 300000),
('880505058901', 'Unit Trusts', 'investment', 1, 200000);

-- Insert relationship and profitability data
INSERT INTO relationship_profitability (client_nric, relationship_tier, profitability_score, customer_lifetime_value) VALUES
('880101015432', 'Premium', 85, 250000),
('880202025678', 'Standard', 65, 180000),
('880303036789', 'Priority', 92, 350000),
('880404047890', 'Standard', 55, 120000),
('880505058901', 'Premium', 88, 280000);

-- Insert credit utilization data
INSERT INTO credit_utilization (client_nric, total_limit, used_amount) VALUES
('880101015432', 100000, 35000),
('880202025678', 80000, 28000),
('880303036789', 150000, 45000),
('880404047890', 60000, 25000),
('880505058901', 120000, 38000);

-- Insert risk indicators data
INSERT INTO risk_indicators (client_nric, indicator_type, status, severity, value, threshold) VALUES
-- Client 1
('880101015432', 'late_payment', 'None', 'low', 0, 0),
('880101015432', 'overdraft_usage', 'None', 'low', 0, 0),
('880101015432', 'credit_score', 'Excellent', 'low', 750, 700),
('880101015432', 'dsr_ratio', 'Healthy', 'low', 0.25, 0.4),

-- Client 2
('880202025678', 'late_payment', 'None', 'low', 0, 0),
('880202025678', 'overdraft_usage', 'None', 'low', 0, 0),
('880202025678', 'credit_score', 'Good', 'low', 720, 700),
('880202025678', 'dsr_ratio', 'Healthy', 'low', 0.32, 0.4),

-- Client 3
('880303036789', 'late_payment', 'None', 'low', 0, 0),
('880303036789', 'overdraft_usage', 'None', 'low', 0, 0),
('880303036789', 'credit_score', 'Excellent', 'low', 780, 700),
('880303036789', 'dsr_ratio', 'Healthy', 'low', 0.22, 0.4),

-- Client 4
('880404047890', 'late_payment', 'None', 'low', 0, 0),
('880404047890', 'overdraft_usage', 'None', 'low', 0, 0),
('880404047890', 'credit_score', 'Good', 'low', 710, 700),
('880404047890', 'dsr_ratio', 'Healthy', 'low', 0.35, 0.4),

-- Client 5
('880505058901', 'late_payment', 'None', 'low', 0, 0),
('880505058901', 'overdraft_usage', 'None', 'low', 0, 0),
('880505058901', 'credit_score', 'Excellent', 'low', 760, 700),
('880505058901', 'dsr_ratio', 'Healthy', 'low', 0.28, 0.4);

-- Insert financial trends data (6-month overview)
INSERT INTO financial_trends (client_nric, month, year, total_assets, total_liabilities, net_worth) VALUES
-- Client 1
('880101015432', 'Jan', 2024, 1100000, 480000, 620000),
('880101015432', 'Feb', 2024, 1150000, 470000, 680000),
('880101015432', 'Mar', 2024, 1180000, 465000, 715000),
('880101015432', 'Apr', 2024, 1200000, 460000, 740000),
('880101015432', 'May', 2024, 1220000, 455000, 765000),
('880101015432', 'Jun', 2024, 1250000, 450000, 800000),

-- Client 2
('880202025678', 'Jan', 2024, 800000, 340000, 460000),
('880202025678', 'Feb', 2024, 820000, 335000, 485000),
('880202025678', 'Mar', 2024, 830000, 330000, 500000),
('880202025678', 'Apr', 2024, 840000, 325000, 515000),
('880202025678', 'May', 2024, 845000, 322000, 523000),
('880202025678', 'Jun', 2024, 850000, 320000, 530000),

-- Client 3
('880303036789', 'Jan', 2024, 1950000, 700000, 1250000),
('880303036789', 'Feb', 2024, 2000000, 695000, 1305000),
('880303036789', 'Mar', 2024, 2050000, 690000, 1360000),
('880303036789', 'Apr', 2024, 2080000, 685000, 1395000),
('880303036789', 'May', 2024, 2090000, 682000, 1408000),
('880303036789', 'Jun', 2024, 2100000, 680000, 1420000),

-- Client 4
('880404047890', 'Jan', 2024, 600000, 300000, 300000),
('880404047890', 'Feb', 2024, 610000, 295000, 315000),
('880404047890', 'Mar', 2024, 620000, 290000, 330000),
('880404047890', 'Apr', 2024, 630000, 285000, 345000),
('880404047890', 'May', 2024, 640000, 282000, 358000),
('880404047890', 'Jun', 2024, 650000, 280000, 370000),

-- Client 5
('880505058901', 'Jan', 2024, 1700000, 540000, 1160000),
('880505058901', 'Feb', 2024, 1720000, 535000, 1185000),
('880505058901', 'Mar', 2024, 1750000, 530000, 1220000),
('880505058901', 'Apr', 2024, 1770000, 525000, 1245000),
('880505058901', 'May', 2024, 1785000, 522000, 1263000),
('880505058901', 'Jun', 2024, 1800000, 520000, 1280000);

-- Insert asset utilization data
INSERT INTO asset_utilization (client_nric, liquid_assets, invested_assets, total_assets) VALUES
('880101015432', 150000, 1100000, 1250000),
('880202025678', 80000, 770000, 850000),
('880303036789', 300000, 1800000, 2100000),
('880404047890', 50000, 600000, 650000),
('880505058901', 200000, 1600000, 1800000);

-- Insert emergency fund analysis data
INSERT INTO emergency_fund_analysis (client_nric, emergency_fund_ratio, three_month_expenses, current_emergency_fund, recommended_emergency_fund) VALUES
('880101015432', 0.65, 186000, 150000, 186000),
('880202025678', 0.45, 144000, 80000, 144000),
('880303036789', 0.80, 276000, 300000, 276000),
('880404047890', 0.35, 126000, 50000, 126000),
('880505058901', 0.70, 204000, 200000, 204000); 