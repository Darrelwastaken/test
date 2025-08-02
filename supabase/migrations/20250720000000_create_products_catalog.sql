-- Create AmBank Products Catalog
-- Migration: 20250720000000_create_products_catalog.sql

-- Products catalog table
CREATE TABLE products_catalog (
    id SERIAL PRIMARY KEY,
    product_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- 'personal_banking', 'cards', 'loans_financing', 'wealth_management', 'insurance_takaful', 'corporate_treasury'
    subcategory TEXT NOT NULL, -- 'savings', 'current', 'investment', 'credit', 'debit', 'prepaid', 'insurance', 'service'
    type TEXT NOT NULL, -- Specific product type
    features JSONB, -- Array of features
    requirements JSONB, -- Array of requirements
    suitability TEXT NOT NULL DEFAULT 'Medium', -- 'High', 'Medium', 'Low'
    expected_return TEXT, -- For investment products
    risk_level TEXT, -- 'Low', 'Medium', 'High'
    interest_rate TEXT, -- For loans and deposits
    annual_fee TEXT, -- For cards
    monthly_premium TEXT, -- For insurance
    min_deposit NUMERIC, -- Minimum deposit amount
    min_investment NUMERIC, -- Minimum investment amount
    max_amount NUMERIC, -- Maximum loan amount
    credit_limit TEXT, -- For credit cards
    coverage TEXT, -- For insurance
    service_fee TEXT, -- For services
    is_islamic BOOLEAN DEFAULT FALSE, -- Islamic banking option
    is_active BOOLEAN DEFAULT TRUE, -- Product availability
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_catalog_category ON products_catalog(category);
CREATE INDEX idx_products_catalog_subcategory ON products_catalog(subcategory);
CREATE INDEX idx_products_catalog_type ON products_catalog(type);
CREATE INDEX idx_products_catalog_suitability ON products_catalog(suitability);
CREATE INDEX idx_products_catalog_islamic ON products_catalog(is_islamic);
CREATE INDEX idx_products_catalog_active ON products_catalog(is_active);

-- Add constraints
ALTER TABLE products_catalog ADD CONSTRAINT check_suitability CHECK (suitability IN ('High', 'Medium', 'Low'));
ALTER TABLE products_catalog ADD CONSTRAINT check_risk_level CHECK (risk_level IN ('Low', 'Medium', 'High'));

-- Insert Personal Banking Products
INSERT INTO products_catalog (product_id, name, description, category, subcategory, type, features, requirements, suitability, expected_return, risk_level, min_deposit, is_islamic) VALUES
-- Savings Accounts
('ambank_amvault_savings', 'AmVault Savings Account / Account‑i', 'High-yield savings account with competitive interest rates and Islamic banking options', 'personal_banking', 'savings', 'High-Yield Savings', '["High interest rates", "Islamic banking option", "Online banking", "Mobile app access", "No monthly fees"]', '["Minimum balance: RM100", "Valid Malaysian ID", "Age 18+"]', 'High', '3.0-4.2%', 'Low', 100, FALSE),
('ambank_amvault_savings_i', 'AmVault Savings Account‑i', 'High-yield Islamic savings account with competitive profit rates', 'personal_banking', 'savings', 'Islamic Savings', '["High profit rates", "Shariah-compliant", "Online banking", "Mobile app access", "No monthly fees"]', '["Minimum balance: RM100", "Valid Malaysian ID", "Age 18+", "Islamic preference"]', 'High', '3.0-4.2%', 'Low', 100, TRUE),
('ambank_true_savers', 'TRUE Savers Account / Account‑i', 'Savings account with bonus interest for regular deposits and Islamic banking option', 'personal_banking', 'savings', 'Bonus Savings', '["Bonus interest rates", "Islamic banking option", "Regular deposit rewards", "No monthly fees"]', '["Minimum balance: RM100", "Monthly deposit commitment", "Valid Malaysian ID"]', 'High', '2.8-3.8%', 'Low', 100, FALSE),
('ambank_true_savers_i', 'TRUE Savers Account‑i', 'Islamic savings account with bonus profit for regular deposits', 'personal_banking', 'savings', 'Islamic Bonus Savings', '["Bonus profit rates", "Shariah-compliant", "Regular deposit rewards", "No monthly fees"]', '["Minimum balance: RM100", "Monthly deposit commitment", "Valid Malaysian ID", "Islamic preference"]', 'High', '2.8-3.8%', 'Low', 100, TRUE),
('ambank_basic_savings', 'Basic Savings Account / Account‑i', 'Traditional savings account with basic banking services and Islamic option', 'personal_banking', 'savings', 'Basic Savings', '["Basic banking services", "Islamic banking option", "ATM access", "Online banking"]', '["Minimum balance: RM100", "Valid Malaysian ID", "Age 18+"]', 'High', '2.0-2.5%', 'Low', 100, FALSE),
('ambank_basic_savings_i', 'Basic Savings Account‑i', 'Traditional Islamic savings account with basic banking services', 'personal_banking', 'savings', 'Islamic Basic Savings', '["Basic banking services", "Shariah-compliant", "ATM access", "Online banking"]', '["Minimum balance: RM100", "Valid Malaysian ID", "Age 18+", "Islamic preference"]', 'High', '2.0-2.5%', 'Low', 100, TRUE),
('ambank_amwafeeq', 'AmWafeeq Account‑i', 'Islamic savings account with profit sharing and Shariah-compliant banking', 'personal_banking', 'savings', 'Islamic Profit Sharing', '["Shariah-compliant", "Profit sharing", "Islamic banking", "No interest", "Ethical banking"]', '["Minimum balance: RM100", "Valid Malaysian ID", "Shariah compliance preference"]', 'High', '2.5-3.5%', 'Low', 100, TRUE),
('ambank_eflex_savings', 'eFlex Savings Account‑i', 'Flexible savings account with Islamic banking and digital features', 'personal_banking', 'savings', 'Flexible Savings', '["Flexible banking", "Islamic option", "Digital features", "Online banking"]', '["Minimum balance: RM100", "Valid Malaysian ID", "Age 18+"]', 'High', '2.8-3.2%', 'Low', 100, FALSE),
('ambank_eflex_savings_i', 'eFlex Savings Account‑i', 'Flexible Islamic savings account with digital features', 'personal_banking', 'savings', 'Islamic Flexible Savings', '["Flexible banking", "Shariah-compliant", "Digital features", "Online banking"]', '["Minimum balance: RM100", "Valid Malaysian ID", "Age 18+", "Islamic preference"]', 'High', '2.8-3.2%', 'Low', 100, TRUE),
('ambank_amgenius', 'AmGenius', 'Smart savings account with innovative features and rewards', 'personal_banking', 'savings', 'Smart Savings', '["Smart features", "Rewards program", "Digital banking", "Innovative tools"]', '["Minimum balance: RM500", "Valid Malaysian ID", "Age 18+"]', 'Medium', '3.2-4.0%', 'Low', 500, FALSE),
('ambank_savers_gang', 'Savers\' G.A.N.G. (for children)', 'Children\'s savings account with educational features and parental controls', 'personal_banking', 'savings', 'Children Savings', '["Children\'s banking", "Educational features", "Parental controls", "Savings goals"]', '["Parent/guardian account", "Child\'s birth certificate", "Age 0-18"]', 'High', '2.5-3.0%', 'Low', 50, FALSE),

-- Current Accounts
('ambank_current_account', 'Current Account / Account‑i', 'Transaction account for daily banking needs with Islamic option', 'personal_banking', 'current', 'Current Account', '["Daily transactions", "Islamic option", "Checkbook facility", "Online banking"]', '["Minimum balance: RM100", "Valid Malaysian ID", "Age 18+"]', 'High', '0.5-1.0%', 'Low', 100, FALSE),
('ambank_current_account_i', 'Current Account‑i', 'Islamic transaction account for daily banking needs', 'personal_banking', 'current', 'Islamic Current Account', '["Daily transactions", "Shariah-compliant", "Checkbook facility", "Online banking"]', '["Minimum balance: RM100", "Valid Malaysian ID", "Age 18+", "Islamic preference"]', 'High', '0.5-1.0%', 'Low', 100, TRUE),
('ambank_hybrid_current', 'Hybrid Current Account‑i', 'Combined current and savings features with Islamic banking', 'personal_banking', 'current', 'Hybrid Account', '["Hybrid features", "Islamic banking", "Savings benefits", "Transaction flexibility"]', '["Minimum balance: RM500", "Valid Malaysian ID", "Age 18+"]', 'High', '1.5-2.5%', 'Low', 500, TRUE),

-- Foreign Currency Accounts
('ambank_foreign_currency', 'Foreign Currency Accounts / Account‑i', 'Multi-currency accounts for international transactions and Islamic banking', 'personal_banking', 'current', 'Multi-Currency', '["Multiple currencies", "Islamic option", "International transfers", "Competitive rates"]', '["Minimum balance: RM1,000 equivalent", "Valid Malaysian ID", "International needs"]', 'Medium', '1.0-3.5%', 'Medium', 1000, FALSE),
('ambank_foreign_currency_i', 'Foreign Currency Accounts‑i', 'Islamic multi-currency accounts for international transactions', 'personal_banking', 'current', 'Islamic Multi-Currency', '["Multiple currencies", "Shariah-compliant", "International transfers", "Competitive rates"]', '["Minimum balance: RM1,000 equivalent", "Valid Malaysian ID", "International needs", "Islamic preference"]', 'Medium', '1.0-3.5%', 'Medium', 1000, TRUE),

-- Term Deposits
('ambank_term_deposit', 'Term Deposit / Term Deposit‑i', 'Fixed-term deposits with guaranteed returns and Islamic option', 'personal_banking', 'investment', 'Term Deposit', '["Guaranteed returns", "Islamic option", "Flexible tenures", "Competitive rates"]', '["Minimum deposit: RM1,000", "Valid Malaysian ID", "Age 18+"]', 'Medium', '3.5-5.0%', 'Low', 1000, FALSE),
('ambank_term_deposit_i', 'Term Deposit‑i', 'Islamic fixed-term deposits with guaranteed profit', 'personal_banking', 'investment', 'Islamic Term Deposit', '["Guaranteed profit", "Shariah-compliant", "Flexible tenures", "Competitive rates"]', '["Minimum deposit: RM1,000", "Valid Malaysian ID", "Age 18+", "Islamic preference"]', 'Medium', '3.5-5.0%', 'Low', 1000, TRUE),
('ambank_amquantum_term', 'AmQuantum Term Deposit‑i', 'Quantum-based term deposit with enhanced returns and Islamic banking', 'personal_banking', 'investment', 'Quantum Term Deposit', '["Quantum features", "Islamic banking", "Enhanced returns", "Flexible tenures"]', '["Minimum deposit: RM5,000", "Valid Malaysian ID", "Age 18+"]', 'Medium', '4.0-5.5%', 'Low', 5000, TRUE),
('ambank_afhdal_term', 'Afhdal Term Deposit‑i', 'Premium term deposit with best rates and Islamic banking', 'personal_banking', 'investment', 'Premium Term Deposit', '["Premium rates", "Islamic banking", "Best returns", "Priority service"]', '["Minimum deposit: RM10,000", "Valid Malaysian ID", "Age 18+"]', 'Medium', '4.5-6.0%', 'Low', 10000, TRUE),
('ambank_amtdplus', 'AmTDPlus‑i', 'Enhanced term deposit with additional benefits and Islamic banking', 'personal_banking', 'investment', 'Enhanced Term Deposit', '["Enhanced benefits", "Islamic banking", "Additional features", "Flexible options"]', '["Minimum deposit: RM5,000", "Valid Malaysian ID", "Age 18+"]', 'Medium', '4.2-5.8%', 'Low', 5000, TRUE);

-- Insert Credit Cards
INSERT INTO products_catalog (product_id, name, description, category, subcategory, type, features, requirements, suitability, annual_fee, credit_limit, is_active) VALUES
-- Debit Cards
('ambank_visa_debit', 'AmBank Visa Debit Card', 'Debit card for cashless transactions and ATM withdrawals', 'cards', 'debit', 'Visa Debit', '["Cashless payments", "ATM withdrawals", "Online shopping", "Contactless payments"]', '["Savings/current account", "Valid Malaysian ID", "Age 18+"]', 'High', 'RM0-50', NULL, TRUE),

-- Credit Cards
('ambank_enrich_visa', 'AmBank Enrich Visa Infinite & Platinum', 'Premium credit cards with travel rewards and exclusive benefits', 'cards', 'credit', 'Premium Travel', '["Travel rewards", "Airport lounge access", "Travel insurance", "Premium benefits"]', '["Annual income: RM60,000+", "Excellent credit score", "Age 21-65"]', 'Medium', 'RM200-800', 'RM20,000-100,000', TRUE),
('ambank_visa_series', 'Visa Infinite, Visa Signature, Cash Rebate Visa Platinum', 'Range of Visa credit cards with different reward structures', 'cards', 'credit', 'Visa Series', '["Rewards points", "Cash rebates", "Travel benefits", "Purchase protection"]', '["Annual income: RM36,000+", "Good credit score", "Age 21-65"]', 'Medium', 'RM100-500', 'RM10,000-50,000', TRUE),
('ambank_bonuslink_visa', 'BonusLink Visa Series (Gold, Platinum, Gold CARz, M-Series, True Visa)', 'BonusLink rewards credit cards with various benefits and categories', 'cards', 'credit', 'BonusLink Series', '["BonusLink points", "Category rewards", "Fuel rebates", "Shopping benefits"]', '["Annual income: RM24,000+", "Good credit score", "Age 21-65"]', 'Medium', 'RM0-300', 'RM5,000-30,000', TRUE),
('ambank_mastercard_series', 'Mastercard Platinum, Gold CARz, World Mastercard', 'Mastercard credit cards with international acceptance and benefits', 'cards', 'credit', 'Mastercard Series', '["International acceptance", "Travel benefits", "Purchase protection", "Rewards program"]', '["Annual income: RM30,000+", "Good credit score", "Age 21-65"]', 'Medium', 'RM100-400', 'RM8,000-40,000', TRUE),
('ambank_unionpay_platinum', 'UnionPay Platinum', 'UnionPay credit card with China and Asia-Pacific benefits', 'cards', 'credit', 'UnionPay', '["UnionPay network", "Asia-Pacific benefits", "Travel rewards", "Shopping discounts"]', '["Annual income: RM30,000+", "Good credit score", "Age 21-65"]', 'Medium', 'RM150-300', 'RM8,000-35,000', TRUE),
('ambank_signature_priority', 'AmBank SIGNATURE Priority Banking Visa Infinite (Metal Card)', 'Exclusive metal credit card for priority banking customers', 'cards', 'credit', 'Priority Metal', '["Metal card design", "Priority banking", "Exclusive benefits", "Concierge service"]', '["Priority banking status", "Annual income: RM120,000+", "Excellent credit score"]', 'Low', 'RM800-1200', 'RM50,000-200,000', TRUE),

-- Prepaid Cards
('ambank_nexg_prepaid', 'NexG PrePaid Card', 'Prepaid card for controlled spending and online transactions', 'cards', 'prepaid', 'Prepaid', '["Controlled spending", "Online transactions", "No credit check", "Reloadable"]', '["Valid Malaysian ID", "Age 18+", "No credit history required"]', 'High', 'RM0-50', NULL, TRUE);

-- Insert Loans & Financing Products
INSERT INTO products_catalog (product_id, name, description, category, subcategory, type, features, requirements, suitability, interest_rate, max_amount, is_islamic, is_active) VALUES
-- Personal Financing
('ambank_personal_financing', 'Personal Financing / Financing‑i', 'Personal loan with flexible terms and Islamic financing option', 'loans_financing', 'credit', 'Personal Loan', '["Flexible terms", "Islamic option", "Quick approval", "No collateral"]', '["Stable income", "Good credit history", "DSR < 70%", "Age 21-60"]', 'Medium', '7.5-12.0%', 100000, FALSE, TRUE),
('ambank_personal_financing_i', 'Personal Financing‑i', 'Islamic personal financing with flexible terms', 'loans_financing', 'credit', 'Islamic Personal Financing', '["Flexible terms", "Shariah-compliant", "Quick approval", "No collateral"]', '["Stable income", "Good credit history", "DSR < 70%", "Age 21-60", "Islamic preference"]', 'Medium', '7.5-12.0%', 100000, TRUE, TRUE),

-- ASB Financing
('ambank_term_financing_asb', 'Term Financing‑i (ASB/ASB2)', 'Islamic financing for ASB and ASB2 investments', 'loans_financing', 'credit', 'ASB Financing', '["Islamic financing", "ASB investment", "Competitive rates", "Flexible terms"]', '["ASB account", "Good credit history", "Stable income", "Age 21-60"]', 'Medium', '4.5-6.5%', 200000, TRUE, TRUE),

-- Overdraft
('ambank_amoneylines', 'AmMoneyLine / AmMoneyLine‑i', 'Overdraft facility with Islamic banking option', 'loans_financing', 'credit', 'Overdraft', '["Overdraft facility", "Islamic option", "Flexible usage", "Interest on usage only"]', '["Current account", "Good credit history", "Stable income", "Age 21-60"]', 'Medium', '8.0-15.0%', 50000, FALSE, TRUE),
('ambank_amoneylines_i', 'AmMoneyLine‑i', 'Islamic overdraft facility', 'loans_financing', 'credit', 'Islamic Overdraft', '["Overdraft facility", "Shariah-compliant", "Flexible usage", "Profit on usage only"]', '["Current account", "Good credit history", "Stable income", "Age 21-60", "Islamic preference"]', 'Medium', '8.0-15.0%', 50000, TRUE, TRUE),

-- Auto Financing
('ambank_auto_financing', 'Islamic and conventional auto financing', 'Vehicle financing with both conventional and Islamic options', 'loans_financing', 'credit', 'Auto Financing', '["Conventional & Islamic", "Competitive rates", "Flexible tenures", "Quick approval"]', '["Stable income", "Good credit history", "DSR < 70%", "Vehicle registration"]', 'Medium', '3.2-4.8%', 500000, FALSE, TRUE),
('ambank_auto_financing_i', 'Islamic auto financing', 'Islamic vehicle financing with competitive rates', 'loans_financing', 'credit', 'Islamic Auto Financing', '["Shariah-compliant", "Competitive rates", "Flexible tenures", "Quick approval"]', '["Stable income", "Good credit history", "DSR < 70%", "Vehicle registration", "Islamic preference"]', 'Medium', '3.2-4.8%', 500000, TRUE, TRUE),

-- Home Financing
('ambank_home_loan', 'Home Loan Facility', 'Conventional home financing with competitive rates', 'loans_financing', 'credit', 'Home Loan', '["Competitive rates", "Flexible repayment", "Multiple property types", "Professional advice"]', '["Stable income", "Good credit history", "DSR < 70%", "Property valuation"]', 'Medium', '3.5-4.5%', 2000000, FALSE, TRUE),
('ambank_home_loan_i', 'Islamic home financing', 'Islamic home financing with competitive rates', 'loans_financing', 'credit', 'Islamic Home Financing', '["Shariah-compliant", "Competitive rates", "Flexible repayment", "Professional advice"]', '["Stable income", "Good credit history", "DSR < 70%", "Property valuation", "Islamic preference"]', 'Medium', '3.5-4.5%', 2000000, TRUE, TRUE),

-- Other Financing
('ambank_home_link', 'Home Link', 'Home equity financing using property as collateral', 'loans_financing', 'credit', 'Home Equity', '["Home equity", "Flexible usage", "Competitive rates", "Property collateral"]', '["Property ownership", "Good credit history", "Property equity", "Age 21-60"]', 'Medium', '4.0-5.5%', 1000000, FALSE, TRUE),
('ambank_pr1ma_spef', 'PR1MA / SPEF', 'Specialized financing for PR1MA and SPEF properties', 'loans_financing', 'credit', 'PR1MA Financing', '["PR1MA financing", "SPEF properties", "Special rates", "Government support"]', '["PR1MA/SPEF eligibility", "Good credit history", "Stable income", "Age 21-60"]', 'Medium', '3.8-4.8%', 500000, FALSE, TRUE),
('ambank_property_link', 'Property Link', 'Property investment financing with flexible terms', 'loans_financing', 'credit', 'Property Investment', '["Property investment", "Flexible terms", "Competitive rates", "Investment focus"]', '["Investment property", "Good credit history", "Stable income", "Age 21-60"]', 'Medium', '4.2-5.2%', 1500000, FALSE, TRUE),
('ambank_term_financing_i', 'Term Financing‑i', 'Islamic term financing for various purposes', 'loans_financing', 'credit', 'Islamic Term Financing', '["Islamic financing", "Flexible terms", "Shariah-compliant", "Competitive rates"]', '["Stable income", "Good credit history", "Islamic preference", "Age 21-60"]', 'Medium', '4.5-6.5%', 200000, TRUE, TRUE),
('ambank_commercial_property', 'Commercial Property Financing', 'Financing for commercial properties and business premises', 'loans_financing', 'credit', 'Commercial Property', '["Commercial properties", "Business premises", "Competitive rates", "Flexible terms"]', '["Business registration", "Good credit history", "Property valuation", "Age 21-60"]', 'Medium', '4.8-6.0%', 5000000, FALSE, TRUE),
('ambank_skim_jaminan', 'Skim Jaminan Kredit Perumahan', 'Housing credit guarantee scheme for first-time buyers', 'loans_financing', 'credit', 'First-Time Buyer', '["First-time buyers", "Government guarantee", "Special rates", "Low down payment"]', '["First-time buyer", "Good credit history", "Stable income", "Age 21-60"]', 'High', '3.8-4.8%', 300000, FALSE, TRUE);

-- Insert Wealth Management & Investment Products
INSERT INTO products_catalog (product_id, name, description, category, subcategory, type, features, requirements, suitability, expected_return, risk_level, min_investment, is_active) VALUES
-- Unit Trusts
('ambank_unit_trusts', 'Unit Trusts via AmInvest', 'Professional managed unit trust funds with various risk profiles', 'wealth_management', 'investment', 'Unit Trusts', '["Professional management", "Diversified portfolios", "Regular income options", "Systematic investment"]', '["Minimum investment: RM1,000", "Risk assessment", "Regular contribution recommended"]', 'Medium', '6-15%', 'Medium-High', 1000, TRUE),

-- Direct Investments
('ambank_direct_bond_sukuk', 'Direct Bond / Sukuk', 'Direct investment in bonds and Islamic sukuk instruments', 'wealth_management', 'investment', 'Bonds/Sukuk', '["Direct investment", "Islamic sukuk", "Fixed income", "Regular coupons"]', '["Minimum investment: RM10,000", "Understanding of bonds", "Risk tolerance assessment"]', 'Medium', '4-8%', 'Medium', 10000, TRUE),
('ambank_dual_currency', 'Dual Currency Investments', 'Investment products linked to currency movements', 'wealth_management', 'investment', 'Currency-Linked', '["Currency-linked", "Higher returns", "Currency risk", "Flexible tenures"]', '["Minimum investment: RM5,000", "Currency understanding", "High risk tolerance"]', 'High', '5-12%', 'High', 5000, TRUE),
('ambank_equities', 'Equities', 'Direct equity investment in Malaysian and international markets', 'wealth_management', 'investment', 'Equities', '["Direct equity", "Market exposure", "High returns", "Dividend income"]', '["Minimum investment: RM1,000", "Market understanding", "High risk tolerance"]', 'High', '8-20%', 'High', 1000, TRUE),

-- Partnership Programs
('ambank_smart_partnership', 'Smart Partnership Programme (SPP)', 'Partnership investment program with professional management', 'wealth_management', 'investment', 'Partnership', '["Partnership program", "Professional management", "Diversified exposure", "Regular income"]', '["Minimum investment: RM5,000", "Partnership agreement", "Risk assessment"]', 'Medium', '7-12%', 'Medium', 5000, TRUE),

-- Services
('ambank_wealth_advisory', 'Wealth Advisory Services', 'Professional wealth management and financial planning services', 'wealth_management', 'service', 'Advisory', '["Professional advice", "Financial planning", "Portfolio management", "Tax optimization"]', '["Minimum assets: RM100,000", "Wealth management needs", "Professional consultation"]', 'High', NULL, NULL, NULL, TRUE),
('ambank_private_banking', 'AmPrivate Banking', 'Exclusive private banking services for high net worth individuals', 'wealth_management', 'service', 'Private Banking', '["Exclusive services", "Dedicated relationship manager", "Premium products", "Concierge services"]', '["Minimum assets: RM1,000,000", "High net worth status", "Private banking eligibility"]', 'Low', NULL, NULL, NULL, TRUE),
('ambank_priority_banking', 'Priority Banking tiers', 'Tiered priority banking services with exclusive benefits', 'wealth_management', 'service', 'Priority Banking', '["Priority services", "Exclusive benefits", "Dedicated support", "Premium products"]', '["Minimum assets: RM200,000", "Priority banking eligibility", "Relationship management"]', 'Medium', NULL, NULL, NULL, TRUE),
('ambank_will_wasiat', 'Will / Wasiat writing', 'Professional will writing and Islamic wasiat services', 'wealth_management', 'service', 'Estate Planning', '["Will writing", "Islamic wasiat", "Legal documentation", "Estate planning"]', '["Legal consultation", "Documentation requirements", "Estate planning needs"]', 'High', NULL, NULL, NULL, TRUE),
('ambank_legacy_estate', 'Legacy & estate planning', 'Comprehensive estate planning and legacy management services', 'wealth_management', 'service', 'Estate Planning', '["Estate planning", "Legacy management", "Tax optimization", "Succession planning"]', '["Estate planning needs", "Professional consultation", "Documentation requirements"]', 'High', NULL, NULL, NULL, TRUE);

-- Insert Insurance & Takaful Products
INSERT INTO products_catalog (product_id, name, description, category, subcategory, type, features, requirements, suitability, monthly_premium, coverage, is_islamic, is_active) VALUES
-- General Insurance
('ambank_general_insurance', 'General Insurance (vehicle, travel, personal accident, home, business)', 'Comprehensive general insurance coverage for various needs', 'insurance_takaful', 'insurance', 'General Insurance', '["Vehicle insurance", "Travel insurance", "Personal accident", "Home insurance", "Business insurance"]', '["Valid Malaysian ID", "Age 18-70", "Insurance needs assessment", "Premium payments"]', 'High', 'RM50-500', 'RM50,000-2,000,000', FALSE, TRUE),

-- Life Insurance
('ambank_life_insurance', 'Life Insurance (savings, protection, legacy, credit-linked)', 'Comprehensive life insurance with various coverage options', 'insurance_takaful', 'insurance', 'Life Insurance', '["Savings component", "Protection coverage", "Legacy planning", "Credit-linked protection"]', '["Age 18-65", "Medical underwriting", "Regular premium payments", "Good health"]', 'High', 'RM50-300', 'RM50,000-1,000,000', FALSE, TRUE),

-- Family Takaful
('ambank_family_takaful', 'Family Takaful (Islamic life/family coverage)', 'Shariah-compliant family protection and life coverage', 'insurance_takaful', 'insurance', 'Family Takaful', '["Shariah-compliant", "Family protection", "Islamic principles", "Profit sharing"]', '["Age 18-65", "Islamic preference", "Regular contributions", "Good health"]', 'High', 'RM50-250', 'RM50,000-500,000', TRUE, TRUE);

-- Insert Corporate & Treasury Solutions
INSERT INTO products_catalog (product_id, name, description, category, subcategory, type, features, requirements, suitability, service_fee, is_active) VALUES
-- Corporate Banking
('ambank_sme_corporate', 'SME & Corporate Banking', 'Comprehensive banking services for SMEs and corporations', 'corporate_treasury', 'service', 'Corporate Banking', '["Business accounts", "Trade finance", "Cash management", "Corporate lending"]', '["Business registration", "Corporate structure", "Banking relationship", "Financial documentation"]', 'Medium', 'Variable', TRUE),

-- Cash Management
('ambank_cash_management', 'Cash management', 'Advanced cash management solutions for businesses', 'corporate_treasury', 'service', 'Cash Management', '["Cash pooling", "Payment solutions", "Receivables management", "Liquidity management"]', '["Business registration", "Cash management needs", "Corporate structure", "Banking relationship"]', 'Medium', '0.1-0.5%', TRUE),

-- Trade Finance
('ambank_trade_finance_corp', 'Trade finance', 'Comprehensive trade finance solutions for international business', 'corporate_treasury', 'service', 'Trade Finance', '["Import/export finance", "Letters of credit", "Trade guarantees", "Documentary collections"]', '["Business registration", "Trade activities", "International business", "Trade documentation"]', 'Medium', '0.5-2.0%', TRUE),

-- Payroll Solutions
('ambank_payroll_solutions', 'Payroll solutions', 'Comprehensive payroll and HR management solutions', 'corporate_treasury', 'service', 'Payroll', '["Payroll processing", "HR management", "Tax compliance", "Employee benefits"]', '["Business registration", "Employee base", "HR needs", "Compliance requirements"]', 'Medium', 'RM2-10 per employee', TRUE),

-- Business Accounts
('ambank_business_accounts', 'Business current accounts', 'Specialized current accounts for business operations', 'corporate_treasury', 'service', 'Business Accounts', '["Business transactions", "Online banking", "Checkbook facility", "Business support"]', '["Business registration", "Valid business documentation", "Business needs assessment"]', 'High', 'RM0-200', TRUE),

-- Structured Products
('ambank_structured_products', 'Structured Products (autocallables, capital-protected notes, equity-linked investments, FX, dual currency investments)', 'Sophisticated investment products with various risk-return profiles', 'corporate_treasury', 'investment', 'Structured Products', '["Autocallables", "Capital protection", "Equity-linked", "FX products", "Dual currency"]', '["Minimum investment: RM10,000", "Sophisticated investor", "High risk tolerance", "Product understanding"]', 'High', NULL, TRUE);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_catalog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_products_catalog_updated_at
    BEFORE UPDATE ON products_catalog
    FOR EACH ROW
    EXECUTE FUNCTION update_products_catalog_updated_at(); 