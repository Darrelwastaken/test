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
        const [aiInsightsResult, clientResult, manualResult, calculatedResult, transactionsResult] = await Promise.all([
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
            .single(),
          supabase
            .from('transactions')
            .select('*')
            .eq('client_nric', clientNric)
            .order('transaction_date', { ascending: false })
            .limit(100)
        ]);

        // Handle missing data gracefully
        const client = clientResult.data || {};
        const manual = manualResult.data || {};
        const calculated = calculatedResult.data || {};
        const transactions = transactionsResult.data || [];
        let insights = aiInsightsResult?.insights || [];

        // Debug logging
        console.log('Product Recommendations - AI Insights Result:', {
          aiInsightsResult,
          insightsCount: insights.length,
          hasInsights: !!insights.length,
          transactionCount: transactions.length
        });

        // If no insights from database, try to generate them
        if (!insights || insights.length === 0) {
          console.log('No AI insights found in database, attempting to generate...');
          try {
            const { generateAndSaveInsights } = await import('../utils/aiInsightsStorage');
            const clientData = {
              nric: clientNric,
              client: client,
              dashboard: {
                assets: calculated.total_assets || 0,
                cashflow: manual.monthly_inflow || 0,
                accountBalances: {
                  casa: manual.casa_balance || 0,
                  fd: manual.fixed_deposit_value || 0,
                  loans: calculated.total_liabilities || 0,
                  cards: 0
                }
              },
              financial: {
                netWorth: calculated.net_position || 0,
                monthlyIncome: manual.monthly_inflow || 0,
                assetUtilization: calculated.utilization_rate || 0
              },
              investments: {
                totalValue: manual.investment_portfolio_value || 0,
                holdings: []
              },
              transactions: transactions
            };
            
            const result = await generateAndSaveInsights(clientData);
            insights = result?.insights || [];
            console.log('Generated insights:', insights);
          } catch (genError) {
            console.error('Error generating insights:', genError);
            // Use fallback insights
            insights = [
              {
                insight: "Financial profile analyzed - banking data available",
                reasoning: "Based on your financial data, we've identified opportunities for wealth optimization and risk management.",
                priority: 'MEDIUM',
                type: 'wealth_analysis',
                confidence: 0.7,
                estimatedValue: 10000,
                recommendedProduct: {
                  id: 'ambank_savings_account',
                  name: 'AmBank Savings Account',
                  type: 'Savings',
                  description: 'Basic savings account with competitive interest rates and easy access to funds',
                  reasoning: 'A good starting point for financial planning with competitive rates.',
                  expectedReturn: '2.5%',
                  risk: 'Low',
                  minDeposit: 100
                }
              }
            ];
          }
        }

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
        
        // Also update insights to include product information for display
        const insightsWithProducts = insights.map((insight, index) => {
          // If insight has product information, ensure it's properly formatted
          if (insight.product) {
            return {
              ...insight,
              recommendedProduct: {
                name: insight.product,
                description: insight.productReasoning || insight.reasoning,
                reasoning: insight.productReasoning || insight.reasoning,
                type: 'Product Recommendation'
              }
            };
          }
          return insight;
        });
        
        setAiInsights(insightsWithProducts);

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
  
  // Use recommended products from AI insights
  insights.forEach((insight, index) => {
    if (insight.product) {
      // Handle new format with embedded product information
      recommendations.push({
        id: `ai_recommendation_${index}`,
        name: insight.product,
        description: insight.productReasoning || insight.reasoning,
        reasoning: insight.productReasoning || insight.reasoning,
        type: 'Product Recommendation',
        priority: mapPriority(insight.priority || 'MEDIUM'),
        estimatedValue: insight.estimatedValue || 5000,
        aiInsightIndex: index,
        confidence: insight.confidence || 0.7
      });
    } else if (insight.recommendedProduct) {
      // Handle legacy format
      recommendations.push({
        ...insight.recommendedProduct,
        priority: mapPriority(insight.priority || 'MEDIUM'),
        reasoning: insight.reasoning || insight.insight || `Based on AI analysis: ${insight.type}`,
        estimatedValue: insight.estimatedValue || calculateEstimatedValue(insight.recommendedProduct, clientData),
        aiInsightIndex: index,
        confidence: insight.confidence || 0.7
      });
    }
  });

  // If no AI insights with recommended products, generate basic recommendations
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
      },
      {
        id: 'ambank_true_savers',
        type: 'Savings',
        name: 'TRUE Savers Account / Account‑i',
        description: 'Savings account with bonus interest for regular deposits and Islamic banking option',
        suitability: 'High',
        expectedReturn: '2.8-3.8%',
        risk: 'Low',
        minDeposit: 100,
        features: ['Bonus interest rates', 'Islamic banking option', 'Regular deposit rewards', 'No monthly fees'],
        requirements: ['Minimum balance: RM100', 'Monthly deposit commitment', 'Valid Malaysian ID']
      },
      {
        id: 'ambank_basic_savings',
        type: 'Savings',
        name: 'Basic Savings Account / Account‑i',
        description: 'Traditional savings account with basic banking services and Islamic option',
        suitability: 'High',
        expectedReturn: '2.0-2.5%',
        risk: 'Low',
        minDeposit: 100,
        features: ['Basic banking services', 'Islamic banking option', 'ATM access', 'Online banking'],
        requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+']
      },
      {
        id: 'ambank_amwafeeq',
        type: 'Savings',
        name: 'AmWafeeq Account‑i',
        description: 'Islamic savings account with profit sharing and Shariah-compliant banking',
        suitability: 'High',
        expectedReturn: '2.5-3.5%',
        risk: 'Low',
        minDeposit: 100,
        features: ['Shariah-compliant', 'Profit sharing', 'Islamic banking', 'No interest', 'Ethical banking'],
        requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Shariah compliance preference']
      },
      {
        id: 'ambank_eflex_savings',
        type: 'Savings',
        name: 'eFlex Savings Account‑i',
        description: 'Flexible savings account with Islamic banking and digital features',
        suitability: 'High',
        expectedReturn: '2.8-3.2%',
        risk: 'Low',
        minDeposit: 100,
        features: ['Flexible banking', 'Islamic option', 'Digital features', 'Online banking'],
        requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+']
      },
      {
        id: 'ambank_amgenius',
        type: 'Savings',
        name: 'AmGenius',
        description: 'Smart savings account with innovative features and rewards',
        suitability: 'Medium',
        expectedReturn: '3.2-4.0%',
        risk: 'Low',
        minDeposit: 500,
        features: ['Smart features', 'Rewards program', 'Digital banking', 'Innovative tools'],
        requirements: ['Minimum balance: RM500', 'Valid Malaysian ID', 'Age 18+']
      },
      {
        id: 'ambank_savers_gang',
        type: 'Savings',
        name: 'Savers\' G.A.N.G. (for children)',
        description: 'Children\'s savings account with educational features and parental controls',
        suitability: 'High',
        expectedReturn: '2.5-3.0%',
        risk: 'Low',
        minDeposit: 50,
        features: ['Children\'s banking', 'Educational features', 'Parental controls', 'Savings goals'],
        requirements: ['Parent/guardian account', 'Child\'s birth certificate', 'Age 0-18']
      },
      {
        id: 'ambank_current_account',
        type: 'Current',
        name: 'Current Account / Account‑i',
        description: 'Transaction account for daily banking needs with Islamic option',
        suitability: 'High',
        expectedReturn: '0.5-1.0%',
        risk: 'Low',
        minDeposit: 100,
        features: ['Daily transactions', 'Islamic option', 'Checkbook facility', 'Online banking'],
        requirements: ['Minimum balance: RM100', 'Valid Malaysian ID', 'Age 18+']
      },
      {
        id: 'ambank_foreign_currency',
        type: 'Current',
        name: 'Foreign Currency Accounts / Account‑i',
        description: 'Multi-currency accounts for international transactions and Islamic banking',
        suitability: 'Medium',
        expectedReturn: '1.0-3.5%',
        risk: 'Medium',
        minDeposit: 1000,
        features: ['Multiple currencies', 'Islamic option', 'International transfers', 'Competitive rates'],
        requirements: ['Minimum balance: RM1,000 equivalent', 'Valid Malaysian ID', 'International needs']
      },
      {
        id: 'ambank_hybrid_current',
        type: 'Current',
        name: 'Hybrid Current Account‑i',
        description: 'Combined current and savings features with Islamic banking',
        suitability: 'High',
        expectedReturn: '1.5-2.5%',
        risk: 'Low',
        minDeposit: 500,
        features: ['Hybrid features', 'Islamic banking', 'Savings benefits', 'Transaction flexibility'],
        requirements: ['Minimum balance: RM500', 'Valid Malaysian ID', 'Age 18+']
      },
      {
        id: 'ambank_term_deposit',
        type: 'Investment',
        name: 'Term Deposit / Term Deposit‑i',
        description: 'Fixed-term deposits with guaranteed returns and Islamic option',
        suitability: 'Medium',
        expectedReturn: '3.5-5.0%',
        risk: 'Low',
        minDeposit: 1000,
        features: ['Guaranteed returns', 'Islamic option', 'Flexible tenures', 'Competitive rates'],
        requirements: ['Minimum deposit: RM1,000', 'Valid Malaysian ID', 'Age 18+']
      },
      {
        id: 'ambank_amquantum_term',
        type: 'Investment',
        name: 'AmQuantum Term Deposit‑i',
        description: 'Quantum-based term deposit with enhanced returns and Islamic banking',
        suitability: 'Medium',
        expectedReturn: '4.0-5.5%',
        risk: 'Low',
        minDeposit: 5000,
        features: ['Quantum features', 'Islamic banking', 'Enhanced returns', 'Flexible tenures'],
        requirements: ['Minimum deposit: RM5,000', 'Valid Malaysian ID', 'Age 18+']
      },
      {
        id: 'ambank_afhdal_term',
        type: 'Investment',
        name: 'Afhdal Term Deposit‑i',
        description: 'Premium term deposit with best rates and Islamic banking',
        suitability: 'Medium',
        expectedReturn: '4.5-6.0%',
        risk: 'Low',
        minDeposit: 10000,
        features: ['Premium rates', 'Islamic banking', 'Best returns', 'Priority service'],
        requirements: ['Minimum deposit: RM10,000', 'Valid Malaysian ID', 'Age 18+']
      },
      {
        id: 'ambank_amtdplus',
        type: 'Investment',
        name: 'AmTDPlus‑i',
        description: 'Enhanced term deposit with additional benefits and Islamic banking',
        suitability: 'Medium',
        expectedReturn: '4.2-5.8%',
        risk: 'Low',
        minDeposit: 5000,
        features: ['Enhanced benefits', 'Islamic banking', 'Additional features', 'Flexible options'],
        requirements: ['Minimum deposit: RM5,000', 'Valid Malaysian ID', 'Age 18+']
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
      },
      {
        id: 'ambank_enrich_visa',
        type: 'Credit',
        name: 'AmBank Enrich Visa Infinite & Platinum',
        description: 'Premium credit cards with travel rewards and exclusive benefits',
        suitability: 'Medium',
        annualFee: 'RM200-800',
        creditLimit: 'RM20,000-100,000',
        features: ['Travel rewards', 'Airport lounge access', 'Travel insurance', 'Premium benefits'],
        requirements: ['Annual income: RM60,000+', 'Excellent credit score', 'Age 21-65']
      },
      {
        id: 'ambank_visa_series',
        type: 'Credit',
        name: 'Visa Infinite, Visa Signature, Cash Rebate Visa Platinum',
        description: 'Range of Visa credit cards with different reward structures',
        suitability: 'Medium',
        annualFee: 'RM100-500',
        creditLimit: 'RM10,000-50,000',
        features: ['Rewards points', 'Cash rebates', 'Travel benefits', 'Purchase protection'],
        requirements: ['Annual income: RM36,000+', 'Good credit score', 'Age 21-65']
      },
      {
        id: 'ambank_bonuslink_visa',
        type: 'Credit',
        name: 'BonusLink Visa Series (Gold, Platinum, Gold CARz, M-Series, True Visa)',
        description: 'BonusLink rewards credit cards with various benefits and categories',
        suitability: 'Medium',
        annualFee: 'RM0-300',
        creditLimit: 'RM5,000-30,000',
        features: ['BonusLink points', 'Category rewards', 'Fuel rebates', 'Shopping benefits'],
        requirements: ['Annual income: RM24,000+', 'Good credit score', 'Age 21-65']
      },
      {
        id: 'ambank_mastercard_series',
        type: 'Credit',
        name: 'Mastercard Platinum, Gold CARz, World Mastercard',
        description: 'Mastercard credit cards with international acceptance and benefits',
        suitability: 'Medium',
        annualFee: 'RM100-400',
        creditLimit: 'RM8,000-40,000',
        features: ['International acceptance', 'Travel benefits', 'Purchase protection', 'Rewards program'],
        requirements: ['Annual income: RM30,000+', 'Good credit score', 'Age 21-65']
      },
      {
        id: 'ambank_unionpay_platinum',
        type: 'Credit',
        name: 'UnionPay Platinum',
        description: 'UnionPay credit card with China and Asia-Pacific benefits',
        suitability: 'Medium',
        annualFee: 'RM150-300',
        creditLimit: 'RM8,000-35,000',
        features: ['UnionPay network', 'Asia-Pacific benefits', 'Travel rewards', 'Shopping discounts'],
        requirements: ['Annual income: RM30,000+', 'Good credit score', 'Age 21-65']
      },
      {
        id: 'ambank_signature_priority',
        type: 'Credit',
        name: 'AmBank SIGNATURE Priority Banking Visa Infinite (Metal Card)',
        description: 'Exclusive metal credit card for priority banking customers',
        suitability: 'Low',
        annualFee: 'RM800-1200',
        creditLimit: 'RM50,000-200,000',
        features: ['Metal card design', 'Priority banking', 'Exclusive benefits', 'Concierge service'],
        requirements: ['Priority banking status', 'Annual income: RM120,000+', 'Excellent credit score']
      },
      {
        id: 'ambank_nexg_prepaid',
        type: 'Prepaid',
        name: 'NexG PrePaid Card',
        description: 'Prepaid card for controlled spending and online transactions',
        suitability: 'High',
        annualFee: 'RM0-50',
        features: ['Controlled spending', 'Online transactions', 'No credit check', 'Reloadable'],
        requirements: ['Valid Malaysian ID', 'Age 18+', 'No credit history required']
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
      },
      {
        id: 'ambank_term_financing_asb',
        type: 'Credit',
        name: 'Term Financing‑i (ASB/ASB2)',
        description: 'Islamic financing for ASB and ASB2 investments',
        suitability: 'Medium',
        interestRate: '4.5-6.5%',
        maxAmount: 'RM200,000',
        features: ['Islamic financing', 'ASB investment', 'Competitive rates', 'Flexible terms'],
        requirements: ['ASB account', 'Good credit history', 'Stable income', 'Age 21-60']
      },
      {
        id: 'ambank_amoneylines',
        type: 'Credit',
        name: 'AmMoneyLine / AmMoneyLine‑i',
        description: 'Overdraft facility with Islamic banking option',
        suitability: 'Medium',
        interestRate: '8.0-15.0%',
        maxAmount: 'RM50,000',
        features: ['Overdraft facility', 'Islamic option', 'Flexible usage', 'Interest on usage only'],
        requirements: ['Current account', 'Good credit history', 'Stable income', 'Age 21-60']
      },
      {
        id: 'ambank_auto_financing',
        type: 'Credit',
        name: 'Islamic and conventional auto financing',
        description: 'Vehicle financing with both conventional and Islamic options',
        suitability: 'Medium',
        interestRate: '3.2-4.8%',
        maxAmount: 'RM500,000',
        features: ['Conventional & Islamic', 'Competitive rates', 'Flexible tenures', 'Quick approval'],
        requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Vehicle registration']
      },
      {
        id: 'ambank_home_loan',
        type: 'Credit',
        name: 'Home Loan Facility',
        description: 'Conventional home financing with competitive rates',
        suitability: 'Medium',
        interestRate: '3.5-4.5%',
        maxAmount: 'RM2,000,000',
        features: ['Competitive rates', 'Flexible repayment', 'Multiple property types', 'Professional advice'],
        requirements: ['Stable income', 'Good credit history', 'DSR < 70%', 'Property valuation']
      },
      {
        id: 'ambank_home_link',
        type: 'Credit',
        name: 'Home Link',
        description: 'Home equity financing using property as collateral',
        suitability: 'Medium',
        interestRate: '4.0-5.5%',
        maxAmount: 'RM1,000,000',
        features: ['Home equity', 'Flexible usage', 'Competitive rates', 'Property collateral'],
        requirements: ['Property ownership', 'Good credit history', 'Property equity', 'Age 21-60']
      },
      {
        id: 'ambank_pr1ma_spef',
        type: 'Credit',
        name: 'PR1MA / SPEF',
        description: 'Specialized financing for PR1MA and SPEF properties',
        suitability: 'Medium',
        interestRate: '3.8-4.8%',
        maxAmount: 'RM500,000',
        features: ['PR1MA financing', 'SPEF properties', 'Special rates', 'Government support'],
        requirements: ['PR1MA/SPEF eligibility', 'Good credit history', 'Stable income', 'Age 21-60']
      },
      {
        id: 'ambank_property_link',
        type: 'Credit',
        name: 'Property Link',
        description: 'Property investment financing with flexible terms',
        suitability: 'Medium',
        interestRate: '4.2-5.2%',
        maxAmount: 'RM1,500,000',
        features: ['Property investment', 'Flexible terms', 'Competitive rates', 'Investment focus'],
        requirements: ['Investment property', 'Good credit history', 'Stable income', 'Age 21-60']
      },
      {
        id: 'ambank_term_financing_i',
        type: 'Credit',
        name: 'Term Financing‑i',
        description: 'Islamic term financing for various purposes',
        suitability: 'Medium',
        interestRate: '4.5-6.5%',
        maxAmount: 'RM200,000',
        features: ['Islamic financing', 'Flexible terms', 'Shariah-compliant', 'Competitive rates'],
        requirements: ['Stable income', 'Good credit history', 'Islamic preference', 'Age 21-60']
      },
      {
        id: 'ambank_commercial_property',
        type: 'Credit',
        name: 'Commercial Property Financing',
        description: 'Financing for commercial properties and business premises',
        suitability: 'Medium',
        interestRate: '4.8-6.0%',
        maxAmount: 'RM5,000,000',
        features: ['Commercial properties', 'Business premises', 'Competitive rates', 'Flexible terms'],
        requirements: ['Business registration', 'Good credit history', 'Property valuation', 'Age 21-60']
      },
      {
        id: 'ambank_skim_jaminan',
        type: 'Credit',
        name: 'Skim Jaminan Kredit Perumahan',
        description: 'Housing credit guarantee scheme for first-time buyers',
        suitability: 'High',
        interestRate: '3.8-4.8%',
        maxAmount: 'RM300,000',
        features: ['First-time buyers', 'Government guarantee', 'Special rates', 'Low down payment'],
        requirements: ['First-time buyer', 'Good credit history', 'Stable income', 'Age 21-60']
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
      },
      {
        id: 'ambank_direct_bond_sukuk',
        type: 'Investment',
        name: 'Direct Bond / Sukuk',
        description: 'Direct investment in bonds and Islamic sukuk instruments',
        suitability: 'Medium',
        expectedReturn: '4-8%',
        risk: 'Medium',
        minInvestment: 10000,
        features: ['Direct investment', 'Islamic sukuk', 'Fixed income', 'Regular coupons'],
        requirements: ['Minimum investment: RM10,000', 'Understanding of bonds', 'Risk tolerance assessment']
      },
      {
        id: 'ambank_dual_currency',
        type: 'Investment',
        name: 'Dual Currency Investments',
        description: 'Investment products linked to currency movements',
        suitability: 'High',
        expectedReturn: '5-12%',
        risk: 'High',
        minInvestment: 5000,
        features: ['Currency-linked', 'Higher returns', 'Currency risk', 'Flexible tenures'],
        requirements: ['Minimum investment: RM5,000', 'Currency understanding', 'High risk tolerance']
      },
      {
        id: 'ambank_equities',
        type: 'Investment',
        name: 'Equities',
        description: 'Direct equity investment in Malaysian and international markets',
        suitability: 'High',
        expectedReturn: '8-20%',
        risk: 'High',
        minInvestment: 1000,
        features: ['Direct equity', 'Market exposure', 'High returns', 'Dividend income'],
        requirements: ['Minimum investment: RM1,000', 'Market understanding', 'High risk tolerance']
      },
      {
        id: 'ambank_smart_partnership',
        type: 'Investment',
        name: 'Smart Partnership Programme (SPP)',
        description: 'Partnership investment program with professional management',
        suitability: 'Medium',
        expectedReturn: '7-12%',
        risk: 'Medium',
        minInvestment: 5000,
        features: ['Partnership program', 'Professional management', 'Diversified exposure', 'Regular income'],
        requirements: ['Minimum investment: RM5,000', 'Partnership agreement', 'Risk assessment']
      },
      {
        id: 'ambank_wealth_advisory',
        type: 'Service',
        name: 'Wealth Advisory Services',
        description: 'Professional wealth management and financial planning services',
        suitability: 'High',
        serviceFee: '0.5-2.0%',
        features: ['Professional advice', 'Financial planning', 'Portfolio management', 'Tax optimization'],
        requirements: ['Minimum assets: RM100,000', 'Wealth management needs', 'Professional consultation']
      },
      {
        id: 'ambank_private_banking',
        type: 'Service',
        name: 'AmPrivate Banking',
        description: 'Exclusive private banking services for high net worth individuals',
        suitability: 'Low',
        serviceFee: '1.0-3.0%',
        features: ['Exclusive services', 'Dedicated relationship manager', 'Premium products', 'Concierge services'],
        requirements: ['Minimum assets: RM1,000,000', 'High net worth status', 'Private banking eligibility']
      },
      {
        id: 'ambank_priority_banking',
        type: 'Service',
        name: 'Priority Banking tiers',
        description: 'Tiered priority banking services with exclusive benefits',
        suitability: 'Medium',
        serviceFee: '0.3-1.5%',
        features: ['Priority services', 'Exclusive benefits', 'Dedicated support', 'Premium products'],
        requirements: ['Minimum assets: RM200,000', 'Priority banking eligibility', 'Relationship management']
      },
      {
        id: 'ambank_will_wasiat',
        type: 'Service',
        name: 'Will / Wasiat writing',
        description: 'Professional will writing and Islamic wasiat services',
        suitability: 'High',
        serviceFee: 'RM500-2000',
        features: ['Will writing', 'Islamic wasiat', 'Legal documentation', 'Estate planning'],
        requirements: ['Legal consultation', 'Documentation requirements', 'Estate planning needs']
      },
      {
        id: 'ambank_legacy_estate',
        type: 'Service',
        name: 'Legacy & estate planning',
        description: 'Comprehensive estate planning and legacy management services',
        suitability: 'High',
        serviceFee: 'RM1000-5000',
        features: ['Estate planning', 'Legacy management', 'Tax optimization', 'Succession planning'],
        requirements: ['Estate planning needs', 'Professional consultation', 'Documentation requirements']
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
      },
      {
        id: 'ambank_life_insurance',
        type: 'Insurance',
        name: 'Life Insurance (savings, protection, legacy, credit-linked)',
        description: 'Comprehensive life insurance with various coverage options',
        suitability: 'High',
        monthlyPremium: 'RM50-300',
        coverage: 'RM50,000-1,000,000',
        features: ['Savings component', 'Protection coverage', 'Legacy planning', 'Credit-linked protection'],
        requirements: ['Age 18-65', 'Medical underwriting', 'Regular premium payments', 'Good health']
      },
      {
        id: 'ambank_family_takaful',
        type: 'Insurance',
        name: 'Family Takaful (Islamic life/family coverage)',
        description: 'Shariah-compliant family protection and life coverage',
        suitability: 'High',
        monthlyPremium: 'RM50-250',
        coverage: 'RM50,000-500,000',
        features: ['Shariah-compliant', 'Family protection', 'Islamic principles', 'Profit sharing'],
        requirements: ['Age 18-65', 'Islamic preference', 'Regular contributions', 'Good health']
      }
    ],
    corporate_treasury: [
      {
        id: 'ambank_sme_corporate',
        type: 'Service',
        name: 'SME & Corporate Banking',
        description: 'Comprehensive banking services for SMEs and corporations',
        suitability: 'Medium',
        serviceFee: 'Variable',
        features: ['Business accounts', 'Trade finance', 'Cash management', 'Corporate lending'],
        requirements: ['Business registration', 'Corporate structure', 'Banking relationship', 'Financial documentation']
      },
      {
        id: 'ambank_cash_management',
        type: 'Service',
        name: 'Cash management',
        description: 'Advanced cash management solutions for businesses',
        suitability: 'Medium',
        serviceFee: '0.1-0.5%',
        features: ['Cash pooling', 'Payment solutions', 'Receivables management', 'Liquidity management'],
        requirements: ['Business registration', 'Cash management needs', 'Corporate structure', 'Banking relationship']
      },
      {
        id: 'ambank_trade_finance_corp',
        type: 'Service',
        name: 'Trade finance',
        description: 'Comprehensive trade finance solutions for international business',
        suitability: 'Medium',
        serviceFee: '0.5-2.0%',
        features: ['Import/export finance', 'Letters of credit', 'Trade guarantees', 'Documentary collections'],
        requirements: ['Business registration', 'Trade activities', 'International business', 'Trade documentation']
      },
      {
        id: 'ambank_payroll_solutions',
        type: 'Service',
        name: 'Payroll solutions',
        description: 'Comprehensive payroll and HR management solutions',
        suitability: 'Medium',
        serviceFee: 'RM2-10 per employee',
        features: ['Payroll processing', 'HR management', 'Tax compliance', 'Employee benefits'],
        requirements: ['Business registration', 'Employee base', 'HR needs', 'Compliance requirements']
      },
      {
        id: 'ambank_business_accounts',
        type: 'Service',
        name: 'Business current accounts',
        description: 'Specialized current accounts for business operations',
        suitability: 'High',
        serviceFee: 'RM0-200',
        features: ['Business transactions', 'Online banking', 'Checkbook facility', 'Business support'],
        requirements: ['Business registration', 'Valid business documentation', 'Business needs assessment']
      },
      {
        id: 'ambank_structured_products',
        type: 'Investment',
        name: 'Structured Products (autocallables, capital-protected notes, equity-linked investments, FX, dual currency investments)',
        description: 'Sophisticated investment products with various risk-return profiles',
        suitability: 'High',
        expectedReturn: '5-20%',
        risk: 'High',
        minInvestment: 10000,
        features: ['Autocallables', 'Capital protection', 'Equity-linked', 'FX products', 'Dual currency'],
        requirements: ['Minimum investment: RM10,000', 'Sophisticated investor', 'High risk tolerance', 'Product understanding']
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