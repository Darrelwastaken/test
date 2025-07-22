-- Migration script to move data from old structure to new structure
-- This script migrates existing client data to the new comprehensive structure

-- 1. Migrate manual financial inputs from old data
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
)
SELECT 
    fa.client_nric,
    fa.casa_balance,
    fa.fixed_deposits,
    fa.investment_funds,
    fa.insurance_policies,
    fa.other_assets,
    COALESCE(fa.total_liabilities * 0.7, 0),
    COALESCE(cu.total_limit, 20000),
    COALESCE(cu.used_amount, 0),
    COALESCE(cu.total_limit * 0.5, 10000),
    0,
    COALESCE(mc.inflow, 50000),
    COALESCE(mc.outflow, 35000),
    COALESCE(fa.total_assets * 0.1, 100000),
    COALESCE(fa.casa_balance, 50000),
    '[]'::jsonb
FROM financial_assets fa
LEFT JOIN credit_utilization cu ON fa.client_nric = cu.client_nric
LEFT JOIN monthly_cashflow mc ON fa.client_nric = mc.client_nric
WHERE NOT EXISTS (
    SELECT 1 FROM manual_financial_inputs mfi WHERE mfi.client_nric = fa.client_nric
);

-- 2. Migrate calculated financial data
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
)
SELECT 
    fa.client_nric,
    fa.total_assets,
    fa.total_liabilities,
    fa.net_position,
    fa.investment_funds,
    COALESCE(mc.net_flow, 15000),
    COALESCE(fa.casa_balance, 50000),
    'Dec',
    COALESCE(fa.casa_balance, 50000),
    COALESCE(cu.utilization_rate, 40),
    COALESCE(fa.total_assets / NULLIF(fa.total_liabilities, 0) * 100, 80),
    COALESCE(fa.casa_balance / NULLIF(fa.total_assets * 0.1, 0) * 100, 120),
    COALESCE(rts.average_transaction, 300),
    COALESCE(rp.profitability_score, 75),
    calculate_birthday_from_nric(fa.client_nric),
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, calculate_birthday_from_nric(fa.client_nric)))
FROM financial_assets fa
LEFT JOIN credit_utilization cu ON fa.client_nric = cu.client_nric
LEFT JOIN monthly_cashflow mc ON fa.client_nric = mc.client_nric
LEFT JOIN recent_transactions_summary rts ON fa.client_nric = rts.client_nric
LEFT JOIN relationship_profitability rp ON fa.client_nric = rp.client_nric
WHERE NOT EXISTS (
    SELECT 1 FROM calculated_financial_data cfd WHERE cfd.client_nric = fa.client_nric
);

-- 3. Migrate transaction behavioral data
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
)
SELECT 
    tb.client_nric,
    '{\"groceries\": 2000, \"utilities\": 1500, \"entertainment\": 1000, \"transport\": 800}'::jsonb,
    COALESCE(ctd.total_amount * 0.3, 50000),
    COALESCE(ctd.transactions_count * 0.4, 20),
    COALESCE(cardtd.total_spending, 10000),
    COALESCE(cardtd.transactions_count, 30),
    COALESCE(ctd.withdrawals_amount, 20000),
    COALESCE(ctd.transactions_count * 0.2, 10),
    COALESCE(fxt.base_amount, 5000),
    COALESCE(fxt.transaction_count, 3),
    '[]'::jsonb,
    COALESCE(rts.total_volume, 15000),
    COALESCE(rts.total_transactions, 50),
    COALESCE(rts.average_transaction, 300)
FROM transaction_behavior tb
LEFT JOIN casa_trend_data ctd ON tb.client_nric = ctd.client_nric AND ctd.month_year = '2024-12'
LEFT JOIN cards_trend_data cardtd ON tb.client_nric = cardtd.client_nric AND cardtd.month_year = '2024-12'
LEFT JOIN fx_transactions fxt ON tb.client_nric = fxt.client_nric
LEFT JOIN recent_transactions_summary rts ON tb.client_nric = rts.client_nric
WHERE NOT EXISTS (
    SELECT 1 FROM transaction_behavioral_data tbd WHERE tbd.client_nric = tb.client_nric
);

-- 4. Migrate financial trends monthly data
INSERT INTO financial_trends_monthly (
    client_nric,
    month_year,
    casa_balance,
    total_assets,
    total_liabilities,
    net_worth,
    credit_utilization,
    investment_value
)
SELECT 
    ctd.client_nric,
    ctd.month_year,
    ctd.total_amount,
    COALESCE(fa.total_assets, 1200000),
    COALESCE(fa.total_liabilities, 310000),
    COALESCE(fa.net_position, 890000),
    COALESCE(cardtd.credit_utilization_rate, 40),
    COALESCE(itd.portfolio_value, 300000)
FROM casa_trend_data ctd
LEFT JOIN financial_assets fa ON ctd.client_nric = fa.client_nric
LEFT JOIN cards_trend_data cardtd ON ctd.client_nric = cardtd.client_nric AND ctd.month_year = cardtd.month_year
LEFT JOIN investments_trend_data itd ON ctd.client_nric = itd.client_nric AND ctd.month_year = itd.month_year
WHERE NOT EXISTS (
    SELECT 1 FROM financial_trends_monthly ftm WHERE ftm.client_nric = ctd.client_nric AND ftm.month_year = ctd.month_year
);

-- 5. Update calculated birthdays and ages from NRIC
UPDATE calculated_financial_data 
SET 
    calculated_birthday = calculate_birthday_from_nric(client_nric),
    calculated_age = EXTRACT(YEAR FROM AGE(CURRENT_DATE, calculate_birthday_from_nric(client_nric)))
WHERE calculated_birthday IS NULL;

-- 6. Update product holdings from old product_holdings table
UPDATE manual_financial_inputs 
SET product_holdings = (
    SELECT jsonb_agg(
        jsonb_build_object(
            'name', ph.product_name,
            'type', ph.product_type,
            'value', ph.value,
            'count', ph.count
        )
    )
    FROM product_holdings ph 
    WHERE ph.client_nric = manual_financial_inputs.client_nric
)
WHERE EXISTS (
    SELECT 1 FROM product_holdings ph WHERE ph.client_nric = manual_financial_inputs.client_nric
);
