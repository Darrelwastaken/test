// Data-Driven Banking Analysis System
// This system analyzes client data using statistical methods and business rules
// to generate actionable insights based purely on actual data

import fetch from 'cross-fetch';

export class DataDrivenBankingAnalyzer {
  constructor() {
    this.clientSegments = {
      'Premium': { minAssets: 1000000, minIncome: 15000 },
      'Priority': { minAssets: 500000, minIncome: 10000 },
      'Standard': { minAssets: 100000, minIncome: 5000 },
      'Basic': { minAssets: 0, minIncome: 0 }
    };
  }

  async generateInsights(clientData) {
    try {
      const dataPoints = this.extractDataPoints(clientData);
      const insights = this.generateBankingInsights(dataPoints, clientData);
      
      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getFallbackInsights(clientData);
    }
  }

  extractDataPoints(clientData) {
    const dashboard = clientData.dashboard || {};
    const financial = clientData.financial || {};
    const investments = clientData.investments || {};
    const transactions = clientData.transactions || [];

    // Calculate key financial metrics
    const totalAssets = dashboard.assets || financial.totalAssets || 0;
    const totalLiabilities = this.calculateTotalLiabilities(clientData);
    const netWorth = totalAssets - totalLiabilities;
    const monthlyIncome = dashboard.cashflow || financial.monthlyIncome || 0;
    const annualIncome = monthlyIncome * 12;
      
      // Account balances
    const accountBalances = dashboard.accountBalances || {};
    const casaBalance = accountBalances.casa || 0;
    const fdBalance = accountBalances.fd || 0;
    const loanBalance = accountBalances.loans || 0;
    const cardBalance = accountBalances.cards || 0;
      
      // Investment data
    const investmentValue = investments.totalValue || 0;
    const investmentDiversity = this.calculateInvestmentDiversity(investments.holdings || []);
    
    // Credit metrics
    const creditUtilization = this.calculateCreditUtilization(clientData);
    const debtToIncomeRatio = annualIncome > 0 ? (totalLiabilities / annualIncome) : 0;
    
    // Emergency fund analysis
    const emergencyFundRatio = this.calculateEmergencyFundRatio(casaBalance, monthlyIncome);
    
    // Age calculation from NRIC
    const age = this.calculateAgeFromNRIC(clientData.nric || '');
    
    // Cash flow stability
    const cashflowStability = this.calculateCashflowStability(monthlyIncome);

    return {
      // Basic metrics
      totalAssets,
      totalLiabilities,
      netWorth,
      monthlyIncome,
      annualIncome,
      age,
      
      // Account balances
      casaBalance,
      fdBalance,
      loanBalance,
      cardBalance,
      
      // Investment metrics
      investmentValue,
      investmentDiversity,
      
      // Credit metrics
      creditUtilization,
      debtToIncomeRatio,
      
      // Financial health
      emergencyFundRatio,
      cashflowStability,
      
      // Ratios
      cashRatio: totalAssets > 0 ? casaBalance / totalAssets : 0,
      investmentRatio: totalAssets > 0 ? investmentValue / totalAssets : 0,
      debtRatio: totalAssets > 0 ? totalLiabilities / totalAssets : 0
    };
  }

  generateBankingInsights(dataPoints, clientData) {
    const insights = [];

    // 1. Emergency Fund Analysis (High Priority)
    const emergencyFundInsight = this.analyzeEmergencyFund(dataPoints);
    if (emergencyFundInsight) insights.push(emergencyFundInsight);

    // 2. Investment Opportunity Analysis
    const investmentInsight = this.analyzeInvestmentOpportunity(dataPoints);
    if (investmentInsight) insights.push(investmentInsight);

    // 3. Credit Health Analysis
    const creditInsight = this.analyzeCreditHealth(dataPoints);
    if (creditInsight) insights.push(creditInsight);

    // 4. Insurance Needs Analysis
    const insuranceInsight = this.analyzeInsuranceNeeds(dataPoints);
    if (insuranceInsight) insights.push(insuranceInsight);

    // 5. Wealth Management Opportunity
    const wealthInsight = this.analyzeWealthManagement(dataPoints);
    if (wealthInsight) insights.push(wealthInsight);

    // 6. Debt Management Analysis
    const debtInsight = this.analyzeDebtManagement(dataPoints);
    if (debtInsight) insights.push(debtInsight);

    // 7. Travel & Lifestyle Analysis (New)
    const travelInsight = this.analyzeTravelPatterns(dataPoints, clientData);
    if (travelInsight) insights.push(travelInsight);

    // Sort by priority and estimated value
    insights.sort((a, b) => {
      const priorityOrder = { 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.estimatedValue - a.estimatedValue;
    });

    return insights.slice(0, 3); // Return top 3 insights
  }

  // Emergency Fund Analysis
  analyzeEmergencyFund(dataPoints) {
    const { emergencyFundRatio, monthlyIncome, casaBalance } = dataPoints;
    
    if (emergencyFundRatio < 50) {
      return {
        insight: `Critical: Emergency fund covers only ${Math.round(emergencyFundRatio)}% of 3-month expenses`,
        reasoning: `You have RM${casaBalance.toLocaleString()} in savings but need RM${(monthlyIncome * 3).toLocaleString()} for emergency fund. This is a high priority for financial security.`,
        priority: 'HIGH',
        type: 'emergency_fund_analysis',
        confidence: 0.95,
        estimatedValue: Math.max(10000, monthlyIncome * 3 - casaBalance),
        dataPoints: { emergencyFundRatio, monthlyIncome, casaBalance },
        recommendedProduct: {
          id: 'ambank_goal_savings',
          name: 'AmBank Goal Savings Account',
          type: 'Savings',
          description: 'Purpose-driven savings account with bonus interest for achieving savings goals',
          reasoning: `Perfect for building your emergency fund with goal-based savings and bonus interest rates.`,
          expectedReturn: '3.2%',
          risk: 'Low',
          minDeposit: 500
        }
      };
    }
    
    if (emergencyFundRatio < 100) {
      return {
        insight: `Emergency fund needs attention - ${Math.round(emergencyFundRatio)}% coverage`,
        reasoning: `Your emergency fund should cover 3 months of expenses (RM${(monthlyIncome * 3).toLocaleString()}). Currently you have RM${casaBalance.toLocaleString()}.`,
        priority: 'MEDIUM',
        type: 'emergency_fund_analysis',
        confidence: 0.85,
        estimatedValue: monthlyIncome * 3 - casaBalance,
        dataPoints: { emergencyFundRatio, monthlyIncome, casaBalance },
        recommendedProduct: {
          id: 'ambank_savings_account',
          name: 'AmBank Savings Account',
          type: 'Savings',
          description: 'Basic savings account with competitive interest rates and easy access to funds',
          reasoning: `Ideal for building your emergency fund with competitive rates and easy access when needed.`,
          expectedReturn: '2.5%',
          risk: 'Low',
          minDeposit: 100
        }
      };
    }

    return null;
  }

  // Investment Opportunity Analysis
  analyzeInvestmentOpportunity(dataPoints) {
    const { casaBalance, investmentRatio, totalAssets, monthlyIncome, age } = dataPoints;
    
    if (casaBalance > 50000 && investmentRatio < 0.3) {
      return {
        insight: `High cash reserves (RM${casaBalance.toLocaleString()}) with low investment allocation`,
        reasoning: `You have RM${casaBalance.toLocaleString()} in savings but only ${(investmentRatio * 100).toFixed(1)}% in investments. At age ${age}, consider diversifying for better returns.`,
        priority: 'HIGH',
        type: 'investment_opportunity',
        confidence: 0.9,
        estimatedValue: Math.min(casaBalance * 0.6, 100000),
        dataPoints: { casaBalance, investmentRatio, age },
        recommendedProduct: {
          id: 'ambank_unit_trust',
          name: 'AmBank Unit Trust Funds',
          type: 'Investment',
          description: 'Professional managed unit trust funds with various risk profiles and investment objectives',
          reasoning: `Perfect for diversifying your high cash reserves with professional fund management and various risk profiles.`,
          expectedReturn: '6-15%',
          risk: 'Medium-High',
          minInvestment: 1000
        }
      };
    }
    
    if (monthlyIncome > 8000 && investmentRatio < 0.2) {
      return {
        insight: `Strong income with limited investment exposure`,
        reasoning: `Monthly income of RM${monthlyIncome.toLocaleString()} but only ${(investmentRatio * 100).toFixed(1)}% in investments. Consider systematic investment plans for wealth building.`,
        priority: 'MEDIUM',
        type: 'investment_opportunity',
        confidence: 0.8,
        estimatedValue: monthlyIncome * 12,
        dataPoints: { monthlyIncome, investmentRatio },
        recommendedProduct: {
          id: 'ambank_structured_deposits',
          name: 'AmBank Structured Deposits',
          type: 'Investment',
          description: 'Investment-linked deposits with potential for higher returns based on market performance',
          reasoning: `Ideal for high-income earners seeking better returns than traditional savings with capital protection options.`,
          expectedReturn: '4-8%',
          risk: 'Medium',
          minInvestment: 5000
        }
      };
    }

    return null;
  }

  // Credit Health Analysis
  analyzeCreditHealth(dataPoints) {
    const { creditUtilization, debtToIncomeRatio, cardBalance, monthlyIncome } = dataPoints;
    
    if (creditUtilization > 0.8) {
      return {
        insight: `High credit utilization (${(creditUtilization * 100).toFixed(1)}%) - debt consolidation opportunity`,
        reasoning: `Credit utilization of ${(creditUtilization * 100).toFixed(1)}% is very high. Consider debt consolidation to reduce interest costs and improve credit score.`,
        priority: 'HIGH',
        type: 'credit_analysis',
        confidence: 0.9,
        estimatedValue: cardBalance,
        dataPoints: { creditUtilization, cardBalance },
        recommendedProduct: {
          id: 'ambank_personal_loan',
          name: 'AmBank Personal Loan',
          type: 'Credit',
          description: 'Flexible personal financing for various needs with competitive interest rates',
          reasoning: `Perfect for debt consolidation to reduce your high credit utilization and lower overall interest costs.`,
          interestRate: '7.5-12%',
          maxAmount: 'RM100,000',
          minIncome: 2000
        }
      };
    }
    
    if (debtToIncomeRatio > 0.5) {
      return {
        insight: `High debt-to-income ratio (${(debtToIncomeRatio * 100).toFixed(1)}%) - debt management needed`,
        reasoning: `Debt-to-income ratio of ${(debtToIncomeRatio * 100).toFixed(1)}% exceeds recommended 50% limit. Consider debt restructuring or consolidation.`,
        priority: 'HIGH',
        type: 'credit_analysis',
        confidence: 0.85,
        estimatedValue: monthlyIncome * 6,
        dataPoints: { debtToIncomeRatio, monthlyIncome },
        recommendedProduct: {
          id: 'ambank_credit_card',
          name: 'AmBank Credit Cards',
          type: 'Credit',
          description: 'Range of credit cards with rewards, cashback, and travel benefits',
          reasoning: `Consider a balance transfer card to consolidate high-interest debt and reduce your debt-to-income ratio.`,
          annualFee: 'RM0-500',
          creditLimit: 'RM5,000-50,000',
          minIncome: 24000
        }
      };
    }
    
    if (creditUtilization < 0.3 && monthlyIncome > 5000) {
      return {
        insight: `Excellent credit profile - premium card opportunity`,
        reasoning: `Low credit utilization (${(creditUtilization * 100).toFixed(1)}%) with good income (RM${monthlyIncome.toLocaleString()}/month). Qualify for premium credit cards with better rewards.`,
        priority: 'MEDIUM',
        type: 'credit_analysis',
        confidence: 0.8,
        estimatedValue: 5000,
        dataPoints: { creditUtilization, monthlyIncome },
        recommendedProduct: {
          id: 'ambank_premium_travel_card',
          name: 'AmBank Premium Travel Card',
          type: 'Credit',
          description: 'Premium travel credit card with exclusive travel benefits and concierge services',
          reasoning: `Your excellent credit profile qualifies you for premium travel benefits and exclusive concierge services.`,
          annualFee: 'RM500',
          creditLimit: 'RM20,000-100,000',
          minIncome: 60000
        }
      };
    }

    return null;
  }

  // Insurance Needs Analysis
  analyzeInsuranceNeeds(dataPoints) {
    const { monthlyIncome, age, totalAssets, investmentValue } = dataPoints;
    const annualIncome = monthlyIncome * 12;
    
    // Basic insurance need: 10x annual income
    const recommendedCoverage = annualIncome * 10;
    const currentCoverage = totalAssets + investmentValue; // Simplified assumption
    
    if (currentCoverage < recommendedCoverage * 0.5) {
      return {
        insight: `Insufficient insurance coverage - ${Math.round((currentCoverage / recommendedCoverage) * 100)}% of recommended`,
        reasoning: `At age ${age}, recommended life insurance coverage is RM${recommendedCoverage.toLocaleString()} (10x annual income). Current coverage is RM${currentCoverage.toLocaleString()}.`,
        priority: 'HIGH',
        type: 'insurance_needs',
        confidence: 0.9,
        estimatedValue: recommendedCoverage - currentCoverage,
        dataPoints: { age, annualIncome, currentCoverage, recommendedCoverage },
        recommendedProduct: {
          id: 'ambank_life_insurance',
          name: 'AmBank Life Insurance',
          type: 'Insurance',
          description: 'Comprehensive life insurance coverage with flexible premium options and riders',
          reasoning: `Essential for protecting your family with coverage that matches your recommended RM${recommendedCoverage.toLocaleString()} protection.`,
          monthlyPremium: 'RM50-200',
          coverage: 'RM50,000-1,000,000',
          ageRange: '18-65'
        }
      };
    }
    
    if (age > 40 && currentCoverage < recommendedCoverage * 0.8) {
      return {
        insight: `Insurance coverage review needed for age ${age}`,
        reasoning: `At age ${age}, insurance becomes more critical. Current coverage RM${currentCoverage.toLocaleString()} vs recommended RM${recommendedCoverage.toLocaleString()}.`,
        priority: 'MEDIUM',
        type: 'insurance_needs',
        confidence: 0.8,
        estimatedValue: recommendedCoverage - currentCoverage,
        dataPoints: { age, currentCoverage, recommendedCoverage },
        recommendedProduct: {
          id: 'ambank_critical_illness',
          name: 'AmBank Critical Illness Protection',
          type: 'Insurance',
          description: 'Financial protection against critical illnesses with comprehensive coverage',
          reasoning: `Critical illness protection becomes more important at age ${age} to protect against medical expenses and income loss.`,
          monthlyPremium: 'RM80-300',
          coverage: 'RM100,000-500,000',
          ageRange: '18-60'
        }
      };
    }

    return null;
  }

  // Wealth Management Opportunity
  analyzeWealthManagement(dataPoints) {
    const { totalAssets, netWorth, monthlyIncome, age } = dataPoints;
    
    if (totalAssets > 500000 && age > 35) {
      return {
        insight: `High net worth (RM${netWorth.toLocaleString()}) - wealth management services`,
        reasoning: `With RM${netWorth.toLocaleString()} net worth at age ${age}, consider professional wealth management for tax optimization and estate planning.`,
        priority: 'MEDIUM',
        type: 'wealth_management',
        confidence: 0.85,
        estimatedValue: totalAssets * 0.1,
        dataPoints: { netWorth, age, totalAssets },
        recommendedProduct: {
          id: 'ambank_structured_deposits',
          name: 'AmBank Structured Deposits',
          type: 'Investment',
          description: 'Investment-linked deposits with potential for higher returns based on market performance',
          reasoning: `Perfect for high net worth individuals seeking capital protection with market-linked returns for wealth preservation.`,
          expectedReturn: '4-8%',
          risk: 'Medium',
          minInvestment: 5000
        }
      };
    }
    
    if (monthlyIncome > 15000 && totalAssets > 200000) {
      return {
        insight: `High-income professional - premium banking services`,
        reasoning: `Monthly income RM${monthlyIncome.toLocaleString()} with RM${totalAssets.toLocaleString()} assets. Qualify for premium banking services and exclusive products.`,
        priority: 'MEDIUM',
        type: 'wealth_management',
        confidence: 0.8,
        estimatedValue: 50000,
        dataPoints: { monthlyIncome, totalAssets },
        recommendedProduct: {
          id: 'ambank_premium_travel_card',
          name: 'AmBank Premium Travel Card',
          type: 'Credit',
          description: 'Premium travel credit card with exclusive travel benefits and concierge services',
          reasoning: `Your high income and assets qualify you for premium travel benefits and exclusive concierge services.`,
          annualFee: 'RM500',
          creditLimit: 'RM20,000-100,000',
          minIncome: 60000
        }
      };
    }

    return null;
  }

  // Debt Management Analysis
  analyzeDebtManagement(dataPoints) {
    const { totalLiabilities, monthlyIncome, debtToIncomeRatio, loanBalance } = dataPoints;
    
    if (loanBalance > 0 && debtToIncomeRatio > 0.4) {
      return {
        insight: `High debt burden - refinancing opportunity`,
        reasoning: `Debt-to-income ratio ${(debtToIncomeRatio * 100).toFixed(1)}% with RM${loanBalance.toLocaleString()} in loans. Consider refinancing to lower rates and reduce monthly payments.`,
        priority: 'MEDIUM',
        type: 'debt_management',
        confidence: 0.8,
        estimatedValue: loanBalance,
        dataPoints: { debtToIncomeRatio, loanBalance },
        recommendedProduct: {
          id: 'ambank_personal_loan',
          name: 'AmBank Personal Loan',
          type: 'Credit',
          description: 'Flexible personal financing for various needs with competitive interest rates',
          reasoning: `Refinance your high-interest debt with competitive rates to reduce your debt-to-income ratio.`,
          interestRate: '7.5-12%',
          maxAmount: 'RM100,000',
          minIncome: 2000
        }
      };
    }
    
    if (totalLiabilities > monthlyIncome * 12) {
      return {
        insight: `Liabilities exceed annual income - debt consolidation needed`,
        reasoning: `Total liabilities RM${totalLiabilities.toLocaleString()} vs annual income RM${(monthlyIncome * 12).toLocaleString()}. Consider debt consolidation to simplify payments.`,
        priority: 'HIGH',
        type: 'debt_management',
        confidence: 0.9,
        estimatedValue: totalLiabilities,
        dataPoints: { totalLiabilities, monthlyIncome },
        recommendedProduct: {
          id: 'ambank_credit_card',
          name: 'AmBank Credit Cards',
          type: 'Credit',
          description: 'Range of credit cards with rewards, cashback, and travel benefits',
          reasoning: `Use a balance transfer card to consolidate multiple debts into one lower-interest payment.`,
          annualFee: 'RM0-500',
          creditLimit: 'RM5,000-50,000',
          minIncome: 24000
        }
      };
    }

    return null;
  }

  // Travel & Lifestyle Analysis
  analyzeTravelPatterns(dataPoints, clientData) {
    const transactions = clientData.transactions || [];
    
    // Analyze travel-related spending patterns
    const travelSpending = this.analyzeTravelSpending(transactions);
    
    if (travelSpending.totalAmount > 0) {
      const travelCategories = Object.keys(travelSpending.categories).filter(cat => travelSpending.categories[cat] > 0);
      
      return {
        insight: `RM${travelSpending.totalAmount.toLocaleString()} spent on travel-related expenses`,
        reasoning: `Travel spending detected across ${travelCategories.length} categories: ${travelCategories.join(', ')}. Consider travel-specific banking products for better rates and convenience.`,
        priority: 'MEDIUM',
        type: 'travel_analysis',
        confidence: 0.85,
        estimatedValue: travelSpending.totalAmount * 0.1, // 10% of travel spending as opportunity
        dataPoints: { 
          travelSpending: travelSpending.totalAmount,
          travelCategories: travelCategories,
          currencyExchange: travelSpending.categories.currency_exchange || 0,
          travelAgencies: travelSpending.categories.travel_agencies || 0,
          airlines: travelSpending.categories.airlines || 0,
          hotels: travelSpending.categories.hotels || 0
        },
        productCategories: this.getProductCategoriesForTravel(travelSpending),
        recommendedProduct: {
          id: 'ambank_travel_card',
          name: 'AmBank Travel Credit Card',
          type: 'Credit',
          description: 'Specialized credit card for travel expenses with travel rewards and benefits',
          reasoning: `Perfect for your RM${travelSpending.totalAmount.toLocaleString()} travel spending with no foreign transaction fees and travel rewards.`,
          annualFee: 'RM200',
          creditLimit: 'RM10,000-50,000',
          minIncome: 36000
        }
      };
    }
    
    return null;
  }

  // Analyze travel spending from transactions
  analyzeTravelSpending(transactions) {
    const travelCategories = {
      currency_exchange: 0,
      travel_agencies: 0,
      airlines: 0,
      hotels: 0,
      car_rental: 0,
      travel_insurance: 0,
      dining_abroad: 0,
      shopping_abroad: 0
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
      // Car rental
      else if (description.includes('car rental') || description.includes('rental car') || 
               category.includes('car_rental')) {
        travelCategories.car_rental += amount;
        totalAmount += amount;
      }
      // Travel insurance
      else if (description.includes('travel insurance') || description.includes('takaful') || 
               category.includes('insurance')) {
        travelCategories.travel_insurance += amount;
        totalAmount += amount;
      }
      // International dining (high amounts in foreign currencies)
      else if (amount > 500 && (description.includes('restaurant') || description.includes('cafe')) && 
               (transaction.currency !== 'MYR' || description.includes('foreign'))) {
        travelCategories.dining_abroad += amount;
        totalAmount += amount;
      }
      // International shopping (high amounts in foreign currencies)
      else if (amount > 1000 && (transaction.currency !== 'MYR' || description.includes('foreign'))) {
        travelCategories.shopping_abroad += amount;
        totalAmount += amount;
      }
    });

      return {
      totalAmount,
      categories: travelCategories
    };
  }

  // Get product categories for travel insights
  getProductCategoriesForTravel(travelSpending) {
    const categories = [];
    
    if (travelSpending.categories.currency_exchange > 0) {
      categories.push('travel_cards', 'multi_currency_accounts');
    }
    
    if (travelSpending.categories.airlines > 0 || travelSpending.categories.hotels > 0) {
      categories.push('travel_cards', 'travel_insurance', 'air_miles_cards');
    }
    
    if (travelSpending.categories.travel_agencies > 0) {
      categories.push('travel_cards', 'booking_rewards');
    }
    
    if (travelSpending.totalAmount > 5000) {
      categories.push('premium_travel_cards', 'travel_insurance');
    }
    
    return categories;
  }

  // Helper methods
  calculateAgeFromNRIC(nric) {
    if (!nric || nric.length < 6) return 30;
    
    try {
      const year = parseInt(nric.substring(0, 2));
      const month = parseInt(nric.substring(2, 4));
      const day = parseInt(nric.substring(4, 6));
      
      // Assume 2000s for now
      const birthYear = 2000 + year;
      const birthDate = new Date(birthYear, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      return Math.max(18, Math.min(80, age));
    } catch (error) {
      return 30;
    }
  }

  calculateTotalLiabilities(clientData) {
    const dashboard = clientData.dashboard || {};
    const accountBalances = dashboard.accountBalances || {};
    
    return (accountBalances.loans || 0) + (accountBalances.cards || 0);
  }

  calculateCreditUtilization(clientData) {
    const dashboard = clientData.dashboard || {};
    const accountBalances = dashboard.accountBalances || {};
    
    const cardBalance = accountBalances.cards || 0;
    const cardLimit = 50000; // Assume default limit
    
    return cardLimit > 0 ? cardBalance / cardLimit : 0;
  }

  calculateInvestmentDiversity(holdings) {
    if (!holdings || holdings.length === 0) return 0;
    return Math.min(holdings.length / 3, 1); // Normalize to 0-1
  }

  calculateEmergencyFundRatio(casaBalance, monthlyIncome) {
    if (monthlyIncome === 0) return 0;
    const requiredEmergencyFund = monthlyIncome * 3;
    return requiredEmergencyFund > 0 ? (casaBalance / requiredEmergencyFund) * 100 : 0;
  }

  calculateCashflowStability(monthlyIncome) {
    // Simplified stability calculation
    return monthlyIncome > 5000 ? 0.8 : monthlyIncome > 3000 ? 0.6 : 0.4;
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Fallback insights based on data
  getFallbackInsights(clientData) {
    const dataPoints = this.extractDataPoints(clientData);
    const insights = [];

    // Only generate meaningful insights based on actual financial analysis
    if (dataPoints.emergencyFundRatio < 100) {
      insights.push({
        insight: `Emergency fund needs attention - ${Math.round(dataPoints.emergencyFundRatio)}% coverage`,
        reasoning: `Your emergency fund should cover 3 months of expenses (RM${(dataPoints.monthlyIncome * 3).toLocaleString()}). Currently you have RM${dataPoints.casaBalance.toLocaleString()}.`,
        priority: 'HIGH',
        type: 'emergency_fund_analysis',
        confidence: 0.8,
        estimatedValue: dataPoints.monthlyIncome * 3 - dataPoints.casaBalance,
        dataPoints: { emergencyFundRatio: dataPoints.emergencyFundRatio, monthlyIncome: dataPoints.monthlyIncome, casaBalance: dataPoints.casaBalance },
        recommendedProduct: {
          id: 'ambank_savings_account',
          name: 'AmBank Savings Account',
          type: 'Savings',
          description: 'Basic savings account with competitive interest rates and easy access to funds',
          reasoning: `Ideal for building your emergency fund with competitive rates and easy access when needed.`,
          expectedReturn: '2.5%',
          risk: 'Low',
          minDeposit: 100
        }
      });
    }

    if (dataPoints.casaBalance > 50000 && dataPoints.investmentRatio < 0.3) {
      insights.push({
        insight: `High cash reserves (RM${dataPoints.casaBalance.toLocaleString()}) with low investment allocation`,
        reasoning: `You have RM${dataPoints.casaBalance.toLocaleString()} in savings but only ${(dataPoints.investmentRatio * 100).toFixed(1)}% in investments. Consider diversifying for better returns.`,
        priority: 'MEDIUM',
        type: 'investment_opportunity',
        confidence: 0.7,
        estimatedValue: Math.min(dataPoints.casaBalance * 0.6, 100000),
        dataPoints: { casaBalance: dataPoints.casaBalance, investmentRatio: dataPoints.investmentRatio },
        recommendedProduct: {
          id: 'ambank_unit_trust',
          name: 'AmBank Unit Trust Funds',
          type: 'Investment',
          description: 'Professional managed unit trust funds with various risk profiles and investment objectives',
          reasoning: `Perfect for diversifying your high cash reserves with professional fund management and various risk profiles.`,
          expectedReturn: '6-15%',
          risk: 'Medium-High',
          minInvestment: 1000
        }
      });
    }

    if (dataPoints.creditUtilization > 0.8) {
      insights.push({
        insight: `High credit utilization (${(dataPoints.creditUtilization * 100).toFixed(1)}%) - debt consolidation opportunity`,
        reasoning: `Credit utilization of ${(dataPoints.creditUtilization * 100).toFixed(1)}% is very high. Consider debt consolidation to reduce interest costs.`,
        priority: 'HIGH',
        type: 'credit_analysis',
        confidence: 0.8,
        estimatedValue: dataPoints.cardBalance,
        dataPoints: { creditUtilization: dataPoints.creditUtilization, cardBalance: dataPoints.cardBalance },
        recommendedProduct: {
          id: 'ambank_personal_loan',
          name: 'AmBank Personal Loan',
          type: 'Credit',
          description: 'Flexible personal financing for various needs with competitive interest rates',
          reasoning: `Perfect for debt consolidation to reduce your high credit utilization and lower overall interest costs.`,
          interestRate: '7.5-12%',
          maxAmount: 'RM100,000',
          minIncome: 2000
        }
      });
    }

    // If no meaningful insights found, provide a basic financial overview
    if (insights.length === 0) {
      insights.push({
        insight: `Financial profile analyzed - RM${dataPoints.netWorth.toLocaleString()} net worth`,
        reasoning: `Based on your financial data, we've identified opportunities for wealth optimization and risk management.`,
        priority: 'LOW',
        type: 'wealth_analysis',
        confidence: 0.5,
        estimatedValue: dataPoints.netWorth * 0.05,
        dataPoints: { netWorth: dataPoints.netWorth },
        recommendedProduct: {
          id: 'ambank_structured_deposits',
          name: 'AmBank Structured Deposits',
          type: 'Investment',
          description: 'Investment-linked deposits with potential for higher returns based on market performance',
          reasoning: `Perfect for high net worth individuals seeking capital protection with market-linked returns for wealth preservation.`,
          expectedReturn: '4-8%',
          risk: 'Medium',
          minInvestment: 5000
        }
      });
    }

    return insights;
  }
}

// Global analyzer instance
let dataDrivenAnalyzer = null;

// Main function to analyze client and return insights
export async function analyzeClient(clientData) {
  try {
    if (!dataDrivenAnalyzer) {
      dataDrivenAnalyzer = new DataDrivenBankingAnalyzer();
    }
    
    const insights = await dataDrivenAnalyzer.generateInsights(clientData);
    
    return {
      insights: insights,
      summary: {
        totalOpportunities: insights.length,
        estimatedValue: insights.reduce((sum, insight) => sum + (insight.estimatedValue || 0), 0),
        topPriority: insights.find(i => i.priority === 'HIGH')?.type || 'none'
      }
    };
  } catch (error) {
    console.error('Error in analyzeClient:', error);
    return {
      insights: [],
      summary: {
        totalOpportunities: 0,
        estimatedValue: 0,
        topPriority: 'none'
      }
    };
  }
} 

// New function to get AI insights from Ollama
export async function analyzeClientWithOllama(clientProfile, transactions) {
  const prompt = `You are a banking AI assistant. Here is a client's profile and their recent transaction history:\n\nClient Profile:\n${JSON.stringify(clientProfile, null, 2)}\n\nRecent Transactions:\n${transactions.map(t => `Date: ${t.transaction_date}, Amount: ${t.amount}, Type: ${t.type}, Category: ${t.category}, Description: ${t.description}, Channel: ${t.channel}`).join('\n')}\n\nBased on this data, generate 3-5 actionable insights that would be useful for the bank to know about this client. Focus on opportunities, risks, and engagement. Use clear, professional language.`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral', // or 'llama2', 'gemma', etc. if you have them
      prompt,
      stream: false
    })
  });
  const data = await response.json();
  // Ollama returns { response: '...' }
  return {
    insights: data.response.split(/\n\d?\. /).filter(Boolean).map(text => ({ text })),
    summary: { totalOpportunities: undefined, estimatedValue: undefined, topPriority: undefined }
  };
} 

// New function to get AI insights from Hugging Face Inference API
export async function analyzeClientWithHuggingFace(clientProfile, transactions) {
  // TODO: Replace with your Hugging Face API token
  const HF_API_TOKEN = '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';
  const prompt = `You are a banking AI assistant. Here is a client's profile and their recent transaction history:\n\nClient Profile:\n${JSON.stringify(clientProfile, null, 2)}\n\nRecent Transactions:\n${transactions.map(t => `Date: ${t.transaction_date}, Amount: ${t.amount}, Type: ${t.type}, Category: ${t.category}, Description: ${t.description}, Channel: ${t.channel}`).join('\n')}\n\nBased on this data, generate 3-5 actionable insights that would be useful for the bank to know about this client. Focus on opportunities, risks, and engagement. Use clear, professional language.`;

  // Use local API server instead of Hugging Face
  const response = await fetch('http://localhost:3000/ai-insight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model: 'llama2:latest' })
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Local AI API error: ${errText}`);
  }
  const data = await response.json();
  // The response is { result: '...' }
  const text = data.result || '';
  return {
    insights: text.split(/\n\d?\. /).filter(Boolean).map(text => ({ text })),
    summary: {}
  };
} 

// New function to get AI insights from OpenAI API using v4 SDK
export async function analyzeClientWithOpenAI(clientProfile, transactions) {
  const OPENAI_API_KEY = 'sk-REPLACE_ME'; // <-- put your key here
  const prompt = `You are a banking AI assistant. Here is a client's profile and their recent transaction history:\n\nClient Profile:\n${JSON.stringify(clientProfile, null, 2)}\n\nRecent Transactions:\n${transactions.map(t => `Date: ${t.transaction_date}, Amount: ${t.amount}, Type: ${t.type}, Category: ${t.category}, Description: ${t.description}, Channel: ${t.channel}`).join('\n')}\n\nBased on this data, generate 3-5 actionable insights that would be useful for the bank to know about this client. Focus on opportunities, risks, and engagement. Use clear, professional language.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful banking AI assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 512,
      temperature: 0.7
    })
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error: ${errText}`);
  }
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || '';
  return {
    insights: text.split(/\n\d?\. /).filter(Boolean).map(text => ({ text })),
    summary: {}
  };
} 

// New function to get AI insights from Google Gemini API
// Helper function to clean JSON formatting from text
function cleanText(text) {
  if (typeof text !== 'string') return text;
  
  // Remove JSON formatting characters
  return text
    .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
    .replace(/^\[|\]$/g, '') // Remove leading/trailing brackets
    .replace(/^,|,$/g, '') // Remove leading/trailing commas
    .replace(/^"|"$/g, '') // Remove any remaining quotes
    .trim();
}

// Helper function to clean an array of strings
function cleanArray(arr) {
  if (!Array.isArray(arr)) return [];
  
  return arr
    .map(item => {
      // Handle new insight format with reasoning and product
      if (item && typeof item === 'object' && item.insight && item.reasoning) {
        return {
          insight: cleanText(item.insight),
          reasoning: cleanText(item.reasoning),
          product: item.product ? cleanText(item.product) : undefined,
          productReasoning: item.productReasoning ? cleanText(item.productReasoning) : undefined
        };
      }
      // Handle legacy string format
      return cleanText(item);
    })
    .filter(item => {
      if (typeof item === 'string') {
        return item && item.length > 0;
      } else if (item && typeof item === 'object') {
        return item.insight && item.insight.length > 0;
      }
      return false;
    });
}

// Helper function to process text response when JSON parsing fails
function processTextResponse(responseText) {
  const lines = responseText.split('\n').filter(line => line.trim());
  
  // Try to find sections by looking for keywords
  const summary = [];
  const insights = [];
  const recommendations = [];
  
  let currentSection = null;
  
  for (const line of lines) {
    const cleanLine = line.trim();
    
    if (cleanLine.toLowerCase().includes('summary') || cleanLine.toLowerCase().includes('key point')) {
      currentSection = 'summary';
      continue;
    } else if (cleanLine.toLowerCase().includes('insight')) {
      currentSection = 'insights';
      continue;
    } else if (cleanLine.toLowerCase().includes('recommendation')) {
      currentSection = 'recommendations';
      continue;
    }
    
    // Skip JSON formatting lines
    if (cleanLine.match(/^[\[\]{}",\s]*$/)) continue;
    
    // Add content to appropriate section
    const cleanedContent = cleanText(cleanLine);
    if (cleanedContent && cleanedContent.length > 0) {
      switch (currentSection) {
        case 'summary':
          summary.push(cleanedContent);
          break;
        case 'insights':
          insights.push(cleanedContent);
          break;
        case 'recommendations':
          recommendations.push(cleanedContent);
          break;
      }
    }
  }
  
  return {
    summary: summary.slice(0, 3),
    insights: insights.slice(0, 3),
    recommendations: recommendations.slice(0, 3)
  };
}

export async function analyzeClientWithGemini(clientProfile, transactions, followUp = '') {
  // Get API key from environment variable or use default
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCfC6H25UzpTR5cweS1iNHQ6tCSy2v3lLs';
  
  // Validate API key
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API key not configured. Please set the GEMINI_API_KEY environment variable or update the default key in the code.');
  }
  
  // Use the latest supported Gemini model
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    console.log('Analyzing client with Gemini:', {
      clientName: clientProfile.name,
      transactionCount: transactions ? transactions.length : 0,
      hasTransactions: !!transactions && transactions.length > 0
    });

    // Create the prompt for Gemini
    const basePrompt = `You are a financial product recommendation engine for a Malaysian bank. Your role is to analyze client transaction data and provide specific, actionable product recommendations based on actual spending patterns.

TRANSACTION ANALYSIS:
${(transactions && Array.isArray(transactions) && transactions.length > 0)
  ? transactions.map(t => `- ${t.transaction_date}: RM${Math.abs(t.amount)} on ${t.description} (${t.category}) via ${t.channel}`).join('\n')
  : '- No transaction data available'}

CLIENT PROFILE:
- NRIC: ${clientProfile.nric || 'Not provided'}
- Name: ${clientProfile.name || 'Not provided'}
- Status: ${clientProfile.status || 'Not provided'}
- Risk Profile: ${clientProfile.risk_profile || 'Not provided'}
- Credit Score: ${clientProfile.credit_score || 'Not provided'}

AVAILABLE PRODUCTS IN OUR DATABASE:
You MUST recommend products that exist in our database. Here are the key product categories available:

1. **Personal Banking (Savings & Current Accounts)**:
   - AmVault Savings Account / Account‑i (High-yield savings, 3.0-4.2% returns)
   - TRUE Savers Account / Account‑i (Bonus interest for regular deposits, 2.8-3.8% returns)
   - Basic Savings Account / Account‑i (Traditional savings, 2.0-2.5% returns)
   - AmWafeeq Account‑i (Islamic profit sharing, 2.5-3.5% returns)
   - eFlex Savings Account‑i (Flexible savings, 2.8-3.2% returns)
   - AmGenius (Smart savings with rewards, 3.2-4.0% returns)
   - Current Account / Account‑i (Daily transactions, 0.5-1.0% returns)
   - Hybrid Current Account‑i (Combined current/savings features, 1.5-2.5% returns)
   - Foreign Currency Accounts / Account‑i (Multi-currency, 1.0-3.5% returns)

2. **Term Deposits & Investments**:
   - Term Deposit / Term Deposit‑i (Fixed-term deposits, 3.5-5.0% returns)
   - AmQuantum Term Deposit‑i (Quantum-based deposits, 4.0-5.5% returns)
   - Afhdal Term Deposit‑i (Premium term deposits, 4.5-6.0% returns)
   - AmTDPlus‑i (Enhanced term deposits, 4.2-5.8% returns)

3. **Credit Cards**:
   - AmBank Enrich Visa Infinite & Platinum (Premium travel rewards)
   - Visa Infinite, Visa Signature, Cash Rebate Visa Platinum (Range of Visa cards)
   - BonusLink Visa Series (Gold, Platinum, Gold CARz, M-Series, True Visa)
   - Mastercard Platinum, Gold CARz, World Mastercard (International acceptance)
   - UnionPay Platinum (China and Asia-Pacific benefits)
   - AmBank SIGNATURE Priority Banking Visa Infinite (Metal card for priority customers)
   - AmBank Visa Debit Card (Cashless transactions and ATM withdrawals)
   - NexG PrePaid Card (Controlled spending and online transactions)

4. **Loans & Financing**:
   - Personal Financing / Financing‑i (Personal loans, 7.5-12.0% rates)
   - Term Financing‑i (ASB/ASB2) (Islamic ASB financing, 4.5-6.5% rates)
   - AmMoneyLine / AmMoneyLine‑i (Overdraft facility, 8.0-15.0% rates)
   - Auto Financing (Vehicle financing, 3.2-4.8% rates)
   - Home Loan Facility (Home financing, 3.5-4.5% rates)
   - Home Link (Home equity financing, 4.0-5.5% rates)
   - PR1MA / SPEF (First-time buyer financing, 3.8-4.8% rates)
   - Property Link (Property investment financing, 4.2-5.2% rates)
   - Commercial Property Financing (Commercial property financing, 4.8-6.0% rates)
   - Skim Jaminan Kredit Perumahan (Housing credit guarantee, 3.8-4.8% rates)

5. **Wealth Management & Investments**:
   - Unit Trusts via AmInvest (Professional managed funds, 6-15% returns)
   - Direct Bond / Sukuk (Direct bond investment, 4-8% returns)
   - Dual Currency Investments (Currency-linked investments, 5-12% returns)
   - Equities (Direct equity investment, 8-20% returns)
   - Smart Partnership Programme (SPP) (Partnership investment, 7-12% returns)
   - Wealth Advisory Services (Professional wealth management)
   - AmPrivate Banking (Exclusive private banking services)
   - Priority Banking tiers (Tiered priority banking services)
   - Will / Wasiat writing (Estate planning services)
   - Legacy & estate planning (Comprehensive estate planning)

6. **Insurance & Takaful**:
   - General Insurance (Vehicle, travel, personal accident, home, business coverage)
   - Life Insurance (Savings, protection, legacy, credit-linked coverage)
   - Family Takaful (Islamic life/family coverage)

7. **Corporate & Treasury**:
   - SME & Corporate Banking (Business banking services)
   - Cash management (Advanced cash management solutions)
   - Trade finance (International trade finance solutions)
   - Payroll solutions (HR and payroll management)
   - Business current accounts (Business transaction accounts)
   - Structured Products (Sophisticated investment products)

MANDATORY PRODUCT RECOMMENDATION RULES:
EVERY insight MUST have a corresponding product recommendation from our database. Use these specific product mappings:

1. **Salary & Income Patterns**:
   - Salary credit > RM5000: "AmBank Enrich Visa Infinite & Platinum" with priority banking benefits
   - Salary credit > RM8000: "AmPrivate Banking" with wealth management services
   - Regular income: "TRUE Savers Account" with automated savings features

2. **Spending Behavior**:
   - Groceries > RM500/month: "BonusLink Visa Series" - rewards on grocery spending
   - Dining > RM300/month: "Visa Infinite, Visa Signature, Cash Rebate Visa Platinum" - dining rewards
   - Online shopping > RM200/month: "UnionPay Platinum" - online shopping benefits
   - Transport > RM200/month: "Mastercard Platinum, Gold CARz, World Mastercard" - transport rewards

3. **Travel & International**:
   - FX transactions: "Foreign Currency Accounts" with competitive exchange rates
   - Travel spending > RM1000: "AmBank Enrich Visa Infinite & Platinum" - travel rewards
   - International transactions: "World Mastercard" with travel insurance

4. **Credit & Lending**:
   - Credit score > 750: "AmBank SIGNATURE Priority Banking Visa Infinite" with premium benefits
   - Low credit utilization: "Personal Financing" - competitive rates from 7.5%
   - New credit needs: "Personal Financing / Financing‑i" - flexible terms

5. **Digital Engagement**:
   - Online transactions > 50%: "eFlex Savings Account‑i" with digital features
   - ATM usage > RM500/month: "AmBank Visa Debit Card" with contactless payments
   - Digital adoption: "AmGenius" with smart banking features

6. **Investment & Savings**:
   - No investments: "Unit Trusts via AmInvest" - diversified portfolio options
   - Low savings: "AmVault Savings Account" - high-yield savings with 3.0-4.2% returns
   - Conservative profile: "Term Deposit / Term Deposit‑i" - guaranteed returns up to 5.0%
   - Balanced profile: "AmQuantum Term Deposit‑i" - moderate risk, 4.0-5.5% returns
   - Aggressive profile: "Equities" - higher returns, 8-20% potential

7. **Insurance & Protection**:
   - No insurance: "Life Insurance" - comprehensive life coverage
   - Travel patterns: "General Insurance" - travel insurance coverage
   - Health concerns: "Family Takaful" - Islamic health coverage

8. **Business & Professional**:
   - Business transactions: "SME & Corporate Banking" with business accounts
   - Professional services: "Priority Banking tiers" with specialized support

CRITICAL REQUIREMENTS:
- EVERY insight MUST have a corresponding product recommendation from our database
- Use ONLY exact amounts from the transaction data provided
- Do NOT approximate, round, or make up any numbers
- Each insight must be under 15 words
- Each product recommendation must be specific and actionable
- Include exact amounts and merchant names when available
- Focus on significant patterns that indicate product opportunities
- If no transaction data exists, recommend basic products based on client profile
- ONLY recommend products that exist in our database (listed above)

EXAMPLE INSIGHTS WITH PRODUCTS:
- Insight: "RM830 spent on Grab in June" → Product: "Mastercard Platinum, Gold CARz, World Mastercard - transport rewards"
- Insight: "RM156.80 grocery spending at Tesco" → Product: "BonusLink Visa Series - grocery rewards"
- Insight: "RM450 online shopping at Shopee" → Product: "UnionPay Platinum - online shopping benefits"
- Insight: "RM3500 salary credited monthly" → Product: "TRUE Savers Account - automated savings features"

JSON FORMAT:
{
  "summary": "Brief client overview based on available data",
  "insights": [
    {
      "insight": "Specific factual observation with exact amounts",
      "reasoning": "Data points that support this insight",
      "product": "Specific product name from our database with benefits",
      "productReasoning": "Why this specific product is recommended"
    }
  ]
}

REQUIREMENTS:
- Only use data that is explicitly provided
- If no transaction data exists, recommend basic products based on client profile
- Focus on transaction patterns, exact amounts, and specific merchants
- Make insights purely factual observations
- Make product recommendations actionable and specific
- Provide ONLY the 3 BEST insights with corresponding products
- Prioritize insights that indicate clear product opportunities
- Every insight must have a product recommendation from our database - NO EXCEPTIONS
- ONLY recommend products that exist in our database (listed above)`;

    const fullPrompt = followUp ? `${basePrompt}\n\nFOLLOW-UP QUESTION: ${followUp}\n\nPlease address this specific question in your analysis.` : basePrompt;

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse as JSON, fallback to text processing if it's not valid JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      console.warn('Failed to parse Gemini response as JSON, attempting to extract JSON:', parseError);
      
      // Try to find JSON content within the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          console.warn('Failed to parse extracted JSON:', secondParseError);
          // Fallback to text processing
          parsedResponse = processTextResponse(responseText);
        }
      } else {
        // No JSON found, process as text
        parsedResponse = processTextResponse(responseText);
      }
    }

    console.log('Raw parsed response:', parsedResponse);
    
    // Clean the parsed response to remove any remaining JSON formatting
    const cleanInsights = cleanArray(parsedResponse.insights || []);
    
    // Extract products from insights and create separate recommendations array
    const recommendations = [];
    const processedInsights = cleanInsights.map((insight, index) => {
      // If insight has embedded product information, extract it
      if (insight.product) {
        recommendations.push({
          name: insight.product,
          reasoning: insight.productReasoning || insight.reasoning,
          aiInsightIndex: index,
          type: 'Product Recommendation',
          priority: 'High'
        });
      }
      
      // Return insight with product info included (for display purposes)
      return {
        insight: insight.insight,
        reasoning: insight.reasoning,
        product: insight.product, // Keep product info in insight for display
        productReasoning: insight.productReasoning,
        type: insight.type || 'Analysis',
        priority: insight.priority || 'MEDIUM'
      };
    });
    
    const cleanResponse = {
      summary: cleanArray(parsedResponse.summary || []),
      insights: processedInsights,
      recommendations: recommendations
    };

    console.log('Clean response:', cleanResponse);

    return {
      ...cleanResponse,
      followUpResponse: followUp ? responseText : undefined
    };

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Check if it's an API key issue
    if (error.message.includes('API key') || error.message.includes('403') || error.message.includes('401')) {
      throw new Error('Invalid or missing Gemini API key. Please check your config.js file and ensure you have a valid API key from https://makersuite.google.com/app/apikey');
    }
    
    // Check if it's a network issue
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    throw new Error(`Gemini API call failed: ${error.message}`);
  }
} 