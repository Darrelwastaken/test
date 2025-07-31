// Utility functions for product recommendations

// Calculate client risk profile based on financial metrics
export const calculateRiskProfile = (clientData) => {
  const {
    age = 30,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    totalAssets = 0,
    totalLiabilities = 0,
    creditUtilization = 0,
    emergencyFundRatio = 0,
    investmentValue = 0
  } = clientData;

  let riskScore = 0;
  let riskLevel = 'Moderate';
  let riskFactors = [];

  // Age factor (younger = higher risk tolerance)
  if (age < 30) {
    riskScore += 3;
  } else if (age < 50) {
    riskScore += 2;
  } else {
    riskScore += 1;
  }

  // Income stability
  const netCashFlow = monthlyIncome - monthlyExpenses;
  if (netCashFlow > 5000) {
    riskScore += 3;
  } else if (netCashFlow > 2000) {
    riskScore += 2;
  } else if (netCashFlow > 0) {
    riskScore += 1;
  } else {
    riskScore -= 1;
    riskFactors.push('Negative cash flow');
  }

  // Debt-to-income ratio
  const debtToIncome = totalLiabilities > 0 ? (totalLiabilities / (monthlyIncome * 12)) * 100 : 0;
  if (debtToIncome < 30) {
    riskScore += 3;
  } else if (debtToIncome < 50) {
    riskScore += 1;
  } else {
    riskScore -= 2;
    riskFactors.push('High debt-to-income ratio');
  }

  // Credit utilization
  if (creditUtilization < 30) {
    riskScore += 2;
  } else if (creditUtilization > 70) {
    riskScore -= 2;
    riskFactors.push('High credit utilization');
  }

  // Emergency fund
  if (emergencyFundRatio >= 100) {
    riskScore += 2;
  } else if (emergencyFundRatio < 50) {
    riskScore -= 1;
    riskFactors.push('Insufficient emergency fund');
  }

  // Investment experience
  if (investmentValue > totalAssets * 0.3) {
    riskScore += 2;
  } else if (investmentValue === 0) {
    riskScore -= 1;
    riskFactors.push('No investment experience');
  }

  // Determine risk level
  if (riskScore >= 8) {
    riskLevel = 'Aggressive';
  } else if (riskScore >= 5) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'Conservative';
  }

  return {
    riskScore,
    riskLevel,
    riskFactors,
    debtToIncome,
    netCashFlow
  };
};

// Calculate client investment profile
export const calculateInvestmentProfile = (clientData) => {
  const {
    age = 30,
    monthlyIncome = 0,
    totalAssets = 0,
    investmentValue = 0,
    casaBalance = 0
  } = clientData;

  const investmentRatio = totalAssets > 0 ? (investmentValue / totalAssets) * 100 : 0;
  const savingsRatio = totalAssets > 0 ? (casaBalance / totalAssets) * 100 : 0;

  let investmentProfile = {
    type: 'Beginner',
    recommendations: [],
    allocation: {
      savings: 0,
      investments: 0,
      insurance: 0
    }
  };

  // Determine investment profile type
  if (investmentRatio > 50) {
    investmentProfile.type = 'Advanced';
  } else if (investmentRatio > 20) {
    investmentProfile.type = 'Intermediate';
  } else if (investmentRatio > 0) {
    investmentProfile.type = 'Beginner';
  } else {
    investmentProfile.type = 'New';
  }

  // Generate allocation recommendations based on age and profile
  if (age < 30) {
    investmentProfile.allocation = {
      savings: 20,
      investments: 70,
      insurance: 10
    };
  } else if (age < 50) {
    investmentProfile.allocation = {
      savings: 25,
      investments: 60,
      insurance: 15
    };
  } else {
    investmentProfile.allocation = {
      savings: 30,
      investments: 50,
      insurance: 20
    };
  }

  // Generate specific recommendations
  if (investmentProfile.type === 'New') {
    investmentProfile.recommendations = [
      'Start with high-yield savings account',
      'Build emergency fund first',
      'Consider basic life insurance'
    ];
  } else if (investmentProfile.type === 'Beginner') {
    investmentProfile.recommendations = [
      'Diversify with index funds',
      'Increase investment allocation',
      'Review insurance coverage'
    ];
  } else if (investmentProfile.type === 'Intermediate') {
    investmentProfile.recommendations = [
      'Consider unit trusts for diversification',
      'Optimize portfolio allocation',
      'Enhance insurance protection'
    ];
  } else {
    investmentProfile.recommendations = [
      'Advanced investment strategies',
      'Portfolio optimization',
      'Comprehensive insurance planning'
    ];
  }

  return investmentProfile;
};

// Calculate product suitability score
export const calculateProductSuitability = (product, clientData, riskProfile) => {
  let score = 0;
  let reasons = [];

  // Base score from product type and client profile
  switch (product.type) {
    case 'Savings':
      if (clientData.emergencyFundRatio < 100) {
        score += 8;
        reasons.push('Emergency fund needs');
      }
      if (clientData.casaBalance > 10000) {
        score += 4;
        reasons.push('Excess savings available');
      }
      break;

    case 'Investment':
      if (riskProfile.riskLevel === 'Aggressive') {
        score += 8;
        reasons.push('High risk tolerance');
      } else if (riskProfile.riskLevel === 'Moderate') {
        score += 6;
        reasons.push('Moderate risk tolerance');
      } else {
        score += 3;
        reasons.push('Conservative approach');
      }
      if (clientData.investmentValue < clientData.totalAssets * 0.3) {
        score += 4;
        reasons.push('Low investment allocation');
      }
      break;

    case 'Insurance':
      if (clientData.insuranceValue < clientData.monthlyIncome * 12) {
        score += 8;
        reasons.push('Insufficient insurance coverage');
      }
      if (clientData.age > 40) {
        score += 4;
        reasons.push('Age-related insurance needs');
      }
      break;

    case 'Credit':
      if (clientData.creditUtilization > 70) {
        score += 6;
        reasons.push('High credit utilization');
      }
      if (clientData.monthlyIncome > 5000 && clientData.creditUtilization < 30) {
        score += 4;
        reasons.push('Good credit profile');
      }
      break;

    case 'Islamic':
      // Islamic products are suitable for clients who prefer Shariah-compliant options
      // or have religious preferences
      score += 6;
      reasons.push('Shariah-compliant option');
      if (clientData.emergencyFundRatio < 100) {
        score += 2;
        reasons.push('Islamic savings for emergency fund');
      }
      if (clientData.investmentValue < clientData.totalAssets * 0.3) {
        score += 2;
        reasons.push('Islamic investment opportunities');
      }
      break;
  }

  // Adjust score based on client's financial capacity
  if (clientData.netCashFlow > 3000) {
    score += 2;
    reasons.push('Strong cash flow');
  }

  if (clientData.totalAssets > 100000) {
    score += 2;
    reasons.push('High net worth');
  }

  // Normalize score to 0-10 scale
  score = Math.min(10, Math.max(0, score));

  return {
    score,
    reasons,
    suitability: score >= 8 ? 'High' : score >= 5 ? 'Medium' : 'Low'
  };
};

// Generate personalized product recommendations
export const generatePersonalizedRecommendations = (clientData, productCatalog) => {
  const riskProfile = calculateRiskProfile(clientData);
  const investmentProfile = calculateInvestmentProfile(clientData);
  const recommendations = [];

  // Flatten product catalog
  const allProducts = Object.values(productCatalog).flat();

  // Score each product
  allProducts.forEach(product => {
    const suitability = calculateProductSuitability(product, clientData, riskProfile);
    
    if (suitability.score >= 5) {
      recommendations.push({
        ...product,
        suitability: suitability.suitability,
        score: suitability.score,
        reasons: suitability.reasons,
        priority: suitability.score >= 8 ? 'High' : suitability.score >= 6 ? 'Medium' : 'Low'
      });
    }
  });

  // Sort by score and add reasoning
  return recommendations
    .sort((a, b) => b.score - a.score)
    .map(rec => ({
      ...rec,
      reasoning: generateReasoning(rec, clientData, riskProfile, investmentProfile)
    }));
};

// Generate personalized reasoning for each recommendation
export const generateReasoning = (product, clientData, riskProfile, investmentProfile) => {
  const { age, monthlyIncome, totalAssets, emergencyFundRatio, creditUtilization } = clientData;

  switch (product.type) {
    case 'Savings':
      if (emergencyFundRatio < 100) {
        return `Your emergency fund covers only ${Math.round(emergencyFundRatio)}% of 3-month expenses. A high-yield savings account can help build your emergency fund faster.`;
      }
      return `You have strong cash flow and can benefit from higher interest rates on your savings.`;

    case 'Investment':
      if (investmentProfile.type === 'New') {
        return `As a new investor, starting with index funds provides diversification and professional management.`;
      }
      return `Your ${riskProfile.riskLevel.toLowerCase()} risk profile and age ${age} make this suitable for your investment goals.`;

    case 'Insurance':
      if (clientData.insuranceValue < monthlyIncome * 12) {
        return `Your insurance coverage (RM${clientData.insuranceValue.toLocaleString()}) is less than your annual income. Consider term life insurance for family protection.`;
      }
      return `At age ${age}, ensuring adequate insurance coverage is important for financial security.`;

    case 'Credit':
      if (creditUtilization > 70) {
        return `Your credit utilization is ${Math.round(creditUtilization)}%, which is high. A personal loan could help consolidate debt at lower rates.`;
      }
      return `With good income and low credit utilization, you qualify for premium credit cards with rewards and benefits.`;

    case 'Islamic':
      if (emergencyFundRatio < 100) {
        return `Your emergency fund covers only ${Math.round(emergencyFundRatio)}% of 3-month expenses. Islamic savings accounts provide Shariah-compliant options for building your emergency fund.`;
      }
      return `Islamic banking products offer Shariah-compliant alternatives that align with Islamic financial principles while providing competitive returns.`;

    default:
      return `This product aligns with your financial profile and goals.`;
  }
};

// Calculate estimated value for recommendations
export const calculateEstimatedValue = (product, clientData) => {
  const { monthlyIncome, monthlyExpenses, totalAssets, casaBalance } = clientData;
  const netCashFlow = monthlyIncome - monthlyExpenses;

  switch (product.type) {
    case 'Savings':
      if (clientData.emergencyFundRatio < 100) {
        return Math.max(5000, monthlyExpenses * 3 - clientData.current_emergency_fund);
      }
      return Math.min(casaBalance * 0.3, netCashFlow * 6);

    case 'Investment':
      if (casaBalance > 10000) {
        return Math.min(casaBalance * 0.5, 20000);
      }
      return Math.max(5000, netCashFlow * 12);

    case 'Insurance':
      return Math.max(monthlyIncome * 12, 200000);

    case 'Credit':
      if (clientData.creditUtilization > 70) {
        return clientData.totalLiabilities;
      }
      return 10000;

    case 'Islamic':
      if (clientData.emergencyFundRatio < 100) {
        return Math.max(5000, clientData.monthlyExpenses * 3 - clientData.current_emergency_fund);
      }
      return Math.min(clientData.casaBalance * 0.3, clientData.netCashFlow * 6);

    default:
      return 5000;
  }
};

// Format currency for display
export const formatCurrency = (amount, currency = 'RM') => {
  if (typeof amount !== 'number') return 'N/A';
  return `${currency}${amount.toLocaleString()}`;
};

// Format percentage for display
export const formatPercentage = (value) => {
  if (typeof value !== 'number') return 'N/A';
  return `${value.toFixed(1)}%`;
}; 