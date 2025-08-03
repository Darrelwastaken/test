import { supabase } from '../supabaseClient';

/**
 * Check what tables actually exist in the database
 * This will help us fix the client deletion logic
 */
export const checkExistingTables = async () => {
  try {
    // Query to get all table names from the public schema
    const { data, error } = await supabase
      .rpc('get_table_names');
    
    if (error) {
      console.error('Error getting table names:', error);
      return { error: error.message };
    }
    
    console.log('Existing tables in database:', data);
    return { tables: data };
    
  } catch (err) {
    console.error('Exception getting table names:', err);
    return { error: err.message };
  }
};

/**
 * Alternative method to check tables by trying to query them
 */
export const checkTablesByQuery = async () => {
  const tablesToCheck = [
    'clients',
    'manual_financial_inputs',
    'calculated_financial_data',
    'transaction_behavioral_data',
    'financial_trends_monthly',
    'products_catalog',
    'users',
    'ai_insights'
  ];
  
  const existingTables = [];
  const nonExistingTables = [];
  
  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`Table ${table} does not exist:`, error.message);
        nonExistingTables.push(table);
      } else {
        console.log(`Table ${table} exists`);
        existingTables.push(table);
      }
    } catch (err) {
      console.log(`Table ${table} does not exist:`, err.message);
      nonExistingTables.push(table);
    }
  }
  
  return { existingTables, nonExistingTables };
};

// Run the check if this file is executed directly
if (typeof window !== 'undefined') {
  window.checkDatabaseTables = checkExistingTables;
  window.checkTablesByQuery = checkTablesByQuery;
  console.log('Database table check utilities available. Run checkDatabaseTables() or checkTablesByQuery() in console.');
} 