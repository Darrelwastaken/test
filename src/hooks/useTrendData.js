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

        // Fetch trend data from the unified financial_trends_monthly table
        const trendResult = await supabase
          .from('financial_trends_monthly')
          .select('*')
          .eq('client_nric', clientNric)
          .order('month_year', { ascending: true });

        // Process the data - create mock data for different trend types since we only have one table
        const trendData = trendResult.data || [];
        const processedData = {
          casa: trendData.map(item => ({
            month_year: item.month_year,
            total_amount: item.casa,
            transactions_count: 0,
            deposits_amount: item.casa * 0.6,
            withdrawals_amount: item.casa * 0.4,
            average_transaction: item.casa / 10
          })),
          cards: trendData.map(item => ({
            month_year: item.month_year,
            total_spending: item.cards, // Use the new cards column
            transactions_count: 0,
            total_payments: item.cards * 0.8, // Example: 80% of card spending paid
            average_spending: item.cards / 10, // Example: average per transaction
            credit_utilization_rate: 0 // Set to 0 or calculate if you have a field
          })),
          investments: trendData.map(item => ({
            month_year: item.month_year,
            portfolio_value: item.investments, // Use the new investments column
            transactions_count: 0,
            total_invested: item.investments * 0.8, // Example: 80% invested
            total_withdrawn: item.investments * 0.2, // Example: 20% withdrawn
            net_investment: item.investments, // Net = total
            return_rate: 0.05 // Example static return rate
          })),
          loans: trendData.map(item => ({
            month_year: item.month_year,
            outstanding_balance: item.loans, // Use the new loans column
            transactions_count: 0,
            total_borrowed: item.loans * 1.2, // Example: 120% borrowed
            total_repaid: item.loans * 0.2, // Example: 20% repaid
            interest_paid: item.loans * 0.05, // Example: 5% interest
            loan_utilization_rate: 0 // Set to 0 or calculate if you have a field
          }))
        };

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