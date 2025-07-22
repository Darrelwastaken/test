import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { supabase } from './supabaseClient';
import { useClientMetrics } from './hooks/useClientMetrics';
import { useFinancialSummary } from './hooks/useFinancialSummary';

function validateNRIC(nric) {
  // Malaysian NRIC: 6 digits - 2 digits - 4 digits
  return /^\d{6}-\d{2}-\d{4}$/.test(nric);
}

// Utility for NRIC formatting
function formatNRICInput(value) {
  let digits = value.replace(/\D/g, '');
  if (digits.length > 12) digits = digits.slice(0, 12);
  let formatted = digits;
  if (digits.length > 6) {
    formatted = digits.slice(0, 6) + '-' + digits.slice(6);
  }
  if (digits.length > 8) {
    formatted = formatted.slice(0, 9) + '-' + formatted.slice(9);
  }
  return formatted;
}

export default function EditClientInfo() {
  const { nric: paramNric } = useParams();
  const navigate = useNavigate();
  
  // Use the custom hook to get all metrics
  const {
    client,
    clientName,
    clientEmail,
    clientStatus,
    clientRiskProfile,
    dashboardAssets,
    dashboardCashflow,
    dashboardMonthlyCashflow,
    dashboardAccountBalances,
    dashboardTransactionsHeatmap,
    dashboardMonths,
    transactionCasaDeposits,
    transactionCasaWithdrawals,
    transactionCardSpending,
    transactionCardPayments,
    investmentsHoldings,
    liabilitiesList,
    creditLinesList,
    isLoading,
    error
  } = useClientMetrics(paramNric);

  // Get financial summary data
  const { data: financialSummaryData, isLoading: financialSummaryLoading, error: financialSummaryError } = useFinancialSummary(paramNric);

  // Form state
  const [formData, setFormData] = useState({
    nric: '',
    name: '',
    email: '',
    status: '',
    risk_profile: '',
    nationality: '',
    gender: '',
    marital_status: '',
    employment_status: '',
    
    // Dashboard metrics
    assets: 0,
    cashflow: 0,
    monthly_cashflow: [],
    account_balances: { casa: 0, fd: 0, loans: 0, cards: 0 },
    transactions_heatmap: [],
    months: [],
    

    
    // New Financial Summary Tables
    // Financial assets
    total_assets: 0,
    total_liabilities: 0,
    net_position: 0,
    casa_balance: 0,
    fixed_deposits: 0,
    investment_funds: 0,
    insurance_policies: 0,
    other_assets: 0,
    
    // Monthly cash flow
    monthly_cashflow_data: [],
    
    // Product holdings
    product_holdings: [],
    
    // Relationship and profitability
    relationship_tier: 'Standard',
    profitability_score: 0,
    customer_lifetime_value: 0,
    
    // Credit utilization
    total_limit: 0,
    used_amount: 0,
    utilization_rate: 0,
    credit_health: 'Good',
    
    // Risk indicators
    risk_indicators: [],
    
    // Financial trends
    financial_trends: [],
    
    // Asset utilization
    utilization_percentage: 0,
    liquid_assets: 0,
    invested_assets: 0,
    
    // Emergency fund analysis
    emergency_fund_ratio: 0,
    three_month_expenses: 0,
    current_emergency_fund: 0,
    recommended_emergency_fund: 0,
    
    // Transaction behavior
    casa_deposits: [],
    casa_withdrawals: [],
    card_spending: [],
    card_payments: [],
    
    // Investments portfolio
    holdings: [],
    
    // Liabilities credit
    liabilities: [],
    credit_lines: [],
    
    // Trend Data
    casa_trend_data: [],
    cards_trend_data: [],
    investments_trend_data: [],
    loans_trend_data: []
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data when data loads
  useEffect(() => {
    if (!isLoading && !financialSummaryLoading && client) {
      setFormData({
        nric: client.nric || paramNric || '',
        name: clientName || '',
        email: clientEmail || '',
        status: clientStatus || '',
        risk_profile: clientRiskProfile || '',
        nationality: client.nationality || '',
        gender: client.gender || '',
        marital_status: client.marital_status || '',
        employment_status: client.employment_status || '',
      
        // Dashboard metrics
        assets: dashboardAssets || 0,
        cashflow: dashboardCashflow || 0,
        monthly_cashflow: dashboardMonthlyCashflow || [],
        account_balances: dashboardAccountBalances || { casa: 0, fd: 0, loans: 0, cards: 0 },
        transactions_heatmap: dashboardTransactionsHeatmap || [],
        months: dashboardMonths || [],
        

        
        // New Financial Summary Tables - Populated from useFinancialSummary hook
        total_assets: financialSummaryData?.totalAssets || 0,
        total_liabilities: financialSummaryData?.totalLiabilities || 0,
        net_position: financialSummaryData?.netPosition || 0,
        casa_balance: financialSummaryData?.monthlyCashFlow?.inflow || 0,
        fixed_deposits: financialSummaryData?.productHoldings?.find(h => h.name === 'Fixed Deposits')?.value || 0,
        investment_funds: financialSummaryData?.productHoldings?.find(h => h.name === 'Investment Funds')?.value || 0,
        insurance_policies: financialSummaryData?.productHoldings?.find(h => h.name === 'Insurance Policies')?.value || 0,
        other_assets: financialSummaryData?.totalAssets - (financialSummaryData?.monthlyCashFlow?.inflow || 0) - (financialSummaryData?.productHoldings?.find(h => h.name === 'Fixed Deposits')?.value || 0) - (financialSummaryData?.productHoldings?.find(h => h.name === 'Investment Funds')?.value || 0) - (financialSummaryData?.productHoldings?.find(h => h.name === 'Insurance Policies')?.value || 0) || 0,
        monthly_cashflow_data: financialSummaryData?.monthlyCashFlow ? [{
          month_year: '2024-12',
          inflow: financialSummaryData.monthlyCashFlow.inflow,
          outflow: financialSummaryData.monthlyCashFlow.outflow,
          net_flow: financialSummaryData.monthlyCashFlow.netFlow
        }] : [],
        product_holdings: financialSummaryData?.productHoldings?.map(h => ({
          product_name: h.name,
          product_type: h.name,
          count: h.count,
          value: h.value
        })) || [],
        relationship_tier: financialSummaryData?.relationshipTier || 'Standard',
        profitability_score: financialSummaryData?.profitabilityScore || 0,
        customer_lifetime_value: financialSummaryData?.customerLifetimeValue || 0,
        total_limit: financialSummaryData?.creditUtilization?.totalLimit || 0,
        used_amount: financialSummaryData?.creditUtilization?.usedAmount || 0,
        utilization_rate: financialSummaryData?.creditUtilization?.utilizationRate || 0,
        credit_health: financialSummaryData?.creditUtilization?.health || 'Good',
        risk_indicators: financialSummaryData?.riskIndicators?.map(r => ({
          indicator_type: r.type.toLowerCase().replace(' ', '_'),
          status: r.status,
          severity: r.severity,
          value: 0,
          threshold: 0
        })) || [],
        financial_trends: financialSummaryData?.financialTrends?.map(t => ({
          month: t.month,
          year: 2024,
          total_assets: t.assets,
          total_liabilities: t.liabilities,
          net_worth: t.assets - t.liabilities
        })) || [],
        utilization_percentage: financialSummaryData?.assetUtilization?.utilizationPercentage || 0,
        liquid_assets: financialSummaryData?.assetUtilization?.liquidAssets || 0,
        invested_assets: financialSummaryData?.assetUtilization?.investedAssets || 0,
        emergency_fund_ratio: financialSummaryData?.emergencyFundAnalysis?.ratio || 0,
        three_month_expenses: financialSummaryData?.emergencyFundAnalysis?.threeMonthExpenses || 0,
        current_emergency_fund: financialSummaryData?.emergencyFundAnalysis?.currentFund || 0,
        recommended_emergency_fund: financialSummaryData?.emergencyFundAnalysis?.recommendedFund || 0,
        
        // Transaction behavior
        casa_deposits: transactionCasaDeposits || [],
        casa_withdrawals: transactionCasaWithdrawals || [],
        card_spending: transactionCardSpending || [],
        card_payments: transactionCardPayments || [],
        
        // Investments portfolio
        holdings: investmentsHoldings || [],
        
        // Liabilities credit
        liabilities: liabilitiesList || [],
        credit_lines: creditLinesList || [],
        
        // Trend Data - Default values (will be populated by useTrendData hook)
        casa_trend_data: [],
        cards_trend_data: [],
        investments_trend_data: [],
        loans_trend_data: []
      });
    }
  }, [isLoading, financialSummaryLoading, client, clientName, clientEmail, clientStatus, clientRiskProfile, 
      dashboardAssets, dashboardCashflow, dashboardMonthlyCashflow, dashboardAccountBalances, 
      dashboardTransactionsHeatmap, dashboardMonths, 
      transactionCasaDeposits, transactionCasaWithdrawals, transactionCardSpending, 
      transactionCardPayments, investmentsHoldings, liabilitiesList, creditLinesList, 
      financialSummaryData, paramNric]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const handleObjectChange = (field, key, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value
      }
    }));
  };

  const addArrayItem = (field, defaultItem) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], defaultItem]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update client basic info
      await supabase
        .from('clients')
        .update({
          nric: formData.nric,
          name: formData.name,
          email: formData.email,
          status: formData.status,
          risk_profile: formData.risk_profile,
          nationality: formData.nationality,
          gender: formData.gender,
          marital_status: formData.marital_status,
          employment_status: formData.employment_status
        })
        .eq('nric', paramNric);

      // Update dashboard metrics
      await supabase
        .from('dashboard_metrics')
        .upsert({
          client_nric: formData.nric,
          assets: formData.assets,
          cashflow: formData.cashflow,
          monthly_cashflow: formData.monthly_cashflow,
          account_balances: formData.account_balances,
          transactions_heatmap: formData.transactions_heatmap,
          months: formData.months
        });



      // Update new financial summary tables
      
      // Financial assets
      await supabase
        .from('financial_assets')
        .upsert({
          client_nric: formData.nric,
          total_assets: formData.total_assets,
          total_liabilities: formData.total_liabilities,
          net_position: formData.net_position,
          casa_balance: formData.casa_balance,
          fixed_deposits: formData.fixed_deposits,
          investment_funds: formData.investment_funds,
          insurance_policies: formData.insurance_policies,
          other_assets: formData.other_assets
        });

      // Monthly cash flow
      if (formData.monthly_cashflow_data.length > 0) {
        await supabase
          .from('monthly_cashflow')
          .delete()
          .eq('client_nric', formData.nric);
        
        for (const cashflow of formData.monthly_cashflow_data) {
          await supabase
            .from('monthly_cashflow')
            .insert({
              client_nric: formData.nric,
              month_year: cashflow.month_year,
              inflow: cashflow.inflow,
              outflow: cashflow.outflow,
              net_flow: cashflow.net_flow
            });
        }
      }

      // Product holdings
      if (formData.product_holdings.length > 0) {
        await supabase
          .from('product_holdings')
          .delete()
          .eq('client_nric', formData.nric);
        
        for (const holding of formData.product_holdings) {
          await supabase
            .from('product_holdings')
            .insert({
              client_nric: formData.nric,
              product_name: holding.product_name,
              product_type: holding.product_type,
              count: holding.count,
              value: holding.value
            });
        }
      }

      // Relationship and profitability
      await supabase
        .from('relationship_profitability')
        .upsert({
          client_nric: formData.nric,
          relationship_tier: formData.relationship_tier,
          profitability_score: formData.profitability_score,
          customer_lifetime_value: formData.customer_lifetime_value
        });

      // Credit utilization
      await supabase
        .from('credit_utilization')
        .upsert({
          client_nric: formData.nric,
          total_limit: formData.total_limit,
          used_amount: formData.used_amount,
          utilization_rate: formData.utilization_rate,
          credit_health: formData.credit_health
        });

      // Risk indicators
      if (formData.risk_indicators.length > 0) {
        await supabase
          .from('risk_indicators')
          .delete()
          .eq('client_nric', formData.nric);
        
        for (const risk of formData.risk_indicators) {
          await supabase
            .from('risk_indicators')
            .insert({
              client_nric: formData.nric,
              indicator_type: risk.indicator_type,
              status: risk.status,
              severity: risk.severity,
              value: risk.value,
              threshold: risk.threshold
            });
        }
      }

      // Financial trends
      if (formData.financial_trends.length > 0) {
        await supabase
          .from('financial_trends')
          .delete()
          .eq('client_nric', formData.nric);
        
        for (const trend of formData.financial_trends) {
          await supabase
            .from('financial_trends')
            .insert({
              client_nric: formData.nric,
              month: trend.month,
              year: trend.year,
              total_assets: trend.total_assets,
              total_liabilities: trend.total_liabilities,
              net_worth: trend.net_worth
            });
        }
      }

      // Asset utilization
      await supabase
        .from('asset_utilization')
        .upsert({
          client_nric: formData.nric,
          utilization_percentage: formData.utilization_percentage,
          liquid_assets: formData.liquid_assets,
          invested_assets: formData.invested_assets,
          total_assets: formData.total_assets
        });

      // Emergency fund analysis
      await supabase
        .from('emergency_fund_analysis')
        .upsert({
          client_nric: formData.nric,
          emergency_fund_ratio: formData.emergency_fund_ratio,
          three_month_expenses: formData.three_month_expenses,
          current_emergency_fund: formData.current_emergency_fund,
          recommended_emergency_fund: formData.recommended_emergency_fund
        });

      // Update transaction behavior
      await supabase
        .from('transaction_behavior')
        .upsert({
          client_nric: formData.nric,
          casa_deposits: formData.casa_deposits,
          casa_withdrawals: formData.casa_withdrawals,
          card_spending: formData.card_spending,
          card_payments: formData.card_payments
        });

      // Update investments portfolio
      await supabase
        .from('investments_portfolio')
        .upsert({
          client_nric: formData.nric,
          holdings: formData.holdings
        });

      // Update liabilities credit
      await supabase
        .from('liabilities_credit')
        .upsert({
          client_nric: formData.nric,
          liabilities: formData.liabilities,
          credit_lines: formData.credit_lines
        });

      // Update trend data tables
      
      // CASA Trend Data
      if (formData.casa_trend_data.length > 0) {
        await supabase
          .from('casa_trend_data')
          .delete()
          .eq('client_nric', formData.nric);
        
        for (const trend of formData.casa_trend_data) {
          await supabase
            .from('casa_trend_data')
            .insert({
              client_nric: formData.nric,
              month_year: trend.month_year,
              transactions_count: trend.transactions_count,
              total_amount: trend.total_amount,
              deposits_amount: trend.deposits_amount,
              withdrawals_amount: trend.withdrawals_amount,
              average_transaction: trend.average_transaction
            });
        }
      }

      // Cards Trend Data
      if (formData.cards_trend_data.length > 0) {
        await supabase
          .from('cards_trend_data')
          .delete()
          .eq('client_nric', formData.nric);
        
        for (const trend of formData.cards_trend_data) {
          await supabase
            .from('cards_trend_data')
            .insert({
              client_nric: formData.nric,
              month_year: trend.month_year,
              transactions_count: trend.transactions_count,
              total_spending: trend.total_spending,
              total_payments: trend.total_payments,
              average_spending: trend.average_spending,
              credit_utilization_rate: trend.credit_utilization_rate
            });
        }
      }

      // Investments Trend Data
      if (formData.investments_trend_data.length > 0) {
        await supabase
          .from('investments_trend_data')
          .delete()
          .eq('client_nric', formData.nric);
        
        for (const trend of formData.investments_trend_data) {
          await supabase
            .from('investments_trend_data')
            .insert({
              client_nric: formData.nric,
              month_year: trend.month_year,
              transactions_count: trend.transactions_count,
              total_invested: trend.total_invested,
              total_withdrawn: trend.total_withdrawn,
              net_investment: trend.net_investment,
              portfolio_value: trend.portfolio_value,
              return_rate: trend.return_rate
            });
        }
      }

      // Loans Trend Data
      if (formData.loans_trend_data.length > 0) {
        await supabase
          .from('loans_trend_data')
          .delete()
          .eq('client_nric', formData.nric);
        
        for (const trend of formData.loans_trend_data) {
          await supabase
            .from('loans_trend_data')
            .insert({
              client_nric: formData.nric,
              month_year: trend.month_year,
              transactions_count: trend.transactions_count,
              total_borrowed: trend.total_borrowed,
              total_repaid: trend.total_repaid,
              outstanding_balance: trend.outstanding_balance,
              interest_paid: trend.interest_paid,
              loan_utilization_rate: trend.loan_utilization_rate
            });
        }
      }

      alert('Client information updated successfully!');
      navigate(-1, { state: { fromEdit: true } });
    } catch (error) {
      console.error('Error updating client:', error);
      alert('Error updating client information');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || financialSummaryLoading) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={paramNric} />
        <div style={{ padding: 32, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Loading Client Information...</div>
            <div style={{ color: '#6b7280' }}>Fetching client details for editing</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={paramNric} />
        <div style={{ padding: 32, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>Error Loading Client Information</div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>{error}</div>
            <button 
              style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={paramNric} />
        <div style={{ padding: 32, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#ef4444' }}>Client Not Found</div>
            <div style={{ color: '#6b7280', marginBottom: 24 }}>The client with NRIC {paramNric} could not be found.</div>
            <button 
              style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, cursor: 'pointer' }}
              onClick={() => navigate('/clients')}
            >
              Back to Client Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
      <Sidebar clientId={formData.nric} />
      <div style={{ padding: 32, marginLeft: 240, maxWidth: 1200 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Edit Client Info</div>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#e5e7eb',
              color: '#222',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Back
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Basic Info */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>NRIC</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="nric"
                    value={formData.nric}
                    readOnly
                    style={{ 
                      width: '100%', 
                      padding: '8px 32px 8px 8px', 
                      borderRadius: 8, 
                      border: '1px solid #e5e7eb', 
                      marginBottom: 0,
                      backgroundColor: '#f9fafb',
                      color: '#6b7280',
                      cursor: 'not-allowed',
                      fontSize: 14,
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                    placeholder="900101-14-5678"
                    maxLength={14}
                  />
                  <div style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: 14,
                    pointerEvents: 'none'
                  }}>
                    <FaLock />
                  </div>
                </div>
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Nationality</label>
                <input name="nationality" value={formData.nationality} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Marital Status</label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Employment Status</label>
                <select
                  name="employment_status"
                  value={formData.employment_status}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                >
                  <option value="">Select Employment Status</option>
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Unemployed">Unemployed</option>
                  <option value="Retired">Retired</option>
                  <option value="Student">Student</option>
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                >
                  <option value="Active">Active</option>
                  <option value="Dormant">Dormant</option>
                  <option value="High Risk">High Risk</option>
                </select>
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Risk Profile</label>
                <select
                  name="risk_profile"
                  value={formData.risk_profile}
                  onChange={handleChange}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                >
                  <option value="Conservative">Conservative</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Aggressive">Aggressive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dashboard Metrics */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Dashboard Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Assets</label>
                <input
                  type="number"
                  name="assets"
                  value={formData.assets}
                  onChange={handleNumberChange}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Cashflow</label>
                <input
                  type="number"
                  name="cashflow"
                  value={formData.cashflow}
                  onChange={handleNumberChange}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>CASA Balance</label>
                <input
                  type="number"
                  value={formData.account_balances.casa}
                  onChange={(e) => handleObjectChange('account_balances', 'casa', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>FD Balance</label>
                <input
                  type="number"
                  value={formData.account_balances.fd}
                  onChange={(e) => handleObjectChange('account_balances', 'fd', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Loans Balance</label>
                <input
                  type="number"
                  value={formData.account_balances.loans}
                  onChange={(e) => handleObjectChange('account_balances', 'loans', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </div>
              <div>
                <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Cards Balance</label>
                <input
                  type="number"
                  value={formData.account_balances.cards}
                  onChange={(e) => handleObjectChange('account_balances', 'cards', parseFloat(e.target.value) || 0)}
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
              </div>
            </div>
          </div>



          {/* Transaction Behavior */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Transaction Behavior</h3>
            
            {/* CASA Deposits */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>CASA Deposits</h4>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      casa_deposits: [...prev.casa_deposits, 0]
                    }));
                  }}
                  style={{
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    marginLeft: 12,
                    fontSize: 18,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#e5e7eb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  +
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                {formData.casa_deposits.map((value, index) => (
                  <div key={index}>
                    <label style={{ fontWeight: 500, display: 'block', marginBottom: 4, fontSize: 12 }}>Month {index + 1}</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                          const newValues = [...formData.casa_deposits];
                          newValues[index] = parseFloat(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, casa_deposits: newValues }));
                        }}
                        style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            casa_deposits: prev.casa_deposits.filter((_, i) => i !== index)
                          }));
                        }}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CASA Withdrawals */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>CASA Withdrawals</h4>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      casa_withdrawals: [...prev.casa_withdrawals, 0]
                    }));
                  }}
                  style={{
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    marginLeft: 12,
                    fontSize: 18,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#e5e7eb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  +
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                {formData.casa_withdrawals.map((value, index) => (
                  <div key={index}>
                    <label style={{ fontWeight: 500, display: 'block', marginBottom: 4, fontSize: 12 }}>Month {index + 1}</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                          const newValues = [...formData.casa_withdrawals];
                          newValues[index] = parseFloat(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, casa_withdrawals: newValues }));
                        }}
                        style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            casa_withdrawals: prev.casa_withdrawals.filter((_, i) => i !== index)
                          }));
                        }}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card Spending */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>Card Spending</h4>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      card_spending: [...prev.card_spending, 0]
                    }));
                  }}
                  style={{
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    marginLeft: 12,
                    fontSize: 18,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#e5e7eb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  +
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                {formData.card_spending.map((value, index) => (
                  <div key={index}>
                    <label style={{ fontWeight: 500, display: 'block', marginBottom: 4, fontSize: 12 }}>Month {index + 1}</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                          const newValues = [...formData.card_spending];
                          newValues[index] = parseFloat(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, card_spending: newValues }));
                        }}
                        style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            card_spending: prev.card_spending.filter((_, i) => i !== index)
                          }));
                        }}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        ×
                      </button>
            </div>
          </div>
                ))}
              </div>
            </div>

            {/* Card Payments */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>Card Payments</h4>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      card_payments: [...prev.card_payments, 0]
                    }));
                  }}
                  style={{
                    background: '#f3f4f6',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    width: '28px',
                    height: '28px',
                    marginLeft: 12,
                    fontSize: 18,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#e5e7eb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  +
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
                {formData.card_payments.map((value, index) => (
                  <div key={index}>
                    <label style={{ fontWeight: 500, display: 'block', marginBottom: 4, fontSize: 12 }}>Month {index + 1}</label>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => {
                          const newValues = [...formData.card_payments];
                          newValues[index] = parseFloat(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, card_payments: newValues }));
                        }}
                        style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            card_payments: prev.card_payments.filter((_, i) => i !== index)
                          }));
                        }}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Investments Portfolio */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, margin: 0 }}>Investments Portfolio</h3>
              <button
                type="button"
                onClick={() => addArrayItem('holdings', { asset: '', type: '', balance: 0 })}
                style={{
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  marginLeft: 12,
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e5e7eb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                +
              </button>
            </div>
            <div style={{ marginBottom: 24 }}>
            {formData.holdings.map((holding, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 24, marginBottom: 12, alignItems: 'end', marginBottom: 16 }}>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Asset</label>
                  <input
                    value={holding.asset}
                    onChange={(e) => {
                      const newHoldings = [...formData.holdings];
                      newHoldings[index] = { ...holding, asset: e.target.value };
                      setFormData(prev => ({ ...prev, holdings: newHoldings }));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Type</label>
                  <input
                    value={holding.type}
                    onChange={(e) => {
                      const newHoldings = [...formData.holdings];
                      newHoldings[index] = { ...holding, type: e.target.value };
                      setFormData(prev => ({ ...prev, holdings: newHoldings }));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Balance</label>
                  <input
                    type="number"
                    value={holding.balance}
                    onChange={(e) => {
                      const newHoldings = [...formData.holdings];
                      newHoldings[index] = { ...holding, balance: parseFloat(e.target.value) || 0 };
                      setFormData(prev => ({ ...prev, holdings: newHoldings }));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('holdings', index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          </div>

          {/* Liabilities & Credit */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, margin: 0 }}>Liabilities</h3>
              <button
                type="button"
                onClick={() => addArrayItem('liabilities', { name: '', type: '', balance: 0 })}
                style={{
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  marginLeft: 12,
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e5e7eb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                +
              </button>
            </div>
            <div style={{ marginBottom: 24 }}>
            {formData.liabilities.map((liability, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 24, marginBottom: 12, alignItems: 'end', marginBottom: 16 }}>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Name</label>
                  <input
                    value={liability.name}
                    onChange={(e) => {
                      const newLiabilities = [...formData.liabilities];
                      newLiabilities[index] = { ...liability, name: e.target.value };
                      setFormData(prev => ({ ...prev, liabilities: newLiabilities }));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Type</label>
                  <input
                    value={liability.type}
                    onChange={(e) => {
                      const newLiabilities = [...formData.liabilities];
                      newLiabilities[index] = { ...liability, type: e.target.value };
                      setFormData(prev => ({ ...prev, liabilities: newLiabilities }));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Balance</label>
                  <input
                    type="number"
                    value={liability.balance}
                    onChange={(e) => {
                      const newLiabilities = [...formData.liabilities];
                      newLiabilities[index] = { ...liability, balance: parseFloat(e.target.value) || 0 };
                      setFormData(prev => ({ ...prev, liabilities: newLiabilities }));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
              </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('liabilities', index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  ×
                </button>
              </div>
            ))}
              </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, marginTop: 32 }}>
              <h3 style={{ fontWeight: 700, fontSize: 20, margin: 0 }}>Credit Lines</h3>
              <button
                type="button"
                onClick={() => addArrayItem('credit_lines', { name: '', type: '', limit: 0 })}
                style={{
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  marginLeft: 12,
                  fontSize: 18,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#e5e7eb';
                  e.target.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#d1d5db';
                }}
              >
                +
              </button>
            </div>
            <div style={{ marginBottom: 24 }}>
            {formData.credit_lines.map((creditLine, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 24, marginBottom: 12, alignItems: 'end', marginBottom: 16 }}>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Name</label>
                  <input
                    value={creditLine.name}
                    onChange={(e) => {
                      const newCreditLines = [...formData.credit_lines];
                      newCreditLines[index] = { ...creditLine, name: e.target.value };
                      setFormData(prev => ({ ...prev, credit_lines: newCreditLines }));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Type</label>
                  <input
                    value={creditLine.type}
                    onChange={(e) => {
                      const newCreditLines = [...formData.credit_lines];
                      newCreditLines[index] = { ...creditLine, type: e.target.value };
                      setFormData(prev => ({ ...prev, credit_lines: newCreditLines }));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
              </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 4 }}>Limit</label>
                  <input
                    type="number"
                    value={creditLine.limit}
                    onChange={(e) => {
                      const newCreditLines = [...formData.credit_lines];
                      newCreditLines[index] = { ...creditLine, limit: parseFloat(e.target.value) || 0 };
                      setFormData(prev => ({ ...prev, credit_lines: newCreditLines }));
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
              </div>
                <button
                  type="button"
                  onClick={() => removeArrayItem('credit_lines', index)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            </div>
          </div>

          {/* Financial Summary Section */}
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Financial Summary Data</h3>
            
            {/* Financial Assets */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Financial Assets</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Total Assets</label>
                  <input
                    name="total_assets"
                    type="number"
                    value={formData.total_assets}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Total Liabilities</label>
                  <input
                    name="total_liabilities"
                    type="number"
                    value={formData.total_liabilities}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Net Position</label>
                  <input
                    name="net_position"
                    type="number"
                    value={formData.net_position}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>CASA Balance</label>
                  <input
                    name="casa_balance"
                    type="number"
                    value={formData.casa_balance}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Fixed Deposits</label>
                  <input
                    name="fixed_deposits"
                    type="number"
                    value={formData.fixed_deposits}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Investment Funds</label>
                  <input
                    name="investment_funds"
                    type="number"
                    value={formData.investment_funds}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Insurance Policies</label>
                  <input
                    name="insurance_policies"
                    type="number"
                    value={formData.insurance_policies}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Other Assets</label>
                  <input
                    name="other_assets"
                    type="number"
                    value={formData.other_assets}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
              </div>
            </div>

            {/* Relationship and Profitability */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Relationship & Profitability</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Relationship Tier</label>
                  <select
                    name="relationship_tier"
                    value={formData.relationship_tier}
                    onChange={handleChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Priority">Priority</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Profitability Score (0-100)</label>
                  <input
                    name="profitability_score"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.profitability_score}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Customer Lifetime Value</label>
                  <input
                    name="customer_lifetime_value"
                    type="number"
                    value={formData.customer_lifetime_value}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
              </div>
            </div>

            {/* Credit Utilization */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Credit Utilization</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Total Limit</label>
                  <input
                    name="total_limit"
                    type="number"
                    value={formData.total_limit}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Used Amount</label>
                  <input
                    name="used_amount"
                    type="number"
                    value={formData.used_amount}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Utilization Rate (%)</label>
                  <input
                    name="utilization_rate"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.utilization_rate}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Credit Health</label>
                  <select
                    name="credit_health"
                    value={formData.credit_health}
                    onChange={handleChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Asset Utilization */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Asset Utilization</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Utilization Percentage (%)</label>
                  <input
                    name="utilization_percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.utilization_percentage}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Liquid Assets</label>
                  <input
                    name="liquid_assets"
                    type="number"
                    value={formData.liquid_assets}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Invested Assets</label>
                  <input
                    name="invested_assets"
                    type="number"
                    value={formData.invested_assets}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Total Assets</label>
                  <input
                    name="total_assets"
                    type="number"
                    value={formData.total_assets}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
              </div>
            </div>

            {/* Emergency Fund Analysis */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Emergency Fund Analysis</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Emergency Fund Ratio (%)</label>
                  <input
                    name="emergency_fund_ratio"
                    type="number"
                    min="0"
                    value={formData.emergency_fund_ratio}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>3-Month Expenses</label>
                  <input
                    name="three_month_expenses"
                    type="number"
                    value={formData.three_month_expenses}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Current Emergency Fund</label>
                  <input
                    name="current_emergency_fund"
                    type="number"
                    value={formData.current_emergency_fund}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Recommended Emergency Fund</label>
                  <input
                    name="recommended_emergency_fund"
                    type="number"
                    value={formData.recommended_emergency_fund}
                    onChange={handleNumberChange}
                    style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                background: isSaving ? '#9ca3af' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: 16,
                cursor: isSaving ? 'not-allowed' : 'pointer'
              }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 