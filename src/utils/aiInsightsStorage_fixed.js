import { supabase } from '../supabaseClient';
import { analyzeClientWithGemini } from './aiAnalyzer.js';

// Generate a comprehensive hash for data versioning
function generateDataHash(clientData) {
  // Extract all relevant data that would affect AI insights
  const dataToHash = {
    // Basic client info
    nric: clientData?.nric,
    name: clientData?.name,
    riskProfile: clientData?.riskProfile || clientData?.client?.riskProfile,
    status: clientData?.status || clientData?.client?.status,
    creditScore: clientData?.credit_score || clientData?.client?.creditScore,
    dsrRatio: clientData?.dsr_ratio || clientData?.client?.dsrRatio,
    
    // Financial data
    netWorth: clientData?.net_worth || clientData?.financial?.netWorth,
    totalAssets: clientData?.total_assets || clientData?.dashboard?.assets,
    totalLiabilities: clientData?.total_liabilities || 0,
    monthlyIncome: clientData?.monthly_income || clientData?.dashboard?.cashflow,
    
    // Account balances
    casaBalance: clientData?.casa_balance || clientData?.dashboard?.accountBalances?.casa,
    fdBalance: clientData?.fd_balance || clientData?.dashboard?.accountBalances?.fd,
    loansBalance: clientData?.loans_balance || clientData?.dashboard?.accountBalances?.loans,
    cardsBalance: clientData?.cards_balance || clientData?.dashboard?.accountBalances?.cards,
    
    // Investment data
    investmentValue: clientData?.total_investment_value || 0,
    investmentDiversity: clientData?.investment_diversity || 0,
    holdingsCount: clientData?.investments?.holdings?.length || 0,
    
    // Transaction data
    transactionCount: clientData?.transactions?.length || 0,
    totalSpent: clientData?.transactions ? clientData.transactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0) : 0,
    
    // Behavioral data
    transactionFrequency: clientData?.transaction_frequency || 0,
    averageTransactionAmount: clientData?.average_transaction_amount || 0,
    
    // Risk indicators
    assetUtilization: clientData?.asset_utilization || clientData?.financial?.assetUtilization,
    emergencyFundRatio: clientData?.emergency_fund_ratio || 0,
    cashflowStability: clientData?.cashflow_stability || 0
  };
  
  const dataString = JSON.stringify(dataToHash);
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
}

// Get AI insights from database
export async function getAIInsights(clientNric) {
  try {
    const { data, error } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('client_nric', clientNric)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching AI insights:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getAIInsights:', error);
    return null;
  }
}

// Save AI insights to database
export async function saveAIInsights(clientNric, insights, summary, clientData) {
  try {
    const dataHash = generateDataHash(clientData);
    
    const { data, error } = await supabase
      .from('ai_insights')
      .upsert({
        client_nric: clientNric,
        insights: insights,
        summary: summary,
        data_version: dataHash,
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'client_nric'
      });

    if (error) {
      console.error('Error saving AI insights:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveAIInsights:', error);
    return false;
  }
}

// Check if insights need to be regenerated
export async function shouldRegenerateInsights(clientNric, clientData) {
  try {
    const existingInsights = await getAIInsights(clientNric);
    
    if (!existingInsights) {
      console.log(`No existing insights found for client ${clientNric} - will generate new insights`);
      return true; // No insights exist, need to generate
    }

    const currentDataHash = generateDataHash(clientData);
    const storedDataHash = existingInsights.data_version;

    console.log(`Data hash comparison for client ${clientNric}:`, {
      current: currentDataHash,
      stored: storedDataHash,
      needsRegeneration: currentDataHash !== storedDataHash
    });

    // Regenerate if data has changed
    return currentDataHash !== storedDataHash;
  } catch (error) {
    console.error('Error in shouldRegenerateInsights:', error);
    return true; // Regenerate on error to be safe
  }
}

  // Generate and save AI insights
export async function generateAndSaveInsights(clientData) {
  try {
    const { nric } = clientData;
    if (!nric) {
      throw new Error('Client NRIC is required');
    }

    // Check if we need to regenerate insights
    const needsRegeneration = await shouldRegenerateInsights(nric, clientData);
    
    if (!needsRegeneration) {
      // Return existing insights
      console.log(`Using cached AI insights for client ${nric}`);
      const existingInsights = await getAIInsights(nric);
      return {
        insights: existingInsights.insights,
        summary: existingInsights.summary,
        generatedAt: existingInsights.last_updated
      };
    }
    
    console.log(`Generating new AI insights for client ${nric} - data has changed`);

    // Generate new insights using our improved banking-focused analyzer
    const result = await analyzeClientWithGemini(clientData, clientData.transactions);
    
    // Save to database
    const saveSuccess = await saveAIInsights(nric, result.insights, result.summary, clientData);
    
    if (!saveSuccess) {
      console.warn('Failed to save AI insights to database');
    }

    return {
      insights: result.insights,
      summary: result.summary,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in generateAndSaveInsights:', error);
    throw error;
  }
}

// Force regenerate insights (for manual refresh)
export async function forceRegenerateInsights(clientData) {
  try {
    const { nric } = clientData;
    if (!nric) {
      throw new Error('Client NRIC is required');
    }

    // Generate new insights using our improved banking-focused analyzer
    const result = await analyzeClientWithGemini(clientData, clientData.transactions);
    
    // Save to database
    const saveSuccess = await saveAIInsights(nric, result.insights, result.summary, clientData);
    
    if (!saveSuccess) {
      console.warn('Failed to save AI insights to database');
    }

    return {
      insights: result.insights,
      summary: result.summary,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in forceRegenerateInsights:', error);
    throw error;
  }
}

// Delete AI insights for a client
export async function deleteAIInsights(clientNric) {
  try {
    const { error } = await supabase
      .from('ai_insights')
      .delete()
      .eq('client_nric', clientNric);

    if (error) {
      console.error('Error deleting AI insights:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAIInsights:', error);
    return false;
  }
}

// Clear cache and force regeneration for a client
export async function clearCacheAndRegenerate(clientData) {
  try {
    const { nric } = clientData;
    if (!nric) {
      throw new Error('Client NRIC is required');
    }

    console.log(`Clearing cache and regenerating AI insights for client ${nric}`);
    
    // Delete existing insights
    await deleteAIInsights(nric);
    
    // Generate new insights using our improved banking-focused analyzer
    const result = await analyzeClientWithGemini(clientData, clientData.transactions);
    
    // Save to database
    const saveSuccess = await saveAIInsights(nric, result.insights, result.summary, clientData);
    
    if (!saveSuccess) {
      console.warn('Failed to save AI insights to database');
    }

    return {
      insights: result.insights,
      summary: result.summary,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in clearCacheAndRegenerate:', error);
    throw error;
  }
} 
