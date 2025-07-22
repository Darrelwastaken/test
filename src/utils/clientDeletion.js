import { supabase } from '../supabaseClient';

/**
 * Comprehensive client deletion utility
 * Deletes all data related to a client from all database tables
 * @param {string} clientNric - The NRIC of the client to delete
 * @returns {Promise<{success: boolean, error?: string, deletedTables: string[]}>}
 */
export const deleteClientCompletely = async (clientNric) => {
  const deletedTables = [];
  const errors = [];

  // All tables that contain client data
  const tablesToDelete = [
    // Original tables
    'liabilities_credit',
    'investments_portfolio',
    'transaction_behavior',
    'financial_summary',
    'dashboard_metrics',
    
    // New financial summary tables
    'financial_assets',
    'monthly_cashflow',
    'product_holdings',
    'relationship_profitability',
    'credit_utilization',
    'risk_indicators',
    'financial_trends',
    'asset_utilization',
    'emergency_fund_analysis',
    
    // Transaction behavior enhancement tables
    'recent_transactions_summary',
    'categorised_spending',
    'large_unusual_transactions',
    'fund_transfers',
    'atm_pos_activity',
    'fx_transactions'
  ];

  try {
    console.log(`Starting comprehensive deletion for client: ${clientNric}`);
    
    // Delete from all related tables first
    for (const table of tablesToDelete) {
      try {
        console.log(`Deleting from ${table}...`);
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('client_nric', clientNric);
          
        if (error) {
          console.error(`Error deleting from ${table}:`, error);
          errors.push(`${table}: ${error.message}`);
        } else {
          console.log(`✓ Deleted from ${table}`);
          deletedTables.push(table);
        }
      } catch (err) {
        console.error(`Exception deleting from ${table}:`, err);
        errors.push(`${table}: ${err.message}`);
      }
    }
    
    // Finally delete the client
    console.log('Deleting client...');
    const { error: clientError } = await supabase
      .from('clients')
      .delete()
      .eq('nric', clientNric);

    if (clientError) {
      console.error('Error deleting client:', clientError);
      errors.push(`clients: ${clientError.message}`);
    } else {
      console.log('✓ Client deleted successfully');
      deletedTables.push('clients');
    }

    // Return result
    if (errors.length > 0) {
      return {
        success: false,
        error: `Partial deletion completed. Errors: ${errors.join('; ')}`,
        deletedTables,
        errors
      };
    } else {
      return {
        success: true,
        deletedTables,
        message: `Client and all related data (${deletedTables.length} tables) deleted successfully`
      };
    }

  } catch (err) {
    console.error('Fatal error during client deletion:', err);
    return {
      success: false,
      error: `Fatal error: ${err.message}`,
      deletedTables,
      errors: [err.message]
    };
  }
};

/**
 * Get a list of all tables that contain client data
 * @returns {string[]} Array of table names
 */
export const getClientDataTables = () => {
  return [
    'liabilities_credit',
    'investments_portfolio',
    'transaction_behavior',
    'financial_summary',
    'dashboard_metrics',
    'financial_assets',
    'monthly_cashflow',
    'product_holdings',
    'relationship_profitability',
    'credit_utilization',
    'risk_indicators',
    'financial_trends',
    'asset_utilization',
    'emergency_fund_analysis',
    'recent_transactions_summary',
    'categorised_spending',
    'large_unusual_transactions',
    'fund_transfers',
    'atm_pos_activity',
    'fx_transactions',
    'clients'
  ];
};

/**
 * Check if a client exists and has data in any tables
 * @param {string} clientNric - The NRIC of the client to check
 * @returns {Promise<{exists: boolean, hasData: boolean, tablesWithData: string[]}>}
 */
export const checkClientData = async (clientNric) => {
  const tablesWithData = [];
  
  try {
    // Check if client exists
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('nric')
      .eq('nric', clientNric)
      .single();

    if (clientError || !client) {
      return {
        exists: false,
        hasData: false,
        tablesWithData: []
      };
    }

    // Check all tables for client data
    const tablesToCheck = getClientDataTables().filter(table => table !== 'clients');
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('id')
          .eq('client_nric', clientNric)
          .limit(1);
          
        if (!error && data && data.length > 0) {
          tablesWithData.push(table);
        }
      } catch (err) {
        console.error(`Error checking ${table}:`, err);
      }
    }

    return {
      exists: true,
      hasData: tablesWithData.length > 0,
      tablesWithData
    };

  } catch (err) {
    console.error('Error checking client data:', err);
    return {
      exists: false,
      hasData: false,
      tablesWithData: [],
      error: err.message
    };
  }
}; 