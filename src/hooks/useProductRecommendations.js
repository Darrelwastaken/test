import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { 
  generatePersonalizedRecommendations, 
  calculateEstimatedValue,
  calculateRiskProfile,
  calculateInvestmentProfile 
} from '../utils/productRecommendationUtils';

export const useProductRecommendations = (clientNric) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);

  useEffect(() => {
    const generateRecommendations = async () => {
      if (!clientNric) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch comprehensive client data
        const [
          clientResult,
          manualResult,
          calculatedResult,
          behavioralResult
        ] = await Promise.all([
          supabase
            .from('clients')
            .select('*')
            .eq('nric', clientNric)
            .single(),
          supabase
            .from('manual_financial_inputs')
            .select('*')
            .eq('client_nric', clientNric)
            .single(),
          supabase
            .from('calculated_financial_data')
            .select('*')
            .eq('client_nric', clientNric)
            .single(),
          supabase
            .from('transaction_behavioral_data')
            .select('*')
            .eq('client_nric', clientNric)
            .single()
        ]);

        // Handle missing data gracefully
        const client = clientResult.data || {};
        const manual = manualResult.data || {};
        const calculated = calculatedResult.data || {};
        const behavioral = behavioralResult.data || {};

        // Combine client data for analysis
        const clientData = {
          age: calculated.calculated_age || 30,
          monthlyIncome: manual.monthly_inflow || 0,
          monthlyExpenses: manual.monthly_outflow || 0,
          totalAssets: calculated.total_assets || 0,
          totalLiabilities: calculated.total_liabilities || 0,
          netPosition: calculated.net_position || 0,
          creditUtilization: calculated.utilization_rate || 0,
          emergencyFundRatio: calculated.emergency_fund_ratio || 0,
          casaBalance: manual.casa_balance || 0,
          investmentValue: manual.investment_portfolio_value || 0,
          insuranceValue: manual.insurance_value || 0,
          current_emergency_fund: manual.current_emergency_fund || 0,
          three_month_expenses: manual.three_month_expenses || 0,
          netCashFlow: calculated.monthly_net_cash_flow || 0
        };

        // Calculate client profiles
        const riskProfile = calculateRiskProfile(clientData);
        const investmentProfile = calculateInvestmentProfile(clientData);

        setClientProfile({
          riskProfile,
          investmentProfile,
          clientData
        });

        // Generate personalized recommendations using utility functions
        const personalizedRecommendations = generatePersonalizedRecommendations(clientData, PRODUCT_CATALOG);
        
        // Add estimated values
        const recommendationsWithValues = personalizedRecommendations.map(rec => ({
          ...rec,
          estimatedValue: calculateEstimatedValue(rec, clientData)
        }));

        setRecommendations(recommendationsWithValues);
      } catch (err) {
        console.error('Error generating recommendations:', err);
        setError(err.message);
        // Fallback recommendations
        setRecommendations(getFallbackRecommendations());
      } finally {
        setLoading(false);
      }
    };

    generateRecommendations();
  }, [clientNric]);

  return { recommendations, loading, error, clientProfile };
};

// Product catalog with AmBank Malaysia products
const PRODUCT_CATALOG = {
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
    },
    {
      id: 'ambank_fixed_deposit',
      type: 'Investment',
      name: 'AmBank Fixed Deposit',
      description: 'Secure fixed deposit with guaranteed returns and flexible tenures',
      suitability: 'Medium',
      expectedReturn: '3.8%',
      risk: 'Low',
      minDeposit: 1000,
      features: ['Guaranteed returns', 'Flexible tenures (1-60 months)', 'Competitive rates', 'Auto-renewal option'],
      requirements: ['Minimum deposit: RM1,000', 'Valid Malaysian ID', 'Age 18+']
    },
    {
      id: 'ambank_goal_savings',
      type: 'Savings',
      name: 'AmBank Goal Savings Account',
      description: 'Purpose-driven savings account with bonus interest for achieving savings goals',
      suitability: 'High',
      expectedReturn: '3.2%',
      risk: 'Low',
      minDeposit: 500,
      features: ['Goal-based savings', 'Bonus interest rates', 'No monthly fees', 'Easy goal tracking'],
      requirements: ['Minimum balance: RM500', 'Monthly deposit commitment', 'Goal setting required']
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
    },
    {
      id: 'ambank_structured_deposits',
      type: 'Investment',
      name: 'AmBank Structured Deposits',
      description: 'Investment-linked deposits with potential for higher returns based on market performance',
      suitability: 'Medium',
      expectedReturn: '4-8%',
      risk: 'Medium',
      minInvestment: 5000,
      features: ['Capital protection options', 'Market-linked returns', 'Flexible tenures', 'Regular income'],
      requirements: ['Minimum investment: RM5,000', 'Understanding of structured products', 'Risk tolerance assessment']
    },
    {
      id: 'ambank_foreign_currency_fixed_deposit',
      type: 'Investment',
      name: 'AmBank Foreign Currency Fixed Deposit',
      description: 'Fixed deposits in major foreign currencies with competitive interest rates',
      suitability: 'Medium',
      expectedReturn: '2-5%',
      risk: 'Medium',
      minInvestment: 1000,
      features: ['Multiple currency options', 'Competitive rates', 'Currency diversification', 'Flexible tenures'],
      requirements: ['Minimum investment: RM1,000 equivalent', 'Currency risk understanding', 'Valid Malaysian ID']
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
    },
    {
      id: 'ambank_critical_illness',
      type: 'Insurance',
      name: 'AmBank Critical Illness Protection',
      description: 'Financial protection against critical illnesses with comprehensive coverage',
      suitability: 'Medium',
      monthlyPremium: 'RM80-300',
      coverage: 'RM100,000-500,000',
      features: ['Covers 36+ critical illnesses', 'Lump sum payout', 'Survival period benefits', 'Premium waiver options'],
      requirements: ['Age 18-60', 'Medical examination', 'Regular premium payments', 'No pre-existing conditions']
    },
    {
      id: 'ambank_personal_accident',
      type: 'Insurance',
      name: 'AmBank Personal Accident Insurance',
      description: 'Comprehensive accident coverage with worldwide protection and additional benefits',
      suitability: 'Medium',
      monthlyPremium: 'RM30-100',
      coverage: 'RM50,000-200,000',
      features: ['Worldwide coverage', '24/7 protection', 'Medical expenses coverage', 'Disability benefits'],
      requirements: ['Age 18-65', 'Active lifestyle', 'Regular premium payments', 'No hazardous occupations']
    }
  ],
  credit: [
    {
      id: 'ambank_credit_card',
      type: 'Credit',
      name: 'AmBank Credit Cards',
      description: 'Range of credit cards with rewards, cashback, and travel benefits',
      suitability: 'Medium',
      annualFee: 'RM0-500',
      creditLimit: 'RM5,000-50,000',
      features: ['Rewards points', 'Cashback on purchases', 'Travel insurance', 'Purchase protection', '0% installment plans'],
      requirements: ['Annual income: RM24,000+', 'Good credit score', 'Age 21-65', 'Regular employment']
    },
    {
      id: 'ambank_personal_loan',
      type: 'Credit',
      name: 'AmBank Personal Loan',
      description: 'Flexible personal financing for various needs with competitive interest rates',
      suitability: 'Low',
      interestRate: '7.5-12%',
      maxAmount: 'RM100,000',
      features: ['Quick approval', 'Flexible repayment terms', 'No collateral required', 'Competitive rates', 'Online application'],
      requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Age 21-60', 'Minimum income RM2,000']
    },
    {
      id: 'ambank_home_loan',
      type: 'Credit',
      name: 'AmBank Home Loan',
      description: 'Competitive home financing with flexible repayment options and competitive rates',
      suitability: 'Medium',
      interestRate: '3.5-4.5%',
      maxAmount: 'RM2,000,000',
      features: ['Competitive rates', 'Flexible repayment', 'Multiple property types', 'Online application', 'Professional advice'],
      requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Property valuation', 'Legal documentation']
    },
    {
      id: 'ambank_car_loan',
      type: 'Credit',
      name: 'AmBank Car Loan',
      description: 'Vehicle financing with competitive rates and flexible repayment terms',
      suitability: 'Medium',
      interestRate: '3.2-4.8%',
      maxAmount: 'RM500,000',
      features: ['Competitive rates', 'Flexible tenures', 'Quick approval', 'Online application', 'Multiple vehicle types'],
      requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Vehicle registration', 'Insurance coverage']
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
    },
    {
      id: 'ambank_islamic_fixed_deposit',
      type: 'Islamic',
      name: 'AmBank Islamic Fixed Deposit',
      description: 'Shariah-compliant fixed deposit with profit sharing and guaranteed returns',
      suitability: 'Medium',
      expectedReturn: '4.0%',
      risk: 'Low',
      minDeposit: 1000,
      features: ['Shariah-compliant', 'Profit sharing', 'Flexible tenures', 'Guaranteed returns', 'Ethical investment'],
      requirements: ['Minimum deposit: RM1,000', 'Shariah compliance preference', 'Valid Malaysian ID']
    },
    {
      id: 'ambank_islamic_home_financing',
      type: 'Islamic',
      name: 'AmBank Islamic Home Financing',
      description: 'Shariah-compliant home financing with competitive profit rates',
      suitability: 'Medium',
      interestRate: '3.8-4.8%',
      maxAmount: 'RM2,000,000',
      features: ['Shariah-compliant', 'Competitive rates', 'Flexible repayment', 'Multiple property types', 'Ethical financing'],
      requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Property valuation', 'Shariah compliance']
    }
  ]
};

function analyzeClientProfile(client, manual, calculated, behavioral) {
  const recommendations = [];
  
  // Extract key metrics
  const age = calculated.calculated_age || 30;
  const monthlyIncome = manual.monthly_inflow || 0;
  const monthlyExpenses = manual.monthly_outflow || 0;
  const netCashFlow = monthlyIncome - monthlyExpenses;
  const totalAssets = calculated.total_assets || 0;
  const totalLiabilities = calculated.total_liabilities || 0;
  const netWorth = calculated.net_position || 0;
  const creditUtilization = calculated.utilization_rate || 0;
  const emergencyFundRatio = calculated.emergency_fund_ratio || 0;
  const casaBalance = manual.casa_balance || 0;
  const investmentValue = manual.investment_portfolio_value || 0;
  const insuranceValue = manual.insurance_value || 0;

  // Analyze client profile and generate recommendations
  
  // 1. Emergency Fund Analysis
  if (emergencyFundRatio < 100) {
    recommendations.push({
      ...PRODUCT_CATALOG.savings[0],
      priority: 'High',
      reasoning: `Your emergency fund covers only ${Math.round(emergencyFundRatio)}% of 3-month expenses. A high-yield savings account can help build your emergency fund faster.`,
      estimatedValue: Math.max(5000, monthlyExpenses * 3 - manual.current_emergency_fund)
    });
  }

  // 2. Investment Opportunities
  if (casaBalance > 10000 && investmentValue < totalAssets * 0.3) {
    recommendations.push({
      ...PRODUCT_CATALOG.investment[0],
      priority: 'High',
      reasoning: `You have RM${casaBalance.toLocaleString()} in savings but limited investments. Consider diversifying with an index fund portfolio.`,
      estimatedValue: Math.min(casaBalance * 0.5, 20000)
    });
  }

  // 3. Insurance Needs
  if (insuranceValue < monthlyIncome * 12) {
    recommendations.push({
      ...PRODUCT_CATALOG.insurance[0],
      priority: 'Medium',
      reasoning: `Your insurance coverage (RM${insuranceValue.toLocaleString()}) is less than your annual income. Consider term life insurance for family protection.`,
      estimatedValue: monthlyIncome * 12
    });
  }

  // 4. Credit Management
  if (creditUtilization > 70) {
    recommendations.push({
      ...PRODUCT_CATALOG.credit[1],
      priority: 'High',
      reasoning: `Your credit utilization is ${Math.round(creditUtilization)}%, which is high. A personal loan could help consolidate debt at lower rates.`,
      estimatedValue: totalLiabilities
    });
  }

  // 5. Savings Enhancement
  if (netCashFlow > 2000 && casaBalance < monthlyExpenses * 6) {
    recommendations.push({
      ...PRODUCT_CATALOG.savings[1],
      priority: 'Medium',
      reasoning: `You have positive cash flow of RM${netCashFlow.toLocaleString()}/month. Consider fixed deposits for higher returns on excess savings.`,
      estimatedValue: netCashFlow * 6
    });
  }

  // 6. Investment Diversification
  if (age < 50 && investmentValue > 0 && investmentValue < totalAssets * 0.5) {
    recommendations.push({
      ...PRODUCT_CATALOG.investment[1],
      priority: 'Medium',
      reasoning: `At age ${age}, you have time to grow your investments. Consider unit trusts for professional management and diversification.`,
      estimatedValue: Math.max(5000, totalAssets * 0.2)
    });
  }

  // 7. Credit Card Benefits
  if (monthlyIncome > 5000 && creditUtilization < 30) {
    recommendations.push({
      ...PRODUCT_CATALOG.credit[0],
      priority: 'Low',
      reasoning: `With good income and low credit utilization, you qualify for premium credit cards with rewards and benefits.`,
      estimatedValue: 1000
    });
  }

  // Sort by priority and estimated value
  return recommendations.sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.estimatedValue - a.estimatedValue;
  });
}

function getFallbackRecommendations() {
  return [
    {
      id: 'ambank_basic_savings',
      type: 'Savings',
      name: 'AmBank Savings Account',
      description: 'Start building your savings with AmBank\'s basic savings account',
      suitability: 'Medium',
      expectedReturn: '2.5%',
      risk: 'Low',
      priority: 'Medium',
      reasoning: 'An AmBank savings account is a good starting point for financial planning with competitive rates.',
      estimatedValue: 5000,
      features: ['No monthly fees', 'Free ATM withdrawals', 'Online banking', 'Mobile app access'],
      requirements: ['Valid Malaysian ID', 'Age 18+', 'Initial deposit: RM100']
    },
    {
      id: 'ambank_life_insurance_basic',
      type: 'Insurance',
      name: 'AmBank Life Insurance',
      description: 'Essential life insurance coverage from AmBank',
      suitability: 'High',
      monthlyPremium: 'RM50-200',
      coverage: 'RM50,000-1,000,000',
      priority: 'High',
      reasoning: 'AmBank life insurance provides essential protection for your family with flexible premium options.',
      estimatedValue: 200000,
      features: ['Flexible premium payments', 'Multiple coverage options', 'Riders available', 'Cash value accumulation'],
      requirements: ['Age 18-65', 'Medical underwriting', 'Regular premium payments', 'Good health']
    }
  ];
} 