import { supabase } from '../supabaseClient';
import { deleteClientCompletely, checkClientData } from './clientDeletion.js';

/**
 * Test client deletion functionality
 * This script helps verify that client deletion works properly
 */
export const testClientDeletion = async (testNric = 'test-123-4567') => {
  console.log('🧪 Testing Client Deletion System...');
  
  try {
    // Step 1: Check if test client exists
    console.log('\n1️⃣ Checking if test client exists...');
    const clientCheck = await checkClientData(testNric);
    console.log('Client check result:', clientCheck);
    
    if (!clientCheck.exists) {
      console.log('⚠️ Test client does not exist. Creating test data...');
      
      // Create test client
      const { error: createError } = await supabase
        .from('clients')
        .insert({
          nric: testNric,
          name: 'Test Client for Deletion',
          email: 'test@example.com',
          status: 'Active'
        });
      
      if (createError) {
        console.error('❌ Error creating test client:', createError);
        return { success: false, error: createError.message };
      }
      
      console.log('✅ Test client created');
    }
    
    // Step 2: Check what data exists for the client
    console.log('\n2️⃣ Checking existing client data...');
    const dataCheck = await checkClientData(testNric);
    console.log('Data check result:', dataCheck);
    
    // Step 3: Attempt deletion
    console.log('\n3️⃣ Attempting client deletion...');
    const deletionResult = await deleteClientCompletely(testNric);
    console.log('Deletion result:', deletionResult);
    
    // Step 4: Verify deletion
    console.log('\n4️⃣ Verifying deletion...');
    const finalCheck = await checkClientData(testNric);
    console.log('Final check result:', finalCheck);
    
    if (finalCheck.exists) {
      console.log('❌ Client still exists after deletion!');
      return { success: false, error: 'Client was not deleted' };
    } else {
      console.log('✅ Client successfully deleted!');
      return { success: true, message: 'Client deletion test passed' };
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Test deletion with a real client NRIC
 */
export const testRealClientDeletion = async (realNric) => {
  if (!realNric) {
    console.error('❌ Please provide a real client NRIC to test');
    return { success: false, error: 'No NRIC provided' };
  }
  
  console.log(`🧪 Testing deletion for real client: ${realNric}`);
  
  try {
    // Check if client exists
    const clientCheck = await checkClientData(realNric);
    console.log('Client check result:', clientCheck);
    
    if (!clientCheck.exists) {
      console.log('❌ Client does not exist');
      return { success: false, error: 'Client not found' };
    }
    
    // Show what will be deleted
    console.log(`📋 Client has data in ${clientCheck.tablesWithData.length} tables:`, clientCheck.tablesWithData);
    
    // Confirm deletion (in a real app, you'd show a confirmation dialog)
    console.log('⚠️ This will permanently delete the client and all related data!');
    
    // Perform deletion
    const deletionResult = await deleteClientCompletely(realNric);
    console.log('Deletion result:', deletionResult);
    
    return deletionResult;
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return { success: false, error: error.message };
  }
};

// Make functions available in browser console
if (typeof window !== 'undefined') {
  window.testClientDeletion = testClientDeletion;
  window.testRealClientDeletion = testRealClientDeletion;
  console.log('💡 Client deletion test utilities available:');
  console.log('  - testClientDeletion() - Test with dummy client');
  console.log('  - testRealClientDeletion("NRIC") - Test with real client');
} 