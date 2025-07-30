-- Sample Transaction Data for 5 Clients
-- This will provide diverse spending patterns for testing the AI analyzer

-- Clear existing transaction data for these clients
DELETE FROM transactions WHERE client_nric IN (
  '850303-03-3456', -- Carol Tan
  '870505-05-5678', -- Eve Wong  
  '880202-02-2345', -- Bob Lee
  '900101-01-1234', -- Alice Tan
  '920404-04-4567'  -- David Ng
);

-- Carol Tan (850303-03-3456) - Conservative, Dormant
-- Primarily shops at Cold Storage, minimal dining, some fuel
INSERT INTO transactions (client_nric, transaction_date, amount, type, category, description, channel, currency) VALUES
-- Grocery shopping at Cold Storage
('850303-03-3456', '2024-06-01', -85.50, 'purchase', 'groceries', 'Cold Storage', 'POS', 'MYR'),
('850303-03-3456', '2024-06-08', -92.30, 'purchase', 'groceries', 'Cold Storage', 'POS', 'MYR'),
('850303-03-3456', '2024-06-15', -78.90, 'purchase', 'groceries', 'Cold Storage', 'POS', 'MYR'),
('850303-03-3456', '2024-06-22', -105.20, 'purchase', 'groceries', 'Cold Storage', 'POS', 'MYR'),
-- Fuel at Shell
('850303-03-3456', '2024-06-03', -120.00, 'purchase', 'fuel', 'Shell', 'POS', 'MYR'),
('850303-03-3456', '2024-06-17', -95.50, 'purchase', 'fuel', 'Shell', 'POS', 'MYR'),
-- Minimal dining
('850303-03-3456', '2024-06-10', -45.80, 'purchase', 'dining', 'McDonalds', 'POS', 'MYR'),
-- Utilities
('850303-03-3456', '2024-06-05', -180.00, 'purchase', 'utilities', 'TNB', 'Online', 'MYR'),
('850303-03-3456', '2024-06-20', -65.00, 'purchase', 'utilities', 'Water bill', 'Online', 'MYR'),
-- Salary
('850303-03-3456', '2024-06-01', 3500.00, 'deposit', 'salary', 'Monthly salary', 'Branch', 'MYR'),
-- ATM withdrawals
('850303-03-3456', '2024-06-12', -300.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR'),
('850303-03-3456', '2024-06-25', -200.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR');

-- Eve Wong (870505-05-5678) - Balanced, Active
-- Shops at Tesco, frequent dining, Petronas fuel, online shopping
INSERT INTO transactions (client_nric, transaction_date, amount, type, category, description, channel, currency) VALUES
-- Grocery shopping at Tesco
('870505-05-5678', '2024-06-02', -156.80, 'purchase', 'groceries', 'Tesco', 'POS', 'MYR'),
('870505-05-5678', '2024-06-09', -134.50, 'purchase', 'groceries', 'Tesco', 'POS', 'MYR'),
('870505-05-5678', '2024-06-16', -189.20, 'purchase', 'groceries', 'Tesco', 'POS', 'MYR'),
('870505-05-5678', '2024-06-23', -145.60, 'purchase', 'groceries', 'Tesco', 'POS', 'MYR'),
-- Frequent dining
('870505-05-5678', '2024-06-01', -85.00, 'purchase', 'dining', 'Restaurant ABC', 'POS', 'MYR'),
('870505-05-5678', '2024-06-03', -65.50, 'purchase', 'dining', 'Cafe XYZ', 'POS', 'MYR'),
('870505-05-5678', '2024-06-05', -120.00, 'purchase', 'dining', 'Fine Dining', 'POS', 'MYR'),
('870505-05-5678', '2024-06-08', -75.80, 'purchase', 'dining', 'Food Court', 'POS', 'MYR'),
('870505-05-5678', '2024-06-10', -95.20, 'purchase', 'dining', 'Restaurant ABC', 'POS', 'MYR'),
('870505-05-5678', '2024-06-12', -88.90, 'purchase', 'dining', 'Cafe XYZ', 'POS', 'MYR'),
('870505-05-5678', '2024-06-15', -110.00, 'purchase', 'dining', 'Fine Dining', 'POS', 'MYR'),
('870505-05-5678', '2024-06-18', -70.50, 'purchase', 'dining', 'Food Court', 'POS', 'MYR'),
('870505-05-5678', '2024-06-20', -92.30, 'purchase', 'dining', 'Restaurant ABC', 'POS', 'MYR'),
('870505-05-5678', '2024-06-22', -85.60, 'purchase', 'dining', 'Cafe XYZ', 'POS', 'MYR'),
('870505-05-5678', '2024-06-25', -105.80, 'purchase', 'dining', 'Fine Dining', 'POS', 'MYR'),
-- Fuel at Petronas
('870505-05-5678', '2024-06-04', -150.00, 'purchase', 'fuel', 'Petronas', 'POS', 'MYR'),
('870505-05-5678', '2024-06-18', -135.50, 'purchase', 'fuel', 'Petronas', 'POS', 'MYR'),
-- Online shopping
('870505-05-5678', '2024-06-07', -250.00, 'purchase', 'shopping', 'Shopee', 'Online', 'MYR'),
('870505-05-5678', '2024-06-14', -180.00, 'purchase', 'shopping', 'Lazada', 'Online', 'MYR'),
('870505-05-5678', '2024-06-21', -320.00, 'purchase', 'shopping', 'Amazon', 'Online', 'MYR'),
-- Utilities
('870505-05-5678', '2024-06-06', -220.00, 'purchase', 'utilities', 'TNB', 'Online', 'MYR'),
('870505-05-5678', '2024-06-19', -85.00, 'purchase', 'utilities', 'Water bill', 'Online', 'MYR'),
-- Salary
('870505-05-5678', '2024-06-01', 4500.00, 'deposit', 'salary', 'Monthly salary', 'Branch', 'MYR'),
-- ATM withdrawals
('870505-05-5678', '2024-06-11', -400.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR'),
('870505-05-5678', '2024-06-24', -300.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR');

-- Bob Lee (880202-02-2345) - Conservative, Active
-- Shops at Giant, minimal dining, Caltex fuel, conservative spending
INSERT INTO transactions (client_nric, transaction_date, amount, type, category, description, channel, currency) VALUES
-- Grocery shopping at Giant
('880202-02-2345', '2024-06-01', -95.60, 'purchase', 'groceries', 'Giant', 'POS', 'MYR'),
('880202-02-2345', '2024-06-08', -87.30, 'purchase', 'groceries', 'Giant', 'POS', 'MYR'),
('880202-02-2345', '2024-06-15', -102.40, 'purchase', 'groceries', 'Giant', 'POS', 'MYR'),
('880202-02-2345', '2024-06-22', -89.70, 'purchase', 'groceries', 'Giant', 'POS', 'MYR'),
-- Minimal dining
('880202-02-2345', '2024-06-05', -35.50, 'purchase', 'dining', 'McDonalds', 'POS', 'MYR'),
('880202-02-2345', '2024-06-12', -42.80, 'purchase', 'dining', 'KFC', 'POS', 'MYR'),
('880202-02-2345', '2024-06-19', -38.90, 'purchase', 'dining', 'Pizza Hut', 'POS', 'MYR'),
-- Fuel at Caltex
('880202-02-2345', '2024-06-03', -110.00, 'purchase', 'fuel', 'Caltex', 'POS', 'MYR'),
('880202-02-2345', '2024-06-17', -95.50, 'purchase', 'fuel', 'Caltex', 'POS', 'MYR'),
-- Utilities
('880202-02-2345', '2024-06-06', -165.00, 'purchase', 'utilities', 'TNB', 'Online', 'MYR'),
('880202-02-2345', '2024-06-20', -70.00, 'purchase', 'utilities', 'Water bill', 'Online', 'MYR'),
-- Salary
('880202-02-2345', '2024-06-01', 3800.00, 'deposit', 'salary', 'Monthly salary', 'Branch', 'MYR'),
-- ATM withdrawals
('880202-02-2345', '2024-06-10', -250.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR'),
('880202-02-2345', '2024-06-23', -200.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR'),
-- Investment transfer
('880202-02-2345', '2024-06-15', -500.00, 'transfer', 'investment', 'Transfer to investment', 'Online', 'MYR');

-- Alice Tan (900101-01-1234) - Moderate, Active
-- Shops at AEON, moderate dining, Shell fuel, some online shopping
INSERT INTO transactions (client_nric, transaction_date, amount, type, category, description, channel, currency) VALUES
-- Grocery shopping at AEON
('900101-01-1234', '2024-06-02', -125.40, 'purchase', 'groceries', 'AEON', 'POS', 'MYR'),
('900101-01-1234', '2024-06-09', -118.70, 'purchase', 'groceries', 'AEON', 'POS', 'MYR'),
('900101-01-1234', '2024-06-16', -135.20, 'purchase', 'groceries', 'AEON', 'POS', 'MYR'),
('900101-01-1234', '2024-06-23', -142.80, 'purchase', 'groceries', 'AEON', 'POS', 'MYR'),
-- Moderate dining
('900101-01-1234', '2024-06-01', -75.00, 'purchase', 'dining', 'Restaurant ABC', 'POS', 'MYR'),
('900101-01-1234', '2024-06-04', -55.50, 'purchase', 'dining', 'Cafe XYZ', 'POS', 'MYR'),
('900101-01-1234', '2024-06-08', -85.20, 'purchase', 'dining', 'Food Court', 'POS', 'MYR'),
('900101-01-1234', '2024-06-11', -92.80, 'purchase', 'dining', 'Restaurant ABC', 'POS', 'MYR'),
('900101-01-1234', '2024-06-15', -68.90, 'purchase', 'dining', 'Cafe XYZ', 'POS', 'MYR'),
('900101-01-1234', '2024-06-18', -78.50, 'purchase', 'dining', 'Food Court', 'POS', 'MYR'),
('900101-01-1234', '2024-06-22', -88.30, 'purchase', 'dining', 'Restaurant ABC', 'POS', 'MYR'),
-- Fuel at Shell
('900101-01-1234', '2024-06-05', -140.00, 'purchase', 'fuel', 'Shell', 'POS', 'MYR'),
('900101-01-1234', '2024-06-19', -125.50, 'purchase', 'fuel', 'Shell', 'POS', 'MYR'),
-- Online shopping
('900101-01-1234', '2024-06-07', -180.00, 'purchase', 'shopping', 'Shopee', 'Online', 'MYR'),
('900101-01-1234', '2024-06-14', -220.00, 'purchase', 'shopping', 'Lazada', 'Online', 'MYR'),
-- Utilities
('900101-01-1234', '2024-06-06', -195.00, 'purchase', 'utilities', 'TNB', 'Online', 'MYR'),
('900101-01-1234', '2024-06-20', -75.00, 'purchase', 'utilities', 'Water bill', 'Online', 'MYR'),
-- Salary
('900101-01-1234', '2024-06-01', 4200.00, 'deposit', 'salary', 'Monthly salary', 'Branch', 'MYR'),
-- ATM withdrawals
('900101-01-1234', '2024-06-12', -350.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR'),
('900101-01-1234', '2024-06-25', -280.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR'),
-- Travel
('900101-01-1234', '2024-06-10', -450.00, 'purchase', 'travel', 'Grab', 'Online', 'MYR'),
('900101-01-1234', '2024-06-17', -380.00, 'purchase', 'travel', 'Grab', 'Online', 'MYR');

-- David Ng (920404-04-4567) - Aggressive, Active
-- Shops at Jaya Grocer, frequent dining, Petronas fuel, heavy online shopping, luxury spending
INSERT INTO transactions (client_nric, transaction_date, amount, type, category, description, channel, currency) VALUES
-- Grocery shopping at Jaya Grocer (Premium)
('920404-04-4567', '2024-06-01', -245.80, 'purchase', 'groceries', 'Jaya Grocer', 'POS', 'MYR'),
('920404-04-4567', '2024-06-08', -298.50, 'purchase', 'groceries', 'Jaya Grocer', 'POS', 'MYR'),
('920404-04-4567', '2024-06-15', -267.90, 'purchase', 'groceries', 'Jaya Grocer', 'POS', 'MYR'),
('920404-04-4567', '2024-06-22', -312.40, 'purchase', 'groceries', 'Jaya Grocer', 'POS', 'MYR'),
-- Frequent premium dining
('920404-04-4567', '2024-06-01', -180.00, 'purchase', 'dining', 'Fine Dining Restaurant', 'POS', 'MYR'),
('920404-04-4567', '2024-06-03', -145.50, 'purchase', 'dining', 'Premium Cafe', 'POS', 'MYR'),
('920404-04-4567', '2024-06-05', -220.00, 'purchase', 'dining', 'Luxury Restaurant', 'POS', 'MYR'),
('920404-04-4567', '2024-06-07', -165.80, 'purchase', 'dining', 'Fine Dining Restaurant', 'POS', 'MYR'),
('920404-04-4567', '2024-06-09', -195.20, 'purchase', 'dining', 'Premium Cafe', 'POS', 'MYR'),
('920404-04-4567', '2024-06-11', -250.00, 'purchase', 'dining', 'Luxury Restaurant', 'POS', 'MYR'),
('920404-04-4567', '2024-06-13', -175.90, 'purchase', 'dining', 'Fine Dining Restaurant', 'POS', 'MYR'),
('920404-04-4567', '2024-06-15', -210.50, 'purchase', 'dining', 'Premium Cafe', 'POS', 'MYR'),
('920404-04-4567', '2024-06-17', -285.00, 'purchase', 'dining', 'Luxury Restaurant', 'POS', 'MYR'),
('920404-04-4567', '2024-06-19', -190.30, 'purchase', 'dining', 'Fine Dining Restaurant', 'POS', 'MYR'),
('920404-04-4567', '2024-06-21', -225.80, 'purchase', 'dining', 'Premium Cafe', 'POS', 'MYR'),
('920404-04-4567', '2024-06-23', -260.00, 'purchase', 'dining', 'Luxury Restaurant', 'POS', 'MYR'),
('920404-04-4567', '2024-06-25', -200.40, 'purchase', 'dining', 'Fine Dining Restaurant', 'POS', 'MYR'),
-- Fuel at Petronas
('920404-04-4567', '2024-06-04', -180.00, 'purchase', 'fuel', 'Petronas', 'POS', 'MYR'),
('920404-04-4567', '2024-06-18', -165.50, 'purchase', 'fuel', 'Petronas', 'POS', 'MYR'),
-- Heavy online shopping
('920404-04-4567', '2024-06-02', -450.00, 'purchase', 'shopping', 'Shopee', 'Online', 'MYR'),
('920404-04-4567', '2024-06-06', -380.00, 'purchase', 'shopping', 'Lazada', 'Online', 'MYR'),
('920404-04-4567', '2024-06-10', -520.00, 'purchase', 'shopping', 'Amazon', 'Online', 'MYR'),
('920404-04-4567', '2024-06-14', -420.00, 'purchase', 'shopping', 'Shopee', 'Online', 'MYR'),
('920404-04-4567', '2024-06-20', -480.00, 'purchase', 'shopping', 'Lazada', 'Online', 'MYR'),
('920404-04-4567', '2024-06-24', -550.00, 'purchase', 'shopping', 'Amazon', 'Online', 'MYR'),
-- Utilities
('920404-04-4567', '2024-06-08', -280.00, 'purchase', 'utilities', 'TNB', 'Online', 'MYR'),
('920404-04-4567', '2024-06-22', -95.00, 'purchase', 'utilities', 'Water bill', 'Online', 'MYR'),
-- High salary
('920404-04-4567', '2024-06-01', 8000.00, 'deposit', 'salary', 'Monthly salary', 'Branch', 'MYR'),
-- ATM withdrawals
('920404-04-4567', '2024-06-12', -600.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR'),
('920404-04-4567', '2024-06-26', -500.00, 'withdrawal', 'cash', 'ATM withdrawal', 'ATM', 'MYR'),
-- Luxury travel
('920404-04-4567', '2024-06-09', -800.00, 'purchase', 'travel', 'Grab Premium', 'Online', 'MYR'),
('920404-04-4567', '2024-06-16', -750.00, 'purchase', 'travel', 'Grab Premium', 'Online', 'MYR'),
-- Foreign exchange
('920404-04-4567', '2024-06-15', -2000.00, 'fx', 'travel', 'Currency exchange', 'Branch', 'MYR'),
-- Investment transfer
('920404-04-4567', '2024-06-20', -1000.00, 'transfer', 'investment', 'Transfer to investment', 'Online', 'MYR');

-- Verify the data was inserted correctly
SELECT 
  client_nric,
  COUNT(*) as transaction_count,
  SUM(CASE WHEN category = 'groceries' THEN 1 ELSE 0 END) as grocery_transactions,
  SUM(CASE WHEN category = 'dining' THEN 1 ELSE 0 END) as dining_transactions,
  SUM(CASE WHEN category = 'fuel' THEN 1 ELSE 0 END) as fuel_transactions,
  SUM(CASE WHEN channel = 'Online' THEN 1 ELSE 0 END) as online_transactions
FROM transactions 
WHERE client_nric IN ('850303-03-3456', '870505-05-5678', '880202-02-2345', '900101-01-1234', '920404-04-4567')
GROUP BY client_nric
ORDER BY client_nric; 