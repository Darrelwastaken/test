-- Clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    status TEXT NOT NULL,
    risk_profile TEXT NOT NULL
);

-- Dashboard metrics table
CREATE TABLE dashboard_metrics (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    assets NUMERIC,
    cashflow NUMERIC,
    monthly_cashflow NUMERIC[],
    account_balances JSONB, -- {casa, fd, loans, cards}
    transactions_heatmap NUMERIC[],
    months TEXT[]
);

-- Financial summary table
CREATE TABLE financial_summary (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    net_worth NUMERIC,
    monthly_cashflow JSONB, -- {months: [], inflow: []}
    asset_utilization NUMERIC,
    assets_breakdown JSONB, -- {labels: [], data: []}
    liabilities_breakdown JSONB -- {labels: [], data: []}
);

-- Transaction behavior table
CREATE TABLE transaction_behavior (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    casa_deposits NUMERIC[],
    casa_withdrawals NUMERIC[],
    card_spending NUMERIC[],
    card_payments NUMERIC[]
);

-- Investments portfolio table
CREATE TABLE investments_portfolio (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    holdings JSONB -- [{asset, type, balance}]
);

-- Liabilities and credit table
CREATE TABLE liabilities_credit (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
    liabilities JSONB, -- [{name, type, balance}]
    credit_lines JSONB -- [{name, type, limit}]
);

