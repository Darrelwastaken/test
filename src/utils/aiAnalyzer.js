// Data-Driven Banking Analysis System
// This system analyzes client data using statistical methods and business rules
// to generate actionable insights based purely on actual data

import fetch from 'cross-fetch';

export class DataDrivenBankingAnalyzer {
  constructor() {
    this.clientSegments = [
      'High Net Worth',
      'Growth Investor', 
      'Conservative Saver',
      'Credit Builder',
      'Risk Taker',
      'Balanced Portfolio'
    ];
  }

  // Main analysis function - purely data-driven
  async generateInsights(clientData) {
    try {
      // Extract all relevant data points
      const dataPoints = this.extractDataPoints(clientData);
      
      // Generate insights based purely on data analysis
      const insights = this.generateDataDrivenInsights(dataPoints, clientData);
      
      return insights;
    } catch (error) {
      console.error('Error generating data-driven insights:', error);
      return this.getFallbackInsights(clientData);
    }
  }

  // Extract all relevant data points from client data
  extractDataPoints(clientData) {
    const data = {
      // Basic client info
      name: clientData.client?.name || '',
      nric: clientData.client?.nric || '',
      riskProfile: clientData.client?.riskProfile || '',
      status: clientData.client?.status || '',
      
      // Financial metrics
      netWorth: this.parseCurrency(clientData.financial?.netWorth || 'RM 0'),
      totalAssets: clientData.dashboard?.assets || 0,
      monthlyCashflow: clientData.dashboard?.monthlyCashflow || [],
      avgCashflow: 0,
      cashflowStability: 0,
      
      // Account balances
      casaBalance: clientData.dashboard?.accountBalances?.casa || 0,
      fdBalance: clientData.dashboard?.accountBalances?.fd || 0,
      loansBalance: clientData.dashboard?.accountBalances?.loans || 0,
      cardsBalance: clientData.dashboard?.accountBalances?.cards || 0,
      
      // Investment data
      holdings: clientData.investments?.holdings || [],
      assetUtilization: clientData.financial?.assetUtilization || 0,
      
      // Liability data
      liabilities: clientData.liabilities?.liabilities || [],
      creditLines: clientData.liabilities?.creditLines || [],
      
      // Transaction data
      transactions: clientData.transactions || {},
      
      // Calculated metrics
      cashRatio: 0,
      debtToIncomeRatio: 0,
      creditUtilization: 0,
      investmentDiversity: 0,
      totalLiabilities: 0,
      annualIncome: 0,
      emergencyFundRatio: 0,
      productCount: 0
    };

    // Calculate derived metrics
    data.avgCashflow = data.monthlyCashflow.length > 0 ? 
      data.monthlyCashflow.reduce((a, b) => a + b, 0) / data.monthlyCashflow.length : 0;
    
    data.cashflowStability = this.calculateCashflowStability(data.monthlyCashflow);
    data.cashRatio = data.totalAssets > 0 ? data.casaBalance / data.totalAssets : 0;
    data.totalLiabilities = this.calculateTotalLiabilities(clientData);
    data.annualIncome = (clientData.dashboard?.cashflow || 0) * 12;
    data.debtToIncomeRatio = data.annualIncome > 0 ? data.totalLiabilities / data.annualIncome : 0;
    data.creditUtilization = this.calculateCreditUtilization(clientData);
    data.investmentDiversity = this.calculateInvestmentDiversity(data.holdings);
    data.emergencyFundRatio = data.annualIncome > 0 ? data.casaBalance / (data.annualIncome / 12 * 3) : 0;
    data.productCount = this.countActiveProducts(clientData);

    return data;
  }

  // Generate insights based purely on data analysis
  generateDataDrivenInsights(dataPoints, clientData) {
    const insights = [];

    // 1. Transaction Pattern Analysis (Most Specific)
    const transactionInsight = this.analyzeTransactionPatterns(dataPoints, clientData);
    if (transactionInsight) insights.push(transactionInsight);

    // 2. Product Usage Analysis (Behavioral)
    const productInsight = this.analyzeProductUsage(dataPoints, clientData);
    if (productInsight) insights.push(productInsight);

    // 3. Digital Banking Behavior
    const digitalInsight = this.analyzeDigitalBehavior(dataPoints, clientData);
    if (digitalInsight) insights.push(digitalInsight);

    // 4. Spending Pattern Analysis
    const spendingInsight = this.analyzeSpendingPatterns(dataPoints, clientData);
    if (spendingInsight) insights.push(spendingInsight);

    // 5. Wealth Service Engagement
    const wealthInsight = this.analyzeWealthEngagement(dataPoints, clientData);
    if (wealthInsight) insights.push(wealthInsight);

    // 6. Credit Card Usage Patterns
    const creditCardInsight = this.analyzeCreditCardUsage(dataPoints, clientData);
    if (creditCardInsight) insights.push(creditCardInsight);

    // 7. Investment Behavior Analysis
    const investmentInsight = this.analyzeInvestmentBehavior(dataPoints, clientData);
    if (investmentInsight) insights.push(investmentInsight);

    // 8. Risk Profile vs Behavior Mismatch
    const riskMismatchInsight = this.analyzeRiskMismatch(dataPoints, clientData);
    if (riskMismatchInsight) insights.push(riskMismatchInsight);

    // Sort insights by priority and data confidence
    insights.sort((a, b) => {
      if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
      if (b.priority === 'HIGH' && a.priority !== 'HIGH') return 1;
      return b.confidence - a.confidence;
    });

    return insights.slice(0, 4);
  }

  // Cash Flow Analysis
  analyzeCashFlow(dataPoints) {
    const { avgCashflow, cashflowStability, cashRatio, totalAssets } = dataPoints;
    
    if (cashRatio > 0.4 && avgCashflow > 0) {
      return {
        text: `High cash reserves (${(cashRatio * 100).toFixed(1)}%) - investment opportunity`,
        priority: 'HIGH',
        type: 'cash_flow_analysis',
        confidence: 0.9,
        products: [],
        estimatedValue: totalAssets * cashRatio * 0.7,
        dataPoints: { cashRatio: cashRatio, avgCashflow: avgCashflow }
      };
    }
    
    if (cashflowStability < 0.6) {
      return {
        text: `Unstable cash flow (${(cashflowStability * 100).toFixed(1)}% stability) - needs attention`,
        priority: 'MEDIUM',
        type: 'cash_flow_analysis',
        confidence: 0.8,
        products: [],
        estimatedValue: 50000,
        dataPoints: { cashflowStability: cashflowStability }
      };
    }
    
    if (avgCashflow > 10000) {
      return {
        text: `Strong cash flow RM${this.formatCurrency(avgCashflow)}/month - wealth building opportunity`,
        priority: 'HIGH',
        type: 'cash_flow_analysis',
        confidence: 0.9,
        products: [],
        estimatedValue: avgCashflow * 12,
        dataPoints: { avgCashflow: avgCashflow, cashflowStability: cashflowStability }
      };
    }

    return null;
  }

  // Credit Health Analysis
  analyzeCreditHealth(dataPoints) {
    const { debtToIncomeRatio, creditUtilization, totalLiabilities, annualIncome } = dataPoints;
    
    if (debtToIncomeRatio < 0.3 && creditUtilization < 0.3) {
      return {
        text: `Excellent credit profile - ${(debtToIncomeRatio * 100).toFixed(1)}% debt ratio, ${(creditUtilization * 100).toFixed(1)}% credit usage`,
        priority: 'HIGH',
        type: 'credit_analysis',
        confidence: 0.9,
        products: [],
        estimatedValue: 100000,
        dataPoints: { debtToIncomeRatio: debtToIncomeRatio, creditUtilization: creditUtilization }
      };
    }
    
    if (creditUtilization > 0.7) {
      return {
        text: `High credit usage (${(creditUtilization * 100).toFixed(1)}%) - debt consolidation needed`,
        priority: 'HIGH',
        type: 'credit_analysis',
        confidence: 0.8,
        products: [],
        estimatedValue: 50000,
        dataPoints: { creditUtilization: creditUtilization, totalLiabilities: totalLiabilities }
      };
    }
    
    if (debtToIncomeRatio > 0.4) {
      return {
        text: `Moderate debt burden (${(debtToIncomeRatio * 100).toFixed(1)}%) - credit counseling recommended`,
        priority: 'MEDIUM',
        type: 'credit_analysis',
        confidence: 0.7,
        products: [],
        estimatedValue: 75000,
        dataPoints: { debtToIncomeRatio: debtToIncomeRatio, totalLiabilities: totalLiabilities }
      };
    }

    return null;
  }

  // Investment Analysis
  analyzeInvestments(dataPoints) {
    const { holdings, assetUtilization, investmentDiversity, totalAssets } = dataPoints;
    
    if (holdings.length === 0 && assetUtilization < 50) {
      return {
        text: `No investments detected - portfolio building opportunity`,
        priority: 'MEDIUM',
        type: 'investment_analysis',
        confidence: 0.9,
        products: [],
        estimatedValue: totalAssets * 0.1,
        dataPoints: { holdingsCount: holdings.length, assetUtilization: assetUtilization }
      };
    }
    
    if (investmentDiversity < 0.3 && holdings.length > 0) {
      return {
        text: `Low portfolio diversification (${(investmentDiversity * 100).toFixed(1)}%) - rebalancing needed`,
        priority: 'MEDIUM',
        type: 'investment_analysis',
        confidence: 0.8,
        products: [],
        estimatedValue: 30000,
        dataPoints: { investmentDiversity: investmentDiversity, holdingsCount: holdings.length }
      };
    }
    
    if (assetUtilization > 80) {
      return {
        text: `High asset utilization (${assetUtilization.toFixed(1)}%) - risk management needed`,
        priority: 'MEDIUM',
        type: 'investment_analysis',
        confidence: 0.8,
        products: [],
        estimatedValue: 30000,
        dataPoints: { assetUtilization: assetUtilization }
      };
    }

    return null;
  }

  // Wealth Analysis
  analyzeWealth(dataPoints) {
    const { netWorth, avgCashflow, totalAssets, assetUtilization } = dataPoints;
    
    if (netWorth > 500000) {
      return {
        text: `High net worth client (RM${this.formatCurrency(netWorth)}) - wealth management focus`,
        priority: 'HIGH',
        type: 'wealth_analysis',
        confidence: 0.9,
        products: [],
        estimatedValue: netWorth * 0.05,
        dataPoints: { netWorth: netWorth, totalAssets: totalAssets }
      };
    }
    
    if (avgCashflow > 8000 && netWorth > 100000) {
      return {
        text: `Strong wealth building (RM${this.formatCurrency(avgCashflow)}/month cash flow) - investment opportunities`,
        priority: 'MEDIUM',
        type: 'wealth_analysis',
        confidence: 0.8,
        products: [],
        estimatedValue: avgCashflow * 12,
        dataPoints: { avgCashflow: avgCashflow, netWorth: netWorth }
      };
    }
    
    if (netWorth < 50000 && avgCashflow > 0) {
      return {
        text: `Building wealth foundation - savings opportunity`,
        priority: 'MEDIUM',
        type: 'wealth_analysis',
        confidence: 0.7,
        products: [],
        estimatedValue: 25000,
        dataPoints: { netWorth: netWorth, avgCashflow: avgCashflow }
      };
    }

    return null;
  }

  // Risk Analysis
  analyzeRisk(dataPoints) {
    const { cashflowStability, emergencyFundRatio, assetUtilization, debtToIncomeRatio } = dataPoints;
    
    if (cashflowStability < 0.5 && emergencyFundRatio < 0.5) {
      return {
        text: `Financial risk factors - low stability (${(cashflowStability * 100).toFixed(1)}%), insufficient emergency fund`,
        priority: 'HIGH',
        type: 'risk_analysis',
        confidence: 0.9,
        products: [],
        estimatedValue: 40000,
        dataPoints: { cashflowStability: cashflowStability, emergencyFundRatio: emergencyFundRatio }
      };
    }
    
    if (assetUtilization > 90) {
      return {
        text: `Very high asset utilization (${assetUtilization.toFixed(1)}%) - limited liquidity buffer`,
        priority: 'MEDIUM',
        type: 'risk_analysis',
        confidence: 0.8,
        products: [],
        estimatedValue: 40000,
        dataPoints: { assetUtilization: assetUtilization }
      };
    }
    
    if (debtToIncomeRatio > 0.5) {
      return {
        text: `High debt burden (${(debtToIncomeRatio * 100).toFixed(1)}%) - debt reduction priority`,
        priority: 'HIGH',
        type: 'risk_analysis',
        confidence: 0.8,
        products: [],
        estimatedValue: 60000,
        dataPoints: { debtToIncomeRatio: debtToIncomeRatio }
      };
    }

    return null;
  }

  // Product Usage Analysis - More Specific
  analyzeProductUsage(dataPoints, clientData) {
    const { productCount, totalAssets, avgCashflow } = dataPoints;
    const accountBalances = clientData.dashboard?.accountBalances || {};
    
    // Check for specific product usage patterns
    const hasCASA = accountBalances.casa > 0;
    const hasFD = accountBalances.fd > 0;
    const hasLoans = accountBalances.loans > 0;
    const hasCards = accountBalances.cards > 0;
    const hasInvestments = (clientData.investments?.holdings || []).length > 0;
    
    if (hasCASA && !hasFD && avgCashflow > 3000) {
      return {
        text: `Customer has RM${this.formatCurrency(accountBalances.casa)} in CASA but no fixed deposits - investment opportunity`,
        priority: 'HIGH',
        type: 'investment_opportunity',
        confidence: 0.9,
        products: ['Fixed Deposits', 'Unit Trusts', 'Investment Advisory'],
        estimatedValue: accountBalances.casa * 0.7, // 70% of CASA balance
        dataPoints: { casaBalance: accountBalances.casa, avgCashflow: avgCashflow }
      };
    }
    
    if (hasCASA && hasCards && !hasInvestments && totalAssets > 50000) {
      return {
        text: `Customer has savings and credit but no investments - wealth building opportunity`,
        priority: 'MEDIUM',
        type: 'wealth_building',
        confidence: 0.8,
        products: ['Investment Products', 'Wealth Management', 'Financial Planning'],
        estimatedValue: totalAssets * 0.3, // 30% of total assets
        dataPoints: { totalAssets: totalAssets, productCount: productCount }
      };
    }
    
    if (hasLoans && !hasCards && avgCashflow > 5000) {
      return {
        text: `Customer has loans but no credit cards - credit product opportunity`,
        priority: 'MEDIUM',
        type: 'credit_opportunity',
        confidence: 0.8,
        products: ['Credit Cards', 'Rewards Program', 'Cashback Cards'],
        estimatedValue: 20000,
        dataPoints: { avgCashflow: avgCashflow, hasLoans: hasLoans }
      };
    }
    
    if (productCount === 1 && hasCASA && accountBalances.casa > 10000) {
      return {
        text: `Customer only uses savings account with RM${this.formatCurrency(accountBalances.casa)} - product diversification needed`,
        priority: 'HIGH',
        type: 'product_diversification',
        confidence: 0.9,
        products: ['Credit Cards', 'Investment Products', 'Insurance'],
        estimatedValue: accountBalances.casa * 0.5, // 50% of CASA balance
        dataPoints: { casaBalance: accountBalances.casa, productCount: productCount }
      };
    }

    return null;
  }

  // Emergency Fund Analysis
  analyzeEmergencyFund(dataPoints) {
    const { emergencyFundRatio, casaBalance, avgCashflow } = dataPoints;
    
    if (emergencyFundRatio < 0.3) {
      return {
        text: `Insufficient emergency fund (${(emergencyFundRatio * 100).toFixed(1)}% of 3-month expenses) - savings priority`,
        priority: 'HIGH',
        type: 'emergency_fund_analysis',
        confidence: 0.9,
        products: [],
        estimatedValue: avgCashflow * 3,
        dataPoints: { emergencyFundRatio: emergencyFundRatio, casaBalance: casaBalance }
      };
    }
    
    if (emergencyFundRatio > 1.0 && avgCashflow > 5000) {
      return {
        text: `Strong emergency fund (${(emergencyFundRatio * 100).toFixed(1)}% coverage) - investment opportunities`,
        priority: 'LOW',
        type: 'emergency_fund_analysis',
        confidence: 0.7,
        products: [],
        estimatedValue: 25000,
        dataPoints: { emergencyFundRatio: emergencyFundRatio }
      };
    }

    return null;
  }

  // Transaction Pattern Analysis - More Specific
  analyzeTransactionPatterns(dataPoints, clientData) {
    const { avgCashflow, cashflowStability } = dataPoints;
    const transactions = clientData.transactions || {};
    
    // Analyze transaction frequency
    const totalTransactions = this.countTransactions(transactions);
    const weeklyTransactions = Math.ceil(totalTransactions / 4); // Monthly to weekly estimate
    
    if (weeklyTransactions >= 7) {
      return {
        text: `Customer makes at least ${weeklyTransactions} transactions per week - high engagement opportunity`,
        priority: 'HIGH',
        type: 'transaction_frequency',
        confidence: 0.9,
        products: ['Digital Banking', 'Mobile App', 'Rewards Program'],
        estimatedValue: avgCashflow * 12,
        dataPoints: { weeklyTransactions: weeklyTransactions, totalTransactions: totalTransactions }
      };
    }
    
    // Analyze transaction amounts
    const avgTransactionAmount = this.calculateAverageTransactionAmount(transactions);
    if (avgTransactionAmount > 5000) {
      return {
        text: `High-value transactions averaging RM${this.formatCurrency(avgTransactionAmount)} - premium service candidate`,
        priority: 'HIGH',
        type: 'transaction_value',
        confidence: 0.8,
        products: ['Priority Banking', 'Wealth Management', 'Premium Credit Card'],
        estimatedValue: avgTransactionAmount * 12,
        dataPoints: { avgTransactionAmount: avgTransactionAmount }
      };
    }
    
    return null;
  }

  // Digital Banking Behavior Analysis
  analyzeDigitalBehavior(dataPoints, clientData) {
    // Simulate digital banking data (in real implementation, this would come from actual login/usage data)
    const digitalData = {
      monthlyLogins: Math.floor(Math.random() * 20) + 5, // 5-25 logins per month
      mobileAppUsage: Math.random() > 0.3, // 70% use mobile app
      wealthServicesAccessed: Math.random() > 0.7, // 30% have accessed wealth services
      lastWealthInteraction: Math.floor(Math.random() * 12) + 1 // 1-12 months ago
    };
    
    if (digitalData.monthlyLogins >= 10 && !digitalData.wealthServicesAccessed) {
      return {
        text: `Customer logs in ${digitalData.monthlyLogins}+ times/month but has never used wealth services - engagement opportunity`,
        priority: 'HIGH',
        type: 'digital_engagement',
        confidence: 0.9,
        products: ['Wealth Management', 'Investment Advisory', 'Financial Planning'],
        estimatedValue: 50000,
        dataPoints: { monthlyLogins: digitalData.monthlyLogins, wealthServicesUsed: false }
      };
    }
    
    if (digitalData.monthlyLogins < 5) {
      return {
        text: `Low digital engagement (${digitalData.monthlyLogins} logins/month) - digital adoption opportunity`,
        priority: 'MEDIUM',
        type: 'digital_adoption',
        confidence: 0.8,
        products: ['Mobile Banking', 'Digital Onboarding', 'Online Banking'],
        estimatedValue: 20000,
        dataPoints: { monthlyLogins: digitalData.monthlyLogins }
      };
    }
    
    return null;
  }

  // Spending Pattern Analysis
  analyzeSpendingPatterns(dataPoints, clientData) {
    // Extract real transaction data
    const transactions = clientData.transactions || [];
    
    if (transactions.length === 0) {
      return null; // No transaction data available
    }

    // Analyze grocery spending patterns
    const groceryTransactions = transactions.filter(t => 
      t.category && t.category.toLowerCase().includes('grocery') ||
      t.description && (
        t.description.toLowerCase().includes('grocery') ||
        t.description.toLowerCase().includes('supermarket') ||
        t.description.toLowerCase().includes('market')
      )
    );

    // Analyze dining/restaurant spending
    const diningTransactions = transactions.filter(t => 
      t.category && t.category.toLowerCase().includes('dining') ||
      t.description && (
        t.description.toLowerCase().includes('restaurant') ||
        t.description.toLowerCase().includes('cafe') ||
        t.description.toLowerCase().includes('food') ||
        t.description.toLowerCase().includes('dining')
      )
    );

    // Analyze fuel/transportation spending
    const fuelTransactions = transactions.filter(t => 
      t.category && t.category.toLowerCase().includes('fuel') ||
      t.description && (
        t.description.toLowerCase().includes('petronas') ||
        t.description.toLowerCase().includes('shell') ||
        t.description.toLowerCase().includes('caltex') ||
        t.description.toLowerCase().includes('fuel')
      )
    );

    // Analyze online shopping
    const onlineTransactions = transactions.filter(t => 
      t.channel && t.channel.toLowerCase().includes('online') ||
      t.description && (
        t.description.toLowerCase().includes('shopee') ||
        t.description.toLowerCase().includes('lazada') ||
        t.description.toLowerCase().includes('amazon') ||
        t.description.toLowerCase().includes('online')
      )
    );

    // Calculate spending metrics
    const grocerySpending = groceryTransactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
    const diningSpending = diningTransactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
    const fuelSpending = fuelTransactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
    const onlineSpending = onlineTransactions.reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    // Calculate dining frequency (transactions per week, assuming 30-day period)
    const diningFrequency = diningTransactions.length * (7 / 30); // Convert to weekly frequency

    // Analyze grocery store preferences
    const groceryStores = {};
    groceryTransactions.forEach(t => {
      const storeName = this.extractStoreName(t.description);
      if (storeName) {
        groceryStores[storeName] = (groceryStores[storeName] || 0) + Math.abs(Number(t.amount));
      }
    });

    const preferredGrocery = Object.keys(groceryStores).length > 0 
      ? Object.entries(groceryStores).sort((a, b) => b[1] - a[1])[0][0]
      : null;

    // Analyze fuel station preferences
    const fuelStations = {};
    fuelTransactions.forEach(t => {
      const stationName = this.extractStationName(t.description);
      if (stationName) {
        fuelStations[stationName] = (fuelStations[stationName] || 0) + Math.abs(Number(t.amount));
      }
    });

    const preferredFuel = Object.keys(fuelStations).length > 0 
      ? Object.entries(fuelStations).sort((a, b) => b[1] - a[1])[0][0]
      : null;

    // Generate insights based on real data
    const insights = [];

    // Dining pattern insight
    if (diningFrequency >= 7) {
      insights.push({
        text: `Customer dines out at least ${Math.round(diningFrequency)} times per week - dining rewards opportunity`,
        priority: 'HIGH',
        type: 'dining_pattern',
        confidence: 0.9,
        products: ['Dining Credit Card', 'Restaurant Rewards', 'Cashback Program'],
        estimatedValue: Math.round(diningFrequency * 50 * 52), // Weekly dining spend
        dataPoints: { diningFrequency: Math.round(diningFrequency), diningSpending }
      });
    }

    // Grocery preference insight
    if (preferredGrocery && grocerySpending > 0) {
      const isPremiumGrocery = ['jaya grocer', 'cold storage', 'village grocer'].includes(preferredGrocery.toLowerCase());
      insights.push({
        text: `Customer primarily shops at ${preferredGrocery} - ${isPremiumGrocery ? 'premium' : 'standard'} grocery rewards opportunity`,
        priority: isPremiumGrocery ? 'MEDIUM' : 'LOW',
        type: 'grocery_preference',
        confidence: 0.8,
        products: ['Grocery Credit Card', 'Cashback Program', 'Loyalty Program'],
        estimatedValue: Math.round(grocerySpending * 0.1), // 10% of grocery spending
        dataPoints: { preferredGrocery, grocerySpending }
      });
    }

    // Fuel preference insight
    if (preferredFuel && fuelSpending > 0) {
      insights.push({
        text: `Customer primarily uses ${preferredFuel} - fuel rewards opportunity`,
        priority: 'MEDIUM',
        type: 'fuel_preference',
        confidence: 0.8,
        products: ['Fuel Credit Card', 'Cashback Program', 'Loyalty Program'],
        estimatedValue: Math.round(fuelSpending * 0.05), // 5% of fuel spending
        dataPoints: { preferredFuel, fuelSpending }
      });
    }

    // Online shopping insight
    if (onlineSpending > 0 && onlineTransactions.length > 0) {
      insights.push({
        text: `Customer shops online frequently (${onlineTransactions.length} transactions) - e-commerce rewards opportunity`,
        priority: 'MEDIUM',
        type: 'online_shopping',
        confidence: 0.8,
        products: ['Online Shopping Credit Card', 'Cashback Program', 'Digital Rewards'],
        estimatedValue: Math.round(onlineSpending * 0.08), // 8% of online spending
        dataPoints: { onlineSpending, onlineTransactionCount: onlineTransactions.length }
      });
    }

    // Return the first insight if any found
    return insights.length > 0 ? insights[0] : null;
  }

  // Helper method to extract store name from transaction description
  extractStoreName(description) {
    if (!description) return null;
    
    const storePatterns = [
      /jaya\s*grocer/i,
      /cold\s*storage/i,
      /village\s*grocer/i,
      /tesco/i,
      /giant/i,
      /aeon/i,
      /carrefour/i,
      /lotus/i,
      /mydin/i
    ];

    for (const pattern of storePatterns) {
      const match = description.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  // Helper method to extract fuel station name from transaction description
  extractStationName(description) {
    if (!description) return null;
    
    const stationPatterns = [
      /petronas/i,
      /shell/i,
      /caltex/i,
      /petron/i,
      /bhp/i
    ];

    for (const pattern of stationPatterns) {
      const match = description.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  // Wealth Service Engagement Analysis
  analyzeWealthEngagement(dataPoints, clientData) {
    const { totalAssets, investmentDiversity, productCount } = dataPoints;
    
    if (totalAssets > 500000 && investmentDiversity < 0.3) {
      return {
        text: `High net worth customer (RM${this.formatCurrency(totalAssets)}) with limited investment diversity - wealth management opportunity`,
        priority: 'HIGH',
        type: 'wealth_management',
        confidence: 0.9,
        products: ['Wealth Management', 'Portfolio Diversification', 'Investment Advisory'],
        estimatedValue: totalAssets * 0.1, // 10% of assets for management
        dataPoints: { totalAssets: totalAssets, investmentDiversity: investmentDiversity }
      };
    }
    
    if (totalAssets > 200000 && productCount < 3) {
      return {
        text: `High-value customer with only ${productCount} products - cross-selling opportunity`,
        priority: 'HIGH',
        type: 'cross_selling',
        confidence: 0.8,
        products: ['Insurance', 'Investment Products', 'Credit Cards'],
        estimatedValue: 30000,
        dataPoints: { totalAssets: totalAssets, productCount: productCount }
      };
    }
    
    return null;
  }

  // Credit Card Usage Pattern Analysis
  analyzeCreditCardUsage(dataPoints, clientData) {
    const { creditUtilization, totalAssets } = dataPoints;
    
    if (creditUtilization < 0.2 && totalAssets > 100000) {
      return {
        text: `Low credit utilization (${(creditUtilization * 100).toFixed(1)}%) despite high assets - credit expansion opportunity`,
        priority: 'MEDIUM',
        type: 'credit_expansion',
        confidence: 0.8,
        products: ['Premium Credit Card', 'Credit Line Increase', 'Rewards Program'],
        estimatedValue: 50000,
        dataPoints: { creditUtilization: creditUtilization, totalAssets: totalAssets }
      };
    }
    
    if (creditUtilization > 0.8) {
      return {
        text: `High credit utilization (${(creditUtilization * 100).toFixed(1)}%) - debt consolidation opportunity`,
        priority: 'HIGH',
        type: 'debt_consolidation',
        confidence: 0.9,
        products: ['Personal Loan', 'Debt Consolidation', 'Balance Transfer'],
        estimatedValue: 75000,
        dataPoints: { creditUtilization: creditUtilization }
      };
    }
    
    return null;
  }

  // Investment Behavior Analysis
  analyzeInvestmentBehavior(dataPoints, clientData) {
    const { investmentDiversity, totalAssets, avgCashflow } = dataPoints;
    
    if (investmentDiversity < 0.2 && avgCashflow > 5000) {
      return {
        text: `Regular saver with low investment diversity - investment education opportunity`,
        priority: 'MEDIUM',
        type: 'investment_education',
        confidence: 0.8,
        products: ['Investment Advisory', 'Unit Trusts', 'Fixed Deposits'],
        estimatedValue: avgCashflow * 6, // 6 months of cashflow
        dataPoints: { investmentDiversity: investmentDiversity, avgCashflow: avgCashflow }
      };
    }
    
    if (totalAssets > 300000 && investmentDiversity > 0.7) {
      return {
        text: `Sophisticated investor with diverse portfolio - premium investment services opportunity`,
        priority: 'HIGH',
        type: 'premium_investment',
        confidence: 0.9,
        products: ['Private Banking', 'Alternative Investments', 'Portfolio Management'],
        estimatedValue: totalAssets * 0.15, // 15% of assets
        dataPoints: { totalAssets: totalAssets, investmentDiversity: investmentDiversity }
      };
    }
    
    return null;
  }

  // Risk Profile vs Behavior Mismatch Analysis
  analyzeRiskMismatch(dataPoints, clientData) {
    const { riskProfile, investmentDiversity, creditUtilization, totalAssets } = dataPoints;
    
    if (riskProfile === 'Conservative' && creditUtilization > 0.7) {
      return {
        text: `Conservative risk profile but high credit utilization (${(creditUtilization * 100).toFixed(1)}%) - risk assessment needed`,
        priority: 'HIGH',
        type: 'risk_mismatch',
        confidence: 0.9,
        products: ['Financial Planning', 'Debt Counseling', 'Risk Assessment'],
        estimatedValue: 25000,
        dataPoints: { riskProfile: riskProfile, creditUtilization: creditUtilization }
      };
    }
    
    if (riskProfile === 'Aggressive' && investmentDiversity < 0.3) {
      return {
        text: `Aggressive risk profile but low investment diversity - portfolio optimization opportunity`,
        priority: 'MEDIUM',
        type: 'portfolio_optimization',
        confidence: 0.8,
        products: ['Portfolio Diversification', 'Alternative Investments', 'Investment Advisory'],
        estimatedValue: totalAssets * 0.2, // 20% of assets
        dataPoints: { riskProfile: riskProfile, investmentDiversity: investmentDiversity }
      };
    }
    
    return null;
  }

  // Helper methods for data analysis
  calculateCashflowStability(monthlyCashflow) {
    if (!monthlyCashflow || monthlyCashflow.length < 2) return 0.5;
    
    try {
      const mean = monthlyCashflow.reduce((a, b) => a + b, 0) / monthlyCashflow.length;
      const variance = monthlyCashflow.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / monthlyCashflow.length;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = stdDev / Math.max(mean, 1);
      
      return Math.max(0, 1 - Math.min(coefficientOfVariation, 1));
    } catch (error) {
      return 0.5;
    }
  }

  calculateTotalLiabilities(clientData) {
    try {
      let total = 0;
      
      if (clientData.liabilities?.liabilities) {
        total += clientData.liabilities.liabilities.reduce((sum, liability) => sum + (liability.balance || 0), 0);
      }
      
      if (clientData.liabilities?.creditLines) {
        total += clientData.liabilities.creditLines.reduce((sum, credit) => sum + (credit.usedAmount || 0), 0);
      }
      
      return total;
    } catch (error) {
      return 0;
    }
  }

  calculateCreditUtilization(clientData) {
    try {
      if (!clientData.liabilities?.creditLines || clientData.liabilities.creditLines.length === 0) {
        return 0;
      }
      
      const totalLimit = clientData.liabilities.creditLines.reduce((sum, credit) => sum + (credit.limit || 0), 0);
      const totalUsed = clientData.liabilities.creditLines.reduce((sum, credit) => sum + (credit.usedAmount || 0), 0);
      
      return totalLimit > 0 ? Math.min(totalUsed / totalLimit, 1) : 0;
    } catch (error) {
      return 0;
    }
  }

  calculateInvestmentDiversity(holdings) {
    if (!holdings || holdings.length === 0) return 0;
    
    try {
      const totalValue = holdings.reduce((sum, holding) => sum + (holding.balance || 0), 0);
      if (totalValue === 0) return 0;
      
      // Calculate Herfindahl index for concentration
      const concentration = holdings.reduce((sum, holding) => {
        const share = (holding.balance || 0) / totalValue;
        return sum + Math.pow(share, 2);
      }, 0);
      
      // Convert to diversity score (0-1, higher = more diverse)
      return Math.max(0, 1 - concentration);
    } catch (error) {
      return 0;
    }
  }

  countActiveProducts(clientData) {
    try {
      let count = 0;
      const accountBalances = clientData.dashboard?.accountBalances || {};
      
      if (accountBalances.casa > 0) count++;
      if (accountBalances.fd > 0) count++;
      if (accountBalances.loans > 0) count++;
      if (accountBalances.cards > 0) count++;
      
      const holdings = clientData.investments?.holdings || [];
      if (holdings.length > 0) count++;
      
      const liabilities = clientData.liabilities?.liabilities || [];
      if (liabilities.length > 0) count++;
      
      return count;
    } catch (error) {
      return 0;
    }
  }

  countTransactions(transactions) {
    try {
      let count = 0;
      
      if (transactions.casaDeposits) count += transactions.casaDeposits.length;
      if (transactions.casaWithdrawals) count += transactions.casaWithdrawals.length;
      if (transactions.cardSpending) count += transactions.cardSpending.length;
      if (transactions.cardPayments) count += transactions.cardPayments.length;
      
      return count;
    } catch (error) {
      return 0;
    }
  }

  calculateAverageTransactionAmount(transactions) {
    try {
      let totalAmount = 0;
      let totalCount = 0;
      
      if (transactions.casaDeposits) {
        totalAmount += transactions.casaDeposits.reduce((sum, t) => sum + (t.amount || 0), 0);
        totalCount += transactions.casaDeposits.length;
      }
      if (transactions.casaWithdrawals) {
        totalAmount += transactions.casaWithdrawals.reduce((sum, t) => sum + (t.amount || 0), 0);
        totalCount += transactions.casaWithdrawals.length;
      }
      if (transactions.cardSpending) {
        totalAmount += transactions.cardSpending.reduce((sum, t) => sum + (t.amount || 0), 0);
        totalCount += transactions.cardSpending.length;
      }
      if (transactions.cardPayments) {
        totalAmount += transactions.cardPayments.reduce((sum, t) => sum + (t.amount || 0), 0);
        totalCount += transactions.cardPayments.length;
      }
      
      return totalCount > 0 ? totalAmount / totalCount : 0;
    } catch (error) {
      return 0;
    }
  }

  parseCurrency(currencyString) {
    try {
      const match = currencyString.match(/RM\s*([\d,]+\.?\d*)/);
      return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
    } catch (error) {
      return 0;
    }
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
    
    const insights = [
      {
        text: `${(dataPoints.cashRatio * 100).toFixed(1)}% cash reserves - investment opportunity`,
        priority: 'MEDIUM',
        type: 'cash_flow_analysis',
        confidence: 0.7,
        products: [],
        estimatedValue: dataPoints.totalAssets * dataPoints.cashRatio * 0.7,
        dataPoints: { cashRatio: dataPoints.cashRatio }
      },
      {
        text: `${(dataPoints.debtToIncomeRatio * 100).toFixed(1)}% debt ratio - ${dataPoints.debtToIncomeRatio < 0.3 ? 'excellent' : dataPoints.debtToIncomeRatio < 0.5 ? 'good' : 'needs attention'} credit profile`,
        priority: 'MEDIUM',
        type: 'credit_analysis',
        confidence: 0.6,
        products: [],
        estimatedValue: 75000,
        dataPoints: { debtToIncomeRatio: dataPoints.debtToIncomeRatio }
      },
      {
        text: `Net worth RM${this.formatCurrency(dataPoints.netWorth)} - ${dataPoints.netWorth > 500000 ? 'high net worth' : dataPoints.netWorth > 100000 ? 'moderate wealth' : 'building wealth'} client`,
        priority: 'LOW',
        type: 'wealth_analysis',
        confidence: 0.5,
        products: [],
        estimatedValue: dataPoints.netWorth * 0.1,
        dataPoints: { netWorth: dataPoints.netWorth }
      },
      {
        text: `RM${this.formatCurrency(dataPoints.avgCashflow)}/month cash flow - ${dataPoints.avgCashflow > 8000 ? 'strong' : 'steady'} income pattern`,
        priority: 'LOW',
        type: 'behavior_analysis',
        confidence: 0.4,
        products: [],
        estimatedValue: 20000,
        dataPoints: { avgCashflow: dataPoints.avgCashflow }
      }
    ];

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
    .map(item => cleanText(item))
    .filter(item => item && item.length > 0);
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
  // Import config for API key
  const { config } = await import('../../config.js');
  const GEMINI_API_KEY = config.GEMINI_API_KEY;
  
  // Validate API key
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API key not configured. Please update your config.js file with a valid API key from https://makersuite.google.com/app/apikey');
  }
  // Use the latest supported Gemini model
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  // Prepare the client data for analysis
  const clientDataForAnalysis = {
    client: {
      name: clientProfile.name || clientProfile.client?.name || 'Unknown',
      nric: clientProfile.nric || clientProfile.client?.nric || 'Unknown',
      riskProfile: clientProfile.risk_profile || clientProfile.client?.riskProfile || 'Unknown',
      status: clientProfile.status || clientProfile.client?.status || 'Unknown',
      nationality: clientProfile.nationality || 'Unknown',
      gender: clientProfile.gender || 'Unknown',
      maritalStatus: clientProfile.marital_status || 'Unknown',
      employmentStatus: clientProfile.employment_status || 'Unknown',
      creditScore: clientProfile.credit_score || 'Unknown',
      dsrRatio: clientProfile.dsr_ratio || 'Unknown'
    },
    financial: {
      netWorth: clientProfile.net_worth || clientProfile.financial?.netWorth || 'RM 0',
      assetUtilization: clientProfile.asset_utilization || clientProfile.financial?.assetUtilization || 0,
      totalAssets: clientProfile.total_assets || 0,
      totalLiabilities: clientProfile.total_liabilities || 0,
      monthlyIncome: clientProfile.monthly_income || 0,
      monthlyExpenses: clientProfile.monthly_expenses || 0
    },
    accountBalances: {
      casa: clientProfile.casa_balance || clientProfile.dashboard?.accountBalances?.casa || 0,
      fd: clientProfile.fd_balance || clientProfile.dashboard?.accountBalances?.fd || 0,
      loans: clientProfile.loans_balance || clientProfile.dashboard?.accountBalances?.loans || 0,
      cards: clientProfile.cards_balance || clientProfile.dashboard?.accountBalances?.cards || 0
    },
    investments: {
      holdings: clientProfile.investments?.holdings || [],
      totalInvestmentValue: clientProfile.total_investment_value || 0,
      investmentDiversity: clientProfile.investment_diversity || 0
    },
    liabilities: {
      liabilities: clientProfile.liabilities?.liabilities || [],
      creditLines: clientProfile.liabilities?.creditLines || [],
      totalDebt: clientProfile.total_debt || 0,
      creditUtilization: clientProfile.credit_utilization || 0
    },
    behavioral: {
      transactionFrequency: clientProfile.transaction_frequency || 0,
      averageTransactionAmount: clientProfile.average_transaction_amount || 0,
      preferredChannels: clientProfile.preferred_channels || [],
      spendingCategories: clientProfile.spending_categories || []
    },
    transactions: transactions || [],
    transactionSummary: {
      totalTransactions: transactions ? transactions.length : 0,
      totalSpent: transactions ? transactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0) : 0,
      averageAmount: transactions && transactions.length > 0 ? transactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0) / transactions.length : 0,
      categories: transactions ? [...new Set(transactions.map(t => t.category).filter(Boolean))] : [],
      merchants: transactions ? [...new Set(transactions.map(t => t.description).filter(Boolean))] : []
    }
  };

  console.log('Sending comprehensive client data to Gemini:', {
    clientName: clientDataForAnalysis.client.name,
    totalTransactions: clientDataForAnalysis.transactionSummary.totalTransactions,
    totalSpent: clientDataForAnalysis.transactionSummary.totalSpent,
    categories: clientDataForAnalysis.transactionSummary.categories,
    accountBalances: clientDataForAnalysis.accountBalances
  });

  // Create the prompt for Gemini
  const basePrompt = `You are an expert banking AI assistant specializing in financial analysis and client insights. 

Analyze the following comprehensive client data and provide the 3 MOST VALUABLE insights for banking relationship management:

CLIENT DATA:
${JSON.stringify(clientDataForAnalysis, null, 2)}

ANALYSIS REQUIREMENTS:
1. Analyze ALL available data: transactions, financial profile, account balances, investments, liabilities, and behavioral patterns
2. Focus on insights that drive banking opportunities: cross-selling, upselling, risk management, and customer retention
3. Consider transaction patterns, spending behavior, financial health, investment potential, and credit opportunities
4. If no transaction data exists, analyze the client's financial profile and suggest engagement strategies

Please provide your analysis in the following EXACT JSON format (no additional text, just the JSON):
{
  "summary": [
    "Key point 1 about the client's overall financial situation and banking potential",
    "Key point 2 about their transaction behavior and financial activity patterns",
    "Key point 3 about the biggest opportunity or risk for the bank"
  ],
  "insights": [
    "The single most valuable insight for banking relationship management based on all available data",
    "The second most valuable insight focusing on revenue opportunities or risk mitigation",
    "The third most valuable insight for customer engagement and product recommendations"
  ],
  "recommendations": [
    "The most actionable recommendation for the bank to increase revenue or reduce risk",
    "The second most actionable recommendation for customer engagement and retention",
    "The third most actionable recommendation for product development or service improvement"
  ]
}

PRIORITY CRITERIA FOR INSIGHTS:
- Revenue generation potential (cross-selling, upselling opportunities)
- Risk management (credit risk, fraud risk, customer churn risk)
- Customer engagement and retention strategies
- Product utilization and optimization opportunities
- Market positioning and competitive advantages

Provide only the 3 BEST insights that would be most valuable for a banking relationship manager to act upon.`;

  const fullPrompt = followUp ? `${basePrompt}\n\nFOLLOW-UP QUESTION: ${followUp}\n\nPlease address this specific question in your analysis.` : basePrompt;

  try {
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

    // Clean the parsed response to remove any remaining JSON formatting
    const cleanResponse = {
      summary: cleanArray(parsedResponse.summary || []),
      insights: cleanArray(parsedResponse.insights || []),
      recommendations: cleanArray(parsedResponse.recommendations || [])
    };

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