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
        dataPoints: { emergencyFundRatio, monthlyIncome, casaBalance }
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
        dataPoints: { emergencyFundRatio, monthlyIncome, casaBalance }
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
        dataPoints: { casaBalance, investmentRatio, age }
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
        dataPoints: { monthlyIncome, investmentRatio }
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
        dataPoints: { creditUtilization, cardBalance }
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
        dataPoints: { debtToIncomeRatio, monthlyIncome }
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
        dataPoints: { creditUtilization, monthlyIncome }
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
        dataPoints: { age, annualIncome, currentCoverage, recommendedCoverage }
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
        dataPoints: { age, currentCoverage, recommendedCoverage }
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
        dataPoints: { netWorth, age, totalAssets }
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
        dataPoints: { monthlyIncome, totalAssets }
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
        dataPoints: { debtToIncomeRatio, loanBalance }
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
        dataPoints: { totalLiabilities, monthlyIncome }
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
        productCategories: this.getProductCategoriesForTravel(travelSpending)
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
        dataPoints: { emergencyFundRatio: dataPoints.emergencyFundRatio, monthlyIncome: dataPoints.monthlyIncome, casaBalance: dataPoints.casaBalance }
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
        dataPoints: { casaBalance: dataPoints.casaBalance, investmentRatio: dataPoints.investmentRatio }
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
        dataPoints: { creditUtilization: dataPoints.creditUtilization, cardBalance: dataPoints.cardBalance }
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
        dataPoints: { netWorth: dataPoints.netWorth }
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
      // Handle new insight format with reasoning
      if (item && typeof item === 'object' && item.insight && item.reasoning) {
        return {
          insight: cleanText(item.insight),
          reasoning: cleanText(item.reasoning)
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

Use the following logic to guide your recommendations:

1. **Salary & Income**: If monthly income > RM5000, recommend premium products. If > RM8000, recommend private banking services.

2. **Spending Behavior**: 
   - Groceries > RM1000/month: Recommend grocery rewards credit card
   - Dining > RM800/month: Recommend dining rewards credit card
   - Online shopping > RM500/month: Recommend e-commerce rewards card

3. **Travel & International**: 
   - Grab/travel spending > RM500/month: Recommend transport rewards card
   - FX transactions: Recommend multi-currency account

4. **Credit & Lending**: 
   - High credit score (>750): Recommend premium credit cards
   - Low credit utilization: Recommend credit limit increase

5. **Digital Engagement**: 
   - Online transactions > 50%: Recommend digital banking features
   - ATM usage > RM1000/month: Recommend mobile payment solutions

6. **Life Stage Indicators**: 
   - Age 25-35: Recommend investment products
   - Age 35-50: Recommend insurance products
   - Age 50+: Recommend retirement planning

7. **Investment & Savings**: 
   - No investments: Recommend unit trust products
   - Low savings: Recommend automated savings plans

8. **Risk Profile Alignment**: 
   - Conservative: Recommend fixed deposits
   - Balanced: Recommend balanced unit trusts
   - Aggressive: Recommend equity products

CRITICAL REQUIREMENTS:
- Use ONLY exact amounts from the transaction data provided
- Do NOT approximate, round, or make up any numbers
- If no transaction data is available, focus on client profile data only
- Each insight must be under 15 words
- Each recommendation must be specific and actionable
- Include exact amounts and merchant names when available
- Focus on significant patterns that indicate product opportunities

EXAMPLE INSIGHTS (use exact amounts from data):
- "RM830 spent on Grab in June"
- "RM156.80 grocery spending at Tesco"
- "RM450 online shopping at Shopee"

EXAMPLE RECOMMENDATIONS:
- "Transport Rewards Credit Card - 5% cashback on transport spending of RM830"
- "Grocery Rewards Card - 3% cashback on Tesco spending of RM156.80"
- "E-commerce Card - 2% cashback on Shopee spending of RM450"

JSON FORMAT:
{
  "summary": "Brief client overview based on available data",
  "insights": [
    {
      "insight": "Specific factual observation with exact amounts",
      "reasoning": "Data points that support this insight"
    }
  ],
  "recommendations": [
    {
      "product": "Specific product name",
      "reasoning": "Why this product is recommended based on data"
    }
  ]
}

REQUIREMENTS:
- Only use data that is explicitly provided
- If no transaction data exists, state "No transaction data available" as an insight
- Focus on transaction patterns, exact amounts, and specific merchants
- Avoid generic financial metrics like net worth, total assets, CASA balance
- Make insights purely factual observations
- Make recommendations actionable and specific
- Provide ONLY the 3 BEST insights based on significance and banking value
- Prioritize insights that indicate clear product opportunities`;

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
    const cleanResponse = {
      summary: cleanArray(parsedResponse.summary || []),
      insights: cleanArray(parsedResponse.insights || []),
      recommendations: cleanArray(parsedResponse.recommendations || [])
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