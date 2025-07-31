// Test file for product recommendations
import { 
  calculateRiskProfile, 
  calculateInvestmentProfile, 
  generatePersonalizedRecommendations,
  calculateEstimatedValue 
} from './productRecommendationUtils';

// Sample AmBank product catalog for testing
const TEST_PRODUCT_CATALOG = {
  personal_banking: [
    {
      id: 'ambank_amvault_savings',
      type: 'Savings',
      name: 'AmVault Savings Account / Account‑i',
      description: 'High-yield savings account with competitive interest rates and Islamic banking options',
      suitability: 'High',
      expectedReturn: '3.0-4.2%',
      risk: 'Low',
      minDeposit: 100,
      features: ['High interest rates', 'Islamic banking option', 'Online banking', 'Mobile app access', 'No monthly fees'],
      requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+']
    }
  ],
  cards: [
    {
      id: 'ambank_visa_debit',
      type: 'Debit',
      name: 'AmBank Visa Debit Card',
      description: 'Debit card for cashless transactions and ATM withdrawals',
      suitability: 'High',
      annualFee: 'RM0-50',
      features: ['Cashless payments', 'ATM withdrawals', 'Online shopping', 'Contactless payments'],
      requirements: ['Savings/current account', 'Valid Malaysian ID', 'Age 18+']
    }
  ],
  loans_financing: [
    {
      id: 'ambank_personal_financing',
      type: 'Credit',
      name: 'Personal Financing / Financing‑i',
      description: 'Personal loan with flexible terms and Islamic financing option',
      suitability: 'Medium',
      interestRate: '7.5-12.0%',
      maxAmount: 'RM100,000',
      features: ['Flexible terms', 'Islamic option', 'Quick approval', 'No collateral'],
      requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Age 21-60']
    }
  ],
  wealth_management: [
    {
      id: 'ambank_unit_trusts',
      type: 'Investment',
      name: 'Unit Trusts via AmInvest',
      description: 'Professional managed unit trust funds with various risk profiles',
      suitability: 'Medium',
      expectedReturn: '6-15%',
      risk: 'Medium-High',
      minInvestment: 1000,
      features: ['Professional management', 'Diversified portfolios', 'Regular income options', 'Systematic investment'],
      requirements: ['Minimum investment: RM1,000', 'Risk assessment', 'Regular contribution recommended']
    }
  ],
  insurance_takaful: [
    {
      id: 'ambank_general_insurance',
      type: 'Insurance',
      name: 'General Insurance (vehicle, travel, personal accident, home, business)',
      description: 'Comprehensive general insurance coverage for various needs',
      suitability: 'High',
      monthlyPremium: 'RM50-500',
      coverage: 'RM50,000-2,000,000',
      features: ['Vehicle insurance', 'Travel insurance', 'Personal accident', 'Home insurance', 'Business insurance'],
      requirements: ['Valid Malaysian ID', 'Age 18-70', 'Insurance needs assessment', 'Premium payments']
    }
  ]
};

// Test client data scenarios
const TEST_CLIENTS = {
  youngProfessional: {
    age: 28,
    monthlyIncome: 8000,
    monthlyExpenses: 4000,
    totalAssets: 50000,
    totalLiabilities: 15000,
    creditUtilization: 25,
    emergencyFundRatio: 80,
    casaBalance: 20000,
    investmentValue: 10000,
    insuranceValue: 100000,
    current_emergency_fund: 12000,
    three_month_expenses: 15000,
    netCashFlow: 4000
  },
  midCareer: {
    age: 45,
    monthlyIncome: 12000,
    monthlyExpenses: 7000,
    totalAssets: 200000,
    totalLiabilities: 80000,
    creditUtilization: 60,
    emergencyFundRatio: 120,
    casaBalance: 50000,
    investmentValue: 80000,
    insuranceValue: 300000,
    current_emergency_fund: 25000,
    three_month_expenses: 21000,
    netCashFlow: 5000
  },
  conservative: {
    age: 55,
    monthlyIncome: 15000,
    monthlyExpenses: 8000,
    totalAssets: 500000,
    totalLiabilities: 50000,
    creditUtilization: 15,
    emergencyFundRatio: 150,
    casaBalance: 100000,
    investmentValue: 200000,
    insuranceValue: 500000,
    current_emergency_fund: 35000,
    three_month_expenses: 24000,
    netCashFlow: 7000
  }
};

// Test function
export const testProductRecommendations = () => {
  console.log('=== Testing Product Recommendation System ===\n');

  Object.entries(TEST_CLIENTS).forEach(([clientType, clientData]) => {
    console.log(`\n--- Testing ${clientType} ---`);
    
    // Test risk profile calculation
    const riskProfile = calculateRiskProfile(clientData);
    console.log('Risk Profile:', {
      level: riskProfile.riskLevel,
      score: riskProfile.riskScore,
      factors: riskProfile.riskFactors
    });

    // Test investment profile calculation
    const investmentProfile = calculateInvestmentProfile(clientData);
    console.log('Investment Profile:', {
      type: investmentProfile.type,
      allocation: investmentProfile.allocation,
      recommendations: investmentProfile.recommendations
    });

    // Test personalized recommendations
    const recommendations = generatePersonalizedRecommendations(clientData, TEST_PRODUCT_CATALOG);
    console.log('Recommendations:', recommendations.map(rec => ({
      name: rec.name,
      type: rec.type,
      suitability: rec.suitability,
      priority: rec.priority,
      reasoning: rec.reasoning?.substring(0, 100) + '...'
    })));

    // Test estimated value calculation
    recommendations.forEach(rec => {
      const estimatedValue = calculateEstimatedValue(rec, clientData);
      console.log(`Estimated value for ${rec.name}: RM${estimatedValue.toLocaleString()}`);
    });
  });

  console.log('\n=== Test Complete ===');
};

// Export test data for use in other components
export { TEST_CLIENTS, TEST_PRODUCT_CATALOG }; 