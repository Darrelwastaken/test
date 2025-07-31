import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { getAIInsights } from '../utils/aiInsightsStorage';
import { 
  calculateRiskProfile, 
  calculateInvestmentProfile, 
  calculateEstimatedValue 
} from '../utils/productRecommendationUtils';

export const useAIProductRecommendations = (clientNric) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [clientProfile, setClientProfile] = useState(null);

  useEffect(() => {
    const generateAIBasedRecommendations = async () => {
      if (!clientNric) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch AI insights and client data in parallel
        const [aiInsightsResult, clientResult, manualResult, calculatedResult] = await Promise.all([
          getAIInsights(clientNric),
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
            .single()
        ]);

        // Handle missing data gracefully
        const client = clientResult.data || {};
        const manual = manualResult.data || {};
        const calculated = calculatedResult.data || {};
        const insights = aiInsightsResult?.insights || [];

        setAiInsights(insights);

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

        // Generate recommendations based on AI insights
        const aiBasedRecommendations = generateRecommendationsFromAIInsights(insights, clientData, riskProfile, investmentProfile);
        setRecommendations(aiBasedRecommendations);

      } catch (err) {
        console.error('Error generating AI-based recommendations:', err);
        setError(err.message);
        // Fallback recommendations
        setRecommendations(getFallbackRecommendations());
      } finally {
        setLoading(false);
      }
    };

    generateAIBasedRecommendations();
  }, [clientNric]);

  return { recommendations, loading, error, clientProfile, aiInsights };
};

// Generate recommendations based on AI insights
function generateRecommendationsFromAIInsights(insights, clientData, riskProfile, investmentProfile) {
  const recommendations = [];
  
      // Map AI insight types to specific products
    insights.forEach((insight, index) => {
      const insightType = insight.type || 'general';
      const priority = insight.priority || 'MEDIUM';
      const estimatedValue = insight.estimatedValue || 10000;
      const productCategories = insight.productCategories || [];
      
      // Get products based on insight type and product categories
      const products = getProductsForInsightType(insightType, clientData, riskProfile, productCategories);
      
      products.forEach(product => {
        recommendations.push({
          ...product,
          priority: mapPriority(priority),
          reasoning: insight.insight || insight.reasoning || `Based on AI analysis: ${insightType}`,
          estimatedValue: calculateEstimatedValue(product, clientData),
          aiInsightIndex: index,
          confidence: insight.confidence || 0.7
        });
      });
    });

  // If no AI insights, generate basic recommendations
  if (recommendations.length === 0) {
    return generateBasicRecommendations(clientData, riskProfile, investmentProfile);
  }

  // Sort by priority and confidence
  return recommendations
    .sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.confidence - a.confidence;
    })
    .slice(0, 6); // Limit to top 6 recommendations
}

// Map AI insight types to specific products
function getProductsForInsightType(insightType, clientData, riskProfile, productCategories = []) {
  const products = [];

  // If product categories are provided from AI analysis, use them
  if (productCategories && productCategories.length > 0) {
    products.push(...getProductsByCategories(productCategories, clientData));
  } else {
    // Fallback to insight type mapping
    switch (insightType) {
      case 'cash_flow_analysis':
      case 'emergency_fund_analysis':
        if (clientData.emergencyFundRatio < 100) {
          products.push(
            getProductById('ambank_savings_account'),
            getProductById('ambank_goal_savings'),
            getProductById('ambank_islamic_savings')
          );
        }
        break;

      case 'investment_opportunity':
      case 'wealth_analysis':
        if (clientData.casaBalance > 10000) {
          products.push(
            getProductById('ambank_unit_trust'),
            getProductById('ambank_structured_deposits'),
            getProductById('ambank_fixed_deposit')
          );
        }
        break;

      case 'credit_analysis':
      case 'debt_consolidation':
        if (clientData.creditUtilization > 70) {
          products.push(
            getProductById('ambank_personal_loan'),
            getProductById('ambank_credit_card')
          );
        }
        break;

      case 'insurance_needs':
      case 'risk_analysis':
        if (clientData.insuranceValue < clientData.monthlyIncome * 12) {
          products.push(
            getProductById('ambank_life_insurance'),
            getProductById('ambank_critical_illness'),
            getProductById('ambank_personal_accident')
          );
        }
        break;

      case 'travel_analysis':
        // Dynamic travel product recommendations
        products.push(...getTravelProducts(clientData));
        break;

      case 'home_financing':
      case 'property_investment':
        if (clientData.monthlyIncome > 5000) {
          products.push(
            getProductById('ambank_home_loan'),
            getProductById('ambank_islamic_home_financing')
          );
        }
        break;

      case 'vehicle_financing':
        if (clientData.monthlyIncome > 3000) {
          products.push(getProductById('ambank_car_loan'));
        }
        break;

      case 'islamic_banking':
      case 'shariah_compliance':
        products.push(
          getProductById('ambank_islamic_savings'),
          getProductById('ambank_islamic_fixed_deposit'),
          getProductById('ambank_islamic_home_financing')
        );
        break;

      default:
        // Only provide general recommendations if no specific insight type is matched
        // This prevents generic products from being recommended for specific insights
        break;
    }
  }

  return products.filter(Boolean); // Remove undefined products
}

// Get products by dynamic categories
function getProductsByCategories(categories, clientData) {
  const products = [];
  
  categories.forEach(category => {
    switch (category) {
      case 'travel_cards':
        products.push(
          getProductById('ambank_travel_card'),
          getProductById('ambank_air_miles_card')
        );
        break;
      case 'multi_currency_accounts':
        products.push(getProductById('ambank_multi_currency_account'));
        break;
      case 'travel_insurance':
        products.push(
          getProductById('ambank_travel_insurance'),
          getProductById('ambank_personal_accident')
        );
        break;
      case 'air_miles_cards':
        products.push(getProductById('ambank_air_miles_card'));
        break;
      case 'booking_rewards':
        products.push(getProductById('ambank_travel_card'));
        break;
      case 'premium_travel_cards':
        products.push(getProductById('ambank_premium_travel_card'));
        break;
      case 'savings':
        products.push(
          getProductById('ambank_savings_account'),
          getProductById('ambank_goal_savings')
        );
        break;
      case 'investments':
        products.push(
          getProductById('ambank_unit_trust'),
          getProductById('ambank_fixed_deposit')
        );
        break;
      case 'insurance':
        products.push(
          getProductById('ambank_life_insurance'),
          getProductById('ambank_critical_illness')
        );
        break;
      case 'credit':
        products.push(
          getProductById('ambank_credit_card'),
          getProductById('ambank_personal_loan')
        );
        break;
      case 'islamic':
        products.push(
          getProductById('ambank_islamic_savings'),
          getProductById('ambank_islamic_fixed_deposit')
        );
        break;
    }
  });
  
  return products;
}

// Get travel-specific products
function getTravelProducts(clientData) {
  const products = [];
  
  // Always recommend travel card for travel spending
  products.push(getProductById('ambank_travel_card'));
  
  // If high spending, recommend premium travel card
  if (clientData.monthlyIncome > 8000) {
    products.push(getProductById('ambank_premium_travel_card'));
  }
  
  // Recommend travel insurance
  products.push(getProductById('ambank_travel_insurance'));
  
  // If currency exchange detected, recommend multi-currency account
  if (clientData.currencyExchange > 0) {
    products.push(getProductById('ambank_multi_currency_account'));
  }
  
  return products;
}

// Get product by ID from the catalog
function getProductById(productId) {
  const catalog = getProductCatalog();
  
  for (const category of Object.values(catalog)) {
    const product = category.find(p => p.id === productId);
    if (product) return product;
  }
  
  return null;
}

// Map AI priority to recommendation priority
function mapPriority(aiPriority) {
  switch (aiPriority) {
    case 'HIGH': return 'High';
    case 'MEDIUM': return 'Medium';
    case 'LOW': return 'Low';
    default: return 'Medium';
  }
}

// Generate basic recommendations when no AI insights are available
function generateBasicRecommendations(clientData, riskProfile, investmentProfile) {
  const recommendations = [];

  // Check for travel-related spending first (even in basic recommendations)
  const transactions = clientData.transactions || [];
  const travelSpending = analyzeBasicTravelSpending(transactions);
  
  if (travelSpending.totalAmount > 0) {
    // If travel spending is detected, prioritize travel products
    if (travelSpending.categories.currency_exchange > 0) {
      recommendations.push({
        ...getProductById('ambank_travel_card'),
        priority: 'High',
        reasoning: `You spent RM${travelSpending.categories.currency_exchange.toLocaleString()} on currency exchange. An AmBank travel card offers better rates and no foreign transaction fees.`,
        estimatedValue: travelSpending.categories.currency_exchange * 0.05
      });
      
      recommendations.push({
        ...getProductById('ambank_multi_currency_account'),
        priority: 'Medium',
        reasoning: `For frequent currency exchange, consider a multi-currency account for better rates and convenience.`,
        estimatedValue: travelSpending.categories.currency_exchange * 0.03
      });
    }
    
    if (travelSpending.totalAmount > 2000) {
      recommendations.push({
        ...getProductById('ambank_travel_insurance'),
        priority: 'Medium',
        reasoning: `With RM${travelSpending.totalAmount.toLocaleString()} in travel spending, travel insurance provides essential protection.`,
        estimatedValue: 5000
      });
    }
  } else {
    // Only show generic recommendations if no travel spending is detected
    // Emergency fund needs
    if (clientData.emergencyFundRatio < 100) {
      recommendations.push({
        ...getProductById('ambank_savings_account'),
        priority: 'High',
        reasoning: `Your emergency fund covers only ${Math.round(clientData.emergencyFundRatio)}% of 3-month expenses. Consider an AmBank savings account to build your emergency fund.`,
        estimatedValue: Math.max(5000, clientData.monthlyExpenses * 3 - clientData.current_emergency_fund)
      });
    }

    // Investment opportunities
    if (clientData.casaBalance > 10000 && clientData.investmentValue < clientData.totalAssets * 0.3) {
      recommendations.push({
        ...getProductById('ambank_unit_trust'),
        priority: 'Medium',
        reasoning: `You have RM${clientData.casaBalance.toLocaleString()} in savings but limited investments. Consider AmBank unit trust funds for diversification.`,
        estimatedValue: Math.min(clientData.casaBalance * 0.5, 20000)
      });
    }

    // Insurance needs
    if (clientData.insuranceValue < clientData.monthlyIncome * 12) {
      recommendations.push({
        ...getProductById('ambank_life_insurance'),
        priority: 'Medium',
        reasoning: `Your insurance coverage (RM${clientData.insuranceValue.toLocaleString()}) is less than your annual income. Consider AmBank life insurance for family protection.`,
        estimatedValue: clientData.monthlyIncome * 12
      });
    }
  }

  return recommendations;
}

// Basic travel spending analysis for fallback recommendations
function analyzeBasicTravelSpending(transactions) {
  const travelCategories = {
    currency_exchange: 0,
    travel_agencies: 0,
    airlines: 0,
    hotels: 0
  };

  let totalAmount = 0;

  transactions.forEach(transaction => {
    const amount = Math.abs(transaction.amount || 0);
    const description = (transaction.description || '').toLowerCase();
    const category = (transaction.category || '').toLowerCase();

    // Currency exchange detection
    if (description.includes('currency') || description.includes('forex') || 
        description.includes('exchange') || category.includes('currency')) {
      travelCategories.currency_exchange += amount;
      totalAmount += amount;
    }
    // Travel agencies
    else if (description.includes('travel') || description.includes('agency') || 
             description.includes('booking') || category.includes('travel')) {
      travelCategories.travel_agencies += amount;
      totalAmount += amount;
    }
    // Airlines
    else if (description.includes('airline') || description.includes('flight') || 
             description.includes('mas') || description.includes('airasia') || 
             description.includes('malaysia airlines') || category.includes('airline')) {
      travelCategories.airlines += amount;
      totalAmount += amount;
    }
    // Hotels
    else if (description.includes('hotel') || description.includes('resort') || 
             description.includes('accommodation') || category.includes('hotel')) {
      travelCategories.hotels += amount;
      totalAmount += amount;
    }
  });

  return {
    totalAmount,
    categories: travelCategories
  };
}

// Get the product catalog (same as in the main hook)
function getProductCatalog() {
  return {
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
       },
       {
         id: 'ambank_multi_currency_account',
         type: 'Savings',
         name: 'AmBank Multi-Currency Account',
         description: 'Savings account that supports multiple currencies for international transactions',
         suitability: 'Medium',
         expectedReturn: '2.0-4.5%',
         risk: 'Low',
         minDeposit: 1000,
         features: ['Multiple currency support', 'Competitive exchange rates', 'International transfers', 'Online currency trading', 'No foreign transaction fees'],
         requirements: ['Minimum balance: RM1,000', 'Valid Malaysian ID', 'Age 18+', 'International banking needs']
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
       },
       {
         id: 'ambank_travel_insurance',
         type: 'Insurance',
         name: 'AmBank Travel Insurance',
         description: 'Comprehensive travel insurance with worldwide coverage and emergency assistance',
         suitability: 'High',
         monthlyPremium: 'RM50-150',
         coverage: 'RM100,000-500,000',
         features: ['Worldwide coverage', 'Emergency medical assistance', 'Trip cancellation', 'Baggage protection', '24/7 helpline'],
         requirements: ['Age 18-70', 'Valid travel documents', 'Trip duration < 90 days', 'No pre-existing conditions']
       }
     ],
    credit: [
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
       },
       {
         id: 'ambank_travel_card',
         type: 'Credit',
         name: 'AmBank Travel Credit Card',
         description: 'Specialized credit card for travel expenses with travel rewards and benefits',
         suitability: 'High',
         annualFee: 'RM200',
         creditLimit: 'RM10,000-50,000',
         features: ['Travel rewards points', 'No foreign transaction fees', 'Travel insurance coverage', 'Airport lounge access', 'Travel booking discounts'],
         requirements: ['Annual income: RM36,000+', 'Good credit score', 'Age 21-65', 'Frequent traveler']
       },
       {
         id: 'ambank_premium_travel_card',
         type: 'Credit',
         name: 'AmBank Premium Travel Card',
         description: 'Premium travel credit card with exclusive travel benefits and concierge services',
         suitability: 'High',
         annualFee: 'RM500',
         creditLimit: 'RM20,000-100,000',
         features: ['Premium travel rewards', 'Concierge services', 'Priority boarding', 'Hotel upgrades', 'Comprehensive travel insurance'],
         requirements: ['Annual income: RM60,000+', 'Excellent credit score', 'Age 25-65', 'High travel frequency']
       },
       {
         id: 'ambank_air_miles_card',
         type: 'Credit',
         name: 'AmBank Air Miles Credit Card',
         description: 'Credit card that earns air miles for flight redemptions and travel rewards',
         suitability: 'Medium',
         annualFee: 'RM300',
         creditLimit: 'RM15,000-75,000',
         features: ['Air miles earning', 'Flight redemption', 'Airport transfers', 'Baggage insurance', 'Travel accident coverage'],
         requirements: ['Annual income: RM48,000+', 'Good credit score', 'Age 21-65', 'Regular air travel']
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