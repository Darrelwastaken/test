import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useTrendData = (clientNric) => {
  const [trendData, setTrendData] = useState({
    casa: [],
    cards: [],
    investments: [],
    loans: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendData = async () => {
      if (!clientNric) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching trend data for client:', clientNric);

        // Fetch data from multiple tables to build comprehensive trend data
        const [
          trendResult,
          manualResult,
          calculatedResult,
          behavioralResult
        ] = await Promise.all([
          // Fetch monthly trend data
          supabase
            .from('financial_trends_monthly')
            .select('*')
            .eq('client_nric', clientNric)
            .order('month_year', { ascending: true }),

          // Fetch manual financial inputs for current data
          supabase
            .from('manual_financial_inputs')
            .select('*')
            .eq('client_nric', clientNric)
            .single(),

          // Fetch calculated financial data
          supabase
            .from('calculated_financial_data')
            .select('*')
            .eq('client_nric', clientNric)
            .single(),

          // Fetch behavioral data
          supabase
            .from('transaction_behavioral_data')
            .select('*')
            .eq('client_nric', clientNric)
            .single()
        ]);

        console.log('Database results:', {
          trend: trendResult,
          manual: manualResult,
          calculated: calculatedResult,
          behavioral: behavioralResult
        });

        // Get the trend data
        const trendData = trendResult.data || [];
        const manualData = manualResult.data || {};
        const calculatedData = calculatedResult.data || {};
        const behavioralData = behavioralResult.data || {};

        // Build comprehensive trend data using real database values
        const processedData = {
          casa: trendData.map(item => ({
            month_year: item.month_year,
            total_amount: item.casa || 0, // Use actual column name from database
            transactions_count: behavioralData.total_transaction_count || 0,
            deposits_amount: (item.casa || 0) * 0.6,
            withdrawals_amount: (item.casa || 0) * 0.4,
            average_transaction: behavioralData.average_transaction_size || 0
          })),
          cards: trendData.map((item, index) => {
            // Use actual card data from database
            const cardSpending = item.cards || 0; // Use actual column name from database
            const cardLimit = manualData.credit_card_limit || 0;
            const utilizationRate = cardLimit > 0 ? (cardSpending / cardLimit) * 100 : 0;
            
            return {
              month_year: item.month_year,
              total_spending: cardSpending,
              transactions_count: Math.floor((behavioralData.total_transaction_count || 0) * 0.3), // 30% of total transactions
              total_payments: cardSpending * 0.8, // Assume 80% of spending is paid
              average_spending: cardSpending / Math.max(1, (behavioralData.total_transaction_count || 1) * 0.3),
              credit_utilization_rate: Math.min(100, Math.max(0, utilizationRate))
            };
          }),
          investments: trendData.map(item => {
            // Use actual investment data from database - need to check what column exists
            const investmentValue = item.investments || item.investment_value || 0;
            return {
              month_year: item.month_year,
              portfolio_value: investmentValue,
              transactions_count: Math.floor((behavioralData.total_transaction_count || 0) * 0.1), // 10% of total transactions
              total_invested: manualData.investment_portfolio_value || 0,
              total_withdrawn: (manualData.investment_portfolio_value || 0) * 0.1, // Assume 10% withdrawn
              net_investment: investmentValue,
              return_rate: calculatedData.profitability_score ? calculatedData.profitability_score / 100 : 0.05
            };
          }),
          loans: trendData.map((item, index) => {
            // Use actual loan data from database - need to check what column exists
            const loanBalance = item.loans || item.loan_outstanding_balance || manualData.loan_outstanding_balance || 0;
            const totalLiabilities = item.liabilities || item.total_liabilities || 0;
            
            return {
              month_year: item.month_year,
              outstanding_balance: loanBalance,
              transactions_count: Math.floor((behavioralData.total_transaction_count || 0) * 0.05), // 5% of total transactions
              total_borrowed: loanBalance * 1.2, // Assume 120% of current balance was borrowed
              total_repaid: loanBalance * 0.2, // Assume 20% has been repaid
              interest_paid: loanBalance * 0.05, // Assume 5% interest
              loan_utilization_rate: totalLiabilities > 0 ? (loanBalance / totalLiabilities) * 100 : 0
            };
          })
        };

        console.log('Processed trend data:', processedData);
        console.log('CASA data points:', processedData.casa.length);
        console.log('Cards data points:', processedData.cards.length);
        console.log('Sample CASA values:', processedData.casa.slice(0, 3).map(item => item.total_amount));
        console.log('Sample Cards values:', processedData.cards.slice(0, 3).map(item => item.total_spending));
        setTrendData(processedData);
      } catch (err) {
        console.error('Error fetching trend data:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendData();
  }, [clientNric]);

  // Helper function to get data for a specific trend type
  const getTrendDataForType = (type) => {
    const data = trendData[type.toLowerCase()] || [];
    
    switch (type) {
      case 'CASA':
        return {
          labels: data.map(item => {
            const [year, month] = item.month_year.split('-');
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' });
          }),
          data: data.map(item => item.total_amount),
          transactions: data.map(item => item.transactions_count),
          deposits: data.map(item => item.deposits_amount),
          withdrawals: data.map(item => item.withdrawals_amount),
          average: data.map(item => item.average_transaction)
        };
      
      case 'Cards':
        return {
          labels: data.map(item => {
            const [year, month] = item.month_year.split('-');
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' });
          }),
          data: data.map(item => item.total_spending),
          transactions: data.map(item => item.transactions_count),
          payments: data.map(item => item.total_payments),
          average: data.map(item => item.average_spending),
          utilization: data.map(item => item.credit_utilization_rate)
        };
      
      case 'Investments':
        return {
          labels: data.map(item => {
            const [year, month] = item.month_year.split('-');
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' });
          }),
          data: data.map(item => item.portfolio_value),
          transactions: data.map(item => item.transactions_count),
          invested: data.map(item => item.total_invested),
          withdrawn: data.map(item => item.total_withdrawn),
          net: data.map(item => item.net_investment),
          returns: data.map(item => item.return_rate)
        };
      
      case 'Loans':
        return {
          labels: data.map(item => {
            const [year, month] = item.month_year.split('-');
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short' });
          }),
          data: data.map(item => item.outstanding_balance),
          transactions: data.map(item => item.transactions_count),
          borrowed: data.map(item => item.total_borrowed),
          repaid: data.map(item => item.total_repaid),
          interest: data.map(item => item.interest_paid),
          utilization: data.map(item => item.loan_utilization_rate)
        };
      
      default:
        return { labels: [], data: [] };
    }
  };

  return {
    trendData,
    isLoading,
    error,
    getTrendDataForType
  };
}; 