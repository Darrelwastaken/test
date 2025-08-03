// Test script for authentication system
// Run this in the browser console to test the auth functionality

console.log('🧪 Testing Authentication System...');

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'TestPass123'
};

// Test 1: Check if authService is available
console.log('\n📋 Test 1: Checking authService availability');
if (typeof authService !== 'undefined') {
  console.log('✅ authService is available');
  console.log('Available methods:', Object.keys(authService));
} else {
  console.log('❌ authService is not available');
}

// Test 2: Test user registration
async function testRegistration() {
  console.log('\n📋 Test 2: Testing user registration');
  try {
    const result = await authService.register(testUser.email, testUser.password);
    if (result.success) {
      console.log('✅ Registration successful:', result.user);
      return true;
    } else {
      console.log('❌ Registration failed:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Registration error:', error);
    return false;
  }
}

// Test 3: Test user login
async function testLogin() {
  console.log('\n📋 Test 3: Testing user login');
  try {
    const result = await authService.login(testUser.email, testUser.password);
    if (result.success) {
      console.log('✅ Login successful:', result.user);
      return result.user;
    } else {
      console.log('❌ Login failed:', result.error);
      return null;
    }
  } catch (error) {
    console.log('❌ Login error:', error);
    return null;
  }
}

// Test 4: Test password change
async function testPasswordChange(user) {
  console.log('\n📋 Test 4: Testing password change');
  if (!user) {
    console.log('❌ No user available for password change test');
    return false;
  }
  
  const newPassword = 'NewTestPass123';
  try {
    const result = await authService.changePassword(user.id, testUser.password, newPassword);
    if (result.success) {
      console.log('✅ Password change successful');
      
      // Test login with new password
      const loginResult = await authService.login(testUser.email, newPassword);
      if (loginResult.success) {
        console.log('✅ Login with new password successful');
        return true;
      } else {
        console.log('❌ Login with new password failed');
        return false;
      }
    } else {
      console.log('❌ Password change failed:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Password change error:', error);
    return false;
  }
}

// Test 5: Test database connection
async function testDatabaseConnection() {
  console.log('\n📋 Test 5: Testing database connection');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:', error);
      return false;
    } else {
      console.log('✅ Database connection successful');
      return true;
    }
  } catch (error) {
    console.log('❌ Database connection error:', error);
    return false;
  }
}

// Test 6: Check users table structure
async function testTableStructure() {
  console.log('\n📋 Test 6: Checking users table structure');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Table structure check failed:', error);
      return false;
    } else {
      console.log('✅ Users table exists and is accessible');
      if (data.length > 0) {
        console.log('Sample user structure:', Object.keys(data[0]));
      }
      return true;
    }
  } catch (error) {
    console.log('❌ Table structure check error:', error);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Authentication System Tests...\n');
  
  const results = {
    authServiceAvailable: typeof authService !== 'undefined',
    databaseConnection: await testDatabaseConnection(),
    tableStructure: await testTableStructure(),
    registration: await testRegistration(),
    login: null,
    passwordChange: false
  };
  
  if (results.registration) {
    results.login = await testLogin();
    if (results.login) {
      results.passwordChange = await testPasswordChange(results.login);
    }
  }
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`AuthService Available: ${results.authServiceAvailable ? '✅' : '❌'}`);
  console.log(`Database Connection: ${results.databaseConnection ? '✅' : '❌'}`);
  console.log(`Table Structure: ${results.tableStructure ? '✅' : '❌'}`);
  console.log(`User Registration: ${results.registration ? '✅' : '❌'}`);
  console.log(`User Login: ${results.login ? '✅' : '❌'}`);
  console.log(`Password Change: ${results.passwordChange ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(result => result === true || result !== null);
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return results;
}

// Export for manual testing
window.testAuthSystem = runAllTests;
console.log('💡 Run testAuthSystem() in the console to test the authentication system'); 