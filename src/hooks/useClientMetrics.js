import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const useClientMetrics = (clientId) => {
  // Client Information States
  const [client, setClient] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientStatus, setClientStatus] = useState('');
  const [clientRiskProfile, setClientRiskProfile] = useState('');
  const [clientNationality, setClientNationality] = useState('');
  const [clientGender, setClientGender] = useState('');
  const [clientMaritalStatus, setClientMaritalStatus] = useState('');
  const [clientEmploymentStatus, setClientEmploymentStatus] = useState('');

  // New Data Structure States
  const [manual, setManual] = useState(null);
  const [calculated, setCalculated] = useState(null);
  const [behavioral, setBehavioral] = useState(null);
  const [trends, setTrends] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Loading and Error States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load client data and extract metrics from Supabase
  useEffect(() => {
    const loadClientData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Loading data for client:', clientId);

        // Add a small delay to prevent rapid requests
        await new Promise(resolve => setTimeout(resolve, 100));

        // Fetch client data with retry
        let clientData, clientError;
        let retryCount = 0;
        const maxRetries = 3;
        
        const fetchClientWithRetry = async () => {
          try {
            const result = await supabase
              .from('clients')
              .select('*')
              .eq('nric', clientId)
              .single();
            
            return { data: result.data, error: result.error };
          } catch (err) {
            return { data: null, error: err };
          }
        };
        
        while (retryCount < maxRetries) {
          const result = await fetchClientWithRetry();
          clientData = result.data;
          clientError = result.error;
          
          if (!clientError) {
            break;
          }
          
          retryCount++;
          if (retryCount >= maxRetries) {
            break;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }

        console.log('Client data response:', { clientData, clientError });

        if (clientError) {
          console.error('Client error:', clientError);
          if (clientError.code === 'PGRST116') {
            setError(`Client with NRIC ${clientId} not found. Please check the client ID.`);
          } else {
            setError(`Client not found: ${clientError.message}`);
          }
          setIsLoading(false);
          return;
        }

        if (!clientData) {
          setError('Client not found');
          setIsLoading(false);
          return;
        }

        // Set client basic information
        setClient(clientData);
        setClientName(clientData.name || '');
        setClientEmail(clientData.email || '');
        setClientStatus(clientData.status || '');
        setClientRiskProfile(clientData.risk_profile || '');
        setClientNationality(clientData.nationality || '');
        setClientGender(clientData.gender || '');
        setClientMaritalStatus(clientData.marital_status || '');
        setClientEmploymentStatus(clientData.employment_status || '');

        // Fetch all data in parallel for better performance
        console.log('Fetching new database structure data for:', clientId);
        
        const [
          manualResult,
          calculatedResult,
          behavioralResult,
          trendsResult,
          transactionsResult
        ] = await Promise.all([
          // Manual input data
          supabase
            .from('manual_financial_inputs')
            .select('*')
            .eq('client_nric', clientId)
            .single(),

          // Calculated financial data
          supabase
            .from('calculated_financial_data')
            .select('*')
            .eq('client_nric', clientId)
            .single(),

          // Transaction behavioral data
          supabase
            .from('transaction_behavioral_data')
            .select('*')
            .eq('client_nric', clientId)
            .single(),

          // Trend data
          supabase
            .from('financial_trends_monthly')
            .select('*')
            .eq('client_nric', clientId)
            .order('month_year', { ascending: false })
            .limit(12),

          // Transactions data
          supabase
            .from('transactions')
            .select('*')
            .eq('client_nric', clientId)
            .order('transaction_date', { ascending: false })
        ]);

        console.log('New database structure responses:', {
          manual: manualResult,
          calculated: calculatedResult,
          behavioral: behavioralResult,
          trends: trendsResult,
          transactions: transactionsResult
        });

        // Process manual input data
        if (!manualResult.error && manualResult.data) {
          setManual(manualResult.data);
        } else if (manualResult.error && manualResult.error.code !== 'PGRST116') {
          console.error('Manual data error:', manualResult.error);
        }

        // Process calculated financial data
        if (!calculatedResult.error && calculatedResult.data) {
          setCalculated(calculatedResult.data);
        } else if (calculatedResult.error && calculatedResult.error.code !== 'PGRST116') {
          console.error('Calculated data error:', calculatedResult.error);
        }

        // Process transaction behavioral data
        if (!behavioralResult.error && behavioralResult.data) {
          setBehavioral(behavioralResult.data);
        } else if (behavioralResult.error && behavioralResult.error.code !== 'PGRST116') {
          console.error('Behavioral data error:', behavioralResult.error);
        }

        // Process trend data
        if (!trendsResult.error && trendsResult.data) {
          setTrends(trendsResult.data);
        } else if (trendsResult.error && trendsResult.error.code !== 'PGRST116') {
          console.error('Trends data error:', trendsResult.error);
        }

        // Process transactions data
        if (!transactionsResult.error && transactionsResult.data) {
          setTransactions(transactionsResult.data);
          console.log('Loaded transactions:', transactionsResult.data.length, 'transactions');
        } else if (transactionsResult.error && transactionsResult.error.code !== 'PGRST116') {
          console.error('Transactions data error:', transactionsResult.error);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading client data:', err);
        setError(`Error loading client data: ${err.message}`);
        setIsLoading(false);
      }
    };

    if (clientId) {
      loadClientData();
    }
  }, [clientId, refreshTrigger]);

  // Refresh function to refetch data with debouncing
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Return all states and functions
  return {
    // Client Information
    client,
    clientName,
    clientEmail,
    clientStatus,
    clientRiskProfile,
    clientNationality,
    clientGender,
    clientMaritalStatus,
    clientEmploymentStatus,

    // New Data Structure
    manual,
    calculated,
    behavioral,
    trends,
    transactions,

    // Loading and Error States
    isLoading,
    error,

    // Functions
    refreshData
  };
}; 