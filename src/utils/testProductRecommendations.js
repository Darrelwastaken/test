// Test file for product recommendations
import { 
  calculateRiskProfile, 
  calculateInvestmentProfile, 
  generatePersonalizedRecommendations,
  calculateEstimatedValue 
} from './productRecommendationUtils';

// Sample AmBank product catalog for testing
const TEST_PRODUCT_CATALOG = {
  savings: [
    {
      id: 'ambank_savings_account',
      type: 'Savings',
      name: 'AmBank Savings Account',
      description: 'Basic savings account with competitive interest rates and easy access to funds',
      suitability: 'High',
      expectedReturn: '2.5%',
      risk: 'Low',
      minDeposit: 100,
      features: ['No monthly fees', 'Free ATM withdrawals', 'Online banking', 'Mobile app access'],
      requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+']
    }
  ],
  investment: [
    {
      id: 'ambank_unit_trust',
      type: 'Investment',
      name: 'AmBank Unit Trust Funds',
      description: 'Professional managed unit trust funds with various risk profiles and investment objectives',
      suitability: 'Medium',
      expectedReturn: '6-15%',
      risk: 'Medium-High',
      minInvestment: 1000,
      features: ['Professional fund management', 'Diversified portfolios', 'Regular income options', 'Systematic investment plans'],
      requirements: ['Minimum investment: RM1,000', 'Risk assessment required', 'Regular contribution recommended']
    }
  ],
  insurance: [
    {
      id: 'ambank_life_insurance',
      type: 'Insurance',
      name: 'AmBank Life Insurance',
      description: 'Comprehensive life insurance coverage with flexible premium options and riders',
      suitability: 'High',
      monthlyPremium: 'RM50-200',
      coverage: 'RM50,000-1,000,000',
      features: ['Flexible premium payments', 'Multiple coverage options', 'Riders available', 'Cash value accumulation'],
      requirements: ['Age 18-65', 'Medical underwriting', 'Regular premium payments', 'Good health']
    }
  ],
  islamic: [
    {
      id: 'ambank_islamic_savings',
      type: 'Islamic',
      name: 'AmBank Islamic Savings Account',
      description: 'Shariah-compliant savings account with profit sharing and no interest',
      suitability: 'High',
      expectedReturn: '2.8%',
      risk: 'Low',
      minDeposit: 100,
      features: ['Shariah-compliant', 'Profit sharing', 'No interest', 'Ethical banking', 'Online banking'],
      requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+', 'Shariah compliance preference']
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