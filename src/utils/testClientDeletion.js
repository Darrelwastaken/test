import { supabase } from '../supabaseClient';
import { deleteClientCompletely, checkClientData } from './clientDeletion';

/**
 * Test script to verify client deletion functionality
 * This can be run in the browser console for testing
 */
export const testClientDeletion = async (testClientNric = '880101015432') => {
  console.log('🧪 Starting client deletion test...');
  console.log('Test client NRIC:', testClientNric);
  
  try {
    // Step 1: Check if client exists and has data
    console.log('\n📋 Step 1: Checking client data before deletion...');
    const beforeCheck = await checkClientData(testClientNric);
    console.log('Before deletion:', beforeCheck);
    
    if (!beforeCheck.exists) {
      console.log('❌ Test client does not exist. Please create a test client first.');
      return;
    }
    
    // Step 2: Perform deletion
    console.log('\n🗑️ Step 2: Performing client deletion...');
    const deletionResult = await deleteClientCompletely(testClientNric);
    console.log('Deletion result:', deletionResult);
    
    // Step 3: Verify deletion
    console.log('\n✅ Step 3: Verifying deletion...');
    const afterCheck = await checkClientData(testClientNric);
    console.log('After deletion:', afterCheck);
    
    // Step 4: Summary
    console.log('\n📊 Test Summary:');
    if (deletionResult.success && !afterCheck.exists) {
      console.log('✅ SUCCESS: Client and all data deleted successfully!');
      console.log(`📈 Tables deleted: ${deletionResult.deletedTables.length}`);
      console.log(`📋 Tables with data before: ${beforeCheck.tablesWithData.length}`);
    } else {
      console.log('❌ FAILED: Deletion was not successful');
      console.log('Deletion errors:', deletionResult.errors);
      console.log('Client still exists:', afterCheck.exists);
    }
    
    return {
      success: deletionResult.success && !afterCheck.exists,
      beforeCheck,
      deletionResult,
      afterCheck
    };
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a test client for deletion testing
 */
export const createTestClient = async (testClientNric = 'TEST-123456') => {
  console.log('🔧 Creating test client...');
  
  try {
    // Create test client
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .insert([{
        nric: testClientNric,
        name: 'Test Client',
        email: 'test@example.com',
        status: 'Active',
        risk_profile: 'Moderate',
        nationality: 'Malaysian',
        gender: 'Male',
        marital_status: 'Single',
        employment_status: 'Employed'
      }])
      .select()
      .single();
      
    if (clientError) {
      console.error('Error creating test client:', clientError);
      return null;
    }
    
    console.log('✅ Test client created:', client);
    
    // Create some test data in various tables
    const testData = [
      {
        table: 'financial_assets',
        data: {
          client_nric: testClientNric,
          total_assets: 1000000,
          total_liabilities: 300000,
          net_position: 700000,
          casa_balance: 100000
        }
      },
      {
        table: 'monthly_cashflow',
        data: {
          client_nric: testClientNric,
          month_year: '2024-01',
          inflow: 50000,
          outflow: 30000,
          net_flow: 20000
        }
      },
      {
        table: 'product_holdings',
        data: {
          client_nric: testClientNric,
          product_name: 'Test Savings',
          product_type: 'savings',
          count: 1,
          value: 100000
        }
      },
      {
        table: 'relationship_profitability',
        data: {
          client_nric: testClientNric,
          relationship_tier: 'Standard',
          profitability_score: 75,
          customer_lifetime_value: 150000
        }
      }
    ];
    
    for (const item of testData) {
      try {
        const { error } = await supabase
          .from(item.table)
          .insert([item.data]);
          
        if (error) {
          console.error(`Error creating test data in ${item.table}:`, error);
        } else {
          console.log(`✅ Test data created in ${item.table}`);
        }
      } catch (err) {
        console.error(`Exception creating test data in ${item.table}:`, err);
      }
    }
    
    return client;
    
  } catch (error) {
    console.error('Error creating test client:', error);
    return null;
  }
};

/**
 * Run a complete test cycle
 */
export const runCompleteTest = async () => {
  const testNric = 'TEST-' + Date.now();
  
  console.log('🚀 Starting complete test cycle...');
  console.log('Test NRIC:', testNric);
  
  // Step 1: Create test client
  const testClient = await createTestClient(testNric);
  if (!testClient) {
    console.log('❌ Failed to create test client');
    return;
  }
  
  // Step 2: Wait a moment for data to be created
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 3: Test deletion
  const testResult = await testClientDeletion(testNric);
  
  console.log('\n🎯 Complete test result:', testResult);
  return testResult;
};

// Export for browser console testing
if (typeof window !== 'undefined') {
  window.testClientDeletion = testClientDeletion;
  window.createTestClient = createTestClient;
  window.runCompleteTest = runCompleteTest;
  console.log('🧪 Client deletion test functions available in console:');
  console.log('- testClientDeletion(nric)');
  console.log('- createTestClient(nric)');
  console.log('- runCompleteTest()');
} 