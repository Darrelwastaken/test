import { supabase } from '../supabaseClient';

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('clients')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Database connection failed:', testError);
      return false;
    }
    
    console.log('Database connection successful');
    
    // Test table structure
    const tables = [
      'clients',
      'manual_financial_inputs',
      'calculated_financial_data',
      'transaction_behavioral_data',
      'financial_trends_monthly'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.warn(`Table ${table} not accessible:`, error.message);
        } else {
          console.log(`Table ${table} accessible`);
        }
      } catch (err) {
        console.warn(`Table ${table} error:`, err.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Database test failed:', error);
    return false;
  }
}; 