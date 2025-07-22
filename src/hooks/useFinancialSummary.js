import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useFinancialSummary = (nric) => {
  const [financialData, setFinancialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialSummary = async () => {
      if (!nric) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch data from new database structure
        const [
          clientResult,
          calculatedResult,
          manualResult,
          trendsResult
        ] = await Promise.all([
          // Client data
          supabase
            .from('clients')
            .select('*')
            .eq('nric', nric)
            .single(),

          // Calculated financial data
          supabase
            .from('calculated_financial_data')
            .select('*')
            .eq('client_nric', nric)
            .single(),

          // Manual input data
          supabase
            .from('manual_financial_inputs')
            .select('*')
            .eq('client_nric', nric)
            .single(),

          // Trend data (last 6 months)
          supabase
            .from('financial_trends_monthly')
            .select('*')
            .eq('client_nric', nric)
            .order('month_year', { ascending: false })
            .limit(6)
        ]);

        // Check for errors (ignore "no rows returned" errors as they're expected for new clients)
        const errors = [
          clientResult.error,
          calculatedResult.error,
          manualResult.error,
          trendsResult.error
        ].filter(error => error && error.code !== 'PGRST116'); // PGRST116 = no rows returned

        if (errors.length > 0) {
          throw new Error(`Database errors: ${errors.map(e => e.message).join(', ')}`);
        }

        // Process the data (handle cases where data doesn't exist yet)
        const client = clientResult.data || {
          relationship_tier: 'Standard',
          credit_score: null,
          dsr_ratio: null
        };

        const calculated = calculatedResult.data || {
          total_assets: 0,
          total_liabilities: 0,
          net_position: 0,
          total_portfolio_value: 0,
          utilization_rate: 0,
          asset_utilization_rate: 0,
          emergency_fund_ratio: 0,
          average_monthly_casa: 0,
          casa_peak_month: 0,
          profitability_score: 0
        };

        const manual = manualResult.data || {
          casa_balance: 0,
          fixed_deposit_amount: 0,
          investment_portfolio_value: 0,
          insurance_value: 0,
          monthly_inflow: 0,
          monthly_outflow: 0,
          three_month_expenses: 0,
          current_emergency_fund: 0,
          loan_outstanding_balance: 0,
          credit_card_limit: 0,
          credit_card_used_amount: 0,
          overdraft_limit: 0,
          overdraft_used_amount: 0,
          product_holdings: []
        };

        const trends = trendsResult.data || [];

        // Process product holdings from manual data
        const productHoldings = manual.product_holdings || [];

        // Process financial trends for chart
        const processedTrends = trends.length > 0 ? trends.reverse().map(t => ({
          month: t.month_year,
          assets: t.total_assets || calculated.total_assets,
          liabilities: t.total_liabilities || calculated.total_liabilities,
          casa: t.casa_balance || manual.casa_balance
        })) : [
          { month: '2024-01', assets: calculated.total_assets, liabilities: calculated.total_liabilities, casa: manual.casa_balance },
          { month: '2024-02', assets: calculated.total_assets, liabilities: calculated.total_liabilities, casa: manual.casa_balance },
          { month: '2024-03', assets: calculated.total_assets, liabilities: calculated.total_liabilities, casa: manual.casa_balance },
          { month: '2024-04', assets: calculated.total_assets, liabilities: calculated.total_liabilities, casa: manual.casa_balance },
          { month: '2024-05', assets: calculated.total_assets, liabilities: calculated.total_liabilities, casa: manual.casa_balance },
          { month: '2024-06', assets: calculated.total_assets, liabilities: calculated.total_liabilities, casa: manual.casa_balance }
        ];

        // Calculate monthly cash flow
        const monthlyCashFlow = {
          inflow: manual.monthly_inflow || 0,
          outflow: manual.monthly_outflow || 0,
          netFlow: (manual.monthly_inflow || 0) - (manual.monthly_outflow || 0)
        };

        // Process risk indicators based on calculated data
        const riskIndicators = [
          {
            type: 'Credit Utilization',
            status: calculated.utilization_rate > 80 ? 'High' : calculated.utilization_rate > 60 ? 'Medium' : 'Low',
            severity: calculated.utilization_rate > 80 ? 'high' : calculated.utilization_rate > 60 ? 'medium' : 'low'
          },
          {
            type: 'Emergency Fund Ratio',
            status: calculated.emergency_fund_ratio > 6 ? 'Excellent' : calculated.emergency_fund_ratio > 3 ? 'Good' : 'Low',
            severity: calculated.emergency_fund_ratio > 6 ? 'low' : calculated.emergency_fund_ratio > 3 ? 'medium' : 'high'
          },
          {
            type: 'DSR Ratio',
            status: client.dsr_ratio > 70 ? 'High' : client.dsr_ratio > 50 ? 'Medium' : 'Low',
            severity: client.dsr_ratio > 70 ? 'high' : client.dsr_ratio > 50 ? 'medium' : 'low'
          },
          {
            type: 'Asset Utilization',
            status: calculated.asset_utilization_rate > 80 ? 'High' : calculated.asset_utilization_rate > 60 ? 'Medium' : 'Low',
            severity: calculated.asset_utilization_rate > 80 ? 'low' : calculated.asset_utilization_rate > 60 ? 'medium' : 'high'
          }
        ];

        // Calculate credit utilization rate
        const creditUtilizationRate = manual.credit_card_limit > 0 ? 
          (manual.credit_card_used_amount / manual.credit_card_limit) * 100 : 0;

        // Combine all data
        const combinedData = {
          // Key financial metrics
          totalAssets: calculated.total_assets,
          totalLiabilities: calculated.total_liabilities,
          netPosition: calculated.net_position,
          totalPortfolioValue: calculated.total_portfolio_value,
          
          // Monthly cash flow
          monthlyCashFlow,

          // Product holdings
          productHoldings,

          // Relationship and profitability
          relationshipTier: client.relationship_tier || 'Standard',
          profitabilityScore: calculated.profitability_score || 0,
          customerLifetimeValue: calculated.profitability_score ? calculated.profitability_score * 10000 : 0,
          creditScore: client.credit_score,

          // Credit utilization
          creditUtilization: {
            utilizationRate: creditUtilizationRate,
            usedAmount: manual.credit_card_used_amount || 0,
            totalLimit: manual.credit_card_limit || 0,
            dsrRatio: client.dsr_ratio || 0
          },

          // Risk indicators
          riskIndicators,

          // Financial trends
          financialTrends: {
            months: processedTrends.map(t => t.month),
            assets: processedTrends.map(t => t.assets),
            liabilities: processedTrends.map(t => t.liabilities),
            casa: processedTrends.map(t => t.casa)
          },

          // Additional calculated fields
          assetUtilization: calculated.asset_utilization_rate,
          emergencyFundRatio: calculated.emergency_fund_ratio,
          avgMonthlyCasa: calculated.average_monthly_casa,
          casaPeakMonth: calculated.casa_peak_month,
          casaBalance: manual.casa_balance,
          
          // Emergency fund details
          emergencyFund: {
            current: manual.current_emergency_fund,
            threeMonthExpenses: manual.three_month_expenses,
            ratio: calculated.emergency_fund_ratio
          },

          // Asset breakdown
          assetBreakdown: {
            casa: manual.casa_balance,
            fixedDeposits: manual.fixed_deposit_amount,
            investments: manual.investment_portfolio_value,
            insurance: manual.insurance_value
          }
        };

        setFinancialData(combinedData);
      } catch (err) {
        console.error('Error fetching financial summary:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialSummary();
  }, [nric]);

  return {
    financialData,
    isLoading,
    error
  };
}; 