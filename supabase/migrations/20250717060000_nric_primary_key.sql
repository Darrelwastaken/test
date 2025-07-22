-- 1. Add NRIC column to clients table (if not exists)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS nric TEXT;

-- 2. Make NRIC unique and not null
ALTER TABLE clients ALTER COLUMN nric SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS clients_nric_key ON clients(nric);

-- 3. Drop foreign key constraints in related tables
ALTER TABLE dashboard_metrics DROP CONSTRAINT IF EXISTS dashboard_metrics_client_id_fkey;
ALTER TABLE financial_summary DROP CONSTRAINT IF EXISTS financial_summary_client_id_fkey;
ALTER TABLE transaction_behavior DROP CONSTRAINT IF EXISTS transaction_behavior_client_id_fkey;
ALTER TABLE investments_portfolio DROP CONSTRAINT IF EXISTS investments_portfolio_client_id_fkey;
ALTER TABLE liabilities_credit DROP CONSTRAINT IF EXISTS liabilities_credit_client_id_fkey;

-- 4. Drop the old primary key constraint
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_pkey;

-- 5. Add new primary key on NRIC
ALTER TABLE clients ADD PRIMARY KEY (nric);

-- 6. Update all related tables to use nric as foreign key

-- Dashboard metrics
ALTER TABLE dashboard_metrics ADD COLUMN IF NOT EXISTS client_nric TEXT;
UPDATE dashboard_metrics SET client_nric = clients.nric
  FROM clients WHERE dashboard_metrics.client_id = clients.id;
ALTER TABLE dashboard_metrics DROP COLUMN IF EXISTS client_id;
ALTER TABLE dashboard_metrics ALTER COLUMN client_nric SET NOT NULL;
ALTER TABLE dashboard_metrics ADD CONSTRAINT dashboard_metrics_client_nric_fkey FOREIGN KEY (client_nric) REFERENCES clients(nric) ON DELETE CASCADE;

-- Financial summary
ALTER TABLE financial_summary ADD COLUMN IF NOT EXISTS client_nric TEXT;
UPDATE financial_summary SET client_nric = clients.nric
  FROM clients WHERE financial_summary.client_id = clients.id;
ALTER TABLE financial_summary DROP COLUMN IF EXISTS client_id;
ALTER TABLE financial_summary ALTER COLUMN client_nric SET NOT NULL;
ALTER TABLE financial_summary ADD CONSTRAINT financial_summary_client_nric_fkey FOREIGN KEY (client_nric) REFERENCES clients(nric) ON DELETE CASCADE;

-- Transaction behavior
ALTER TABLE transaction_behavior ADD COLUMN IF NOT EXISTS client_nric TEXT;
UPDATE transaction_behavior SET client_nric = clients.nric
  FROM clients WHERE transaction_behavior.client_id = clients.id;
ALTER TABLE transaction_behavior DROP COLUMN IF EXISTS client_id;
ALTER TABLE transaction_behavior ALTER COLUMN client_nric SET NOT NULL;
ALTER TABLE transaction_behavior ADD CONSTRAINT transaction_behavior_client_nric_fkey FOREIGN KEY (client_nric) REFERENCES clients(nric) ON DELETE CASCADE;

-- Investments portfolio
ALTER TABLE investments_portfolio ADD COLUMN IF NOT EXISTS client_nric TEXT;
UPDATE investments_portfolio SET client_nric = clients.nric
  FROM clients WHERE investments_portfolio.client_id = clients.id;
ALTER TABLE investments_portfolio DROP COLUMN IF EXISTS client_id;
ALTER TABLE investments_portfolio ALTER COLUMN client_nric SET NOT NULL;
ALTER TABLE investments_portfolio ADD CONSTRAINT investments_portfolio_client_nric_fkey FOREIGN KEY (client_nric) REFERENCES clients(nric) ON DELETE CASCADE;

-- Liabilities and credit
ALTER TABLE liabilities_credit ADD COLUMN IF NOT EXISTS client_nric TEXT;
UPDATE liabilities_credit SET client_nric = clients.nric
  FROM clients WHERE liabilities_credit.client_id = clients.id;
ALTER TABLE liabilities_credit DROP COLUMN IF EXISTS client_id;
ALTER TABLE liabilities_credit ALTER COLUMN client_nric SET NOT NULL;
ALTER TABLE liabilities_credit ADD CONSTRAINT liabilities_credit_client_nric_fkey FOREIGN KEY (client_nric) REFERENCES clients(nric) ON DELETE CASCADE;

-- 7. (Optional) Remove the old id column if you no longer need it
-- ALTER TABLE clients DROP COLUMN IF EXISTS id; 