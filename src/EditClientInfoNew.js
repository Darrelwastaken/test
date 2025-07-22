import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FaLock, FaSave, FaArrowLeft } from 'react-icons/fa';
import Sidebar from './Sidebar';
import { supabase } from './supabaseClient';

function validateNRIC(nric) {
  return /^\d{6}-\d{2}-\d{4}$/.test(nric);
}

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

export default function EditClientInfoNew() {
  const { nric: paramNric } = useParams();
  const navigate = useNavigate();
  
  // Form state for manually input fields only
  const [formData, setFormData] = useState({
    // Basic Profile Information (Manual Input)
    nric: '',
    name: '',
    email: '',
    status: '',
    risk_profile: '',
    nationality: '',
    gender: '',
    marital_status: '',
    employment_status: '',
    relationship_tier: 'Standard',
    credit_score: '',
    dsr_ratio: '',
    
    // Key Financial Figures (Manual Input)
    casa_balance: 0,
    fixed_deposit_amount: 0,
    investment_portfolio_value: 0,
    insurance_value: 0,
    other_assets_value: 0,
    
    // Liabilities (Manual Input)
    loan_outstanding_balance: 0,
    credit_card_limit: 0,
    credit_card_used_amount: 0,
    overdraft_limit: 0,
    overdraft_used_amount: 0,
    
    // Cash Flow (Manual Input)
    monthly_inflow: 0,
    monthly_outflow: 0,
    
    // Emergency Fund (Manual Input)
    three_month_expenses: 0,
    current_emergency_fund: 0,
    
    // Product Holdings (Manual Input)
    product_holdings: [],
    
    // Transaction Behavioral Data (Manual Input)
    categorized_spending: {},
    fund_transfers_volume: 0,
    fund_transfers_count: 0,
    pos_purchases_volume: 0,
    pos_purchases_count: 0,
    atm_withdrawals_volume: 0,
    atm_withdrawals_count: 0,
    fx_transactions_volume: 0,
    fx_transactions_count: 0,
    unusual_transactions: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [trendData, setTrendData] = useState([]);

  // Load existing data
  useEffect(() => {
    loadClientData();
  }, [paramNric]);

  const loadClientData = async () => {
    try {
      setIsLoading(true);
      
      // Load basic client info
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('nric', paramNric)
        .single();

      if (clientError) throw clientError;

      // Load manual financial inputs
      const { data: financialData, error: financialError } = await supabase
        .from('manual_financial_inputs')
        .select('*')
        .eq('client_nric', paramNric)
        .single();

      // Load transaction behavioral data
      const { data: behavioralData, error: behavioralError } = await supabase
        .from('transaction_behavioral_data')
        .select('*')
        .eq('client_nric', paramNric)
        .single();

      // Fetch trend data
      const { data: trendRows, error: trendError } = await supabase
        .from('financial_trends_monthly')
        .select('*')
        .eq('client_nric', paramNric)
        .order('month_year', { ascending: true });
      if (!trendError) setTrendData(trendRows || []);

      // Set form data
      setFormData({
        // Basic Profile
        nric: client.nric || '',
        name: client.name || '',
        email: client.email || '',
        status: client.status || '',
        risk_profile: client.risk_profile || '',
        nationality: client.nationality || '',
        gender: client.gender || '',
        marital_status: client.marital_status || '',
        employment_status: client.employment_status || '',
        relationship_tier: client.relationship_tier || 'Standard',
        credit_score: client.credit_score || '',
        dsr_ratio: client.dsr_ratio || '',
        
        // Financial Data
        casa_balance: financialData?.casa_balance || 0,
        fixed_deposit_amount: financialData?.fixed_deposit_amount || 0,
        investment_portfolio_value: financialData?.investment_portfolio_value || 0,
        insurance_value: financialData?.insurance_value || 0,
        other_assets_value: financialData?.other_assets_value || 0,
        loan_outstanding_balance: financialData?.loan_outstanding_balance || 0,
        credit_card_limit: financialData?.credit_card_limit || 0,
        credit_card_used_amount: financialData?.credit_card_used_amount || 0,
        overdraft_limit: financialData?.overdraft_limit || 0,
        overdraft_used_amount: financialData?.overdraft_used_amount || 0,
        monthly_inflow: financialData?.monthly_inflow || 0,
        monthly_outflow: financialData?.monthly_outflow || 0,
        three_month_expenses: financialData?.three_month_expenses || 0,
        current_emergency_fund: financialData?.current_emergency_fund || 0,
        product_holdings: financialData?.product_holdings || [],
        
        // Behavioral Data
        categorized_spending: behavioralData?.categorized_spending || {},
        fund_transfers_volume: behavioralData?.fund_transfers_volume || 0,
        fund_transfers_count: behavioralData?.fund_transfers_count || 0,
        pos_purchases_volume: behavioralData?.pos_purchases_volume || 0,
        pos_purchases_count: behavioralData?.pos_purchases_count || 0,
        atm_withdrawals_volume: behavioralData?.atm_withdrawals_volume || 0,
        atm_withdrawals_count: behavioralData?.atm_withdrawals_count || 0,
        fx_transactions_volume: behavioralData?.fx_transactions_volume || 0,
        fx_transactions_count: behavioralData?.fx_transactions_count || 0,
        unusual_transactions: behavioralData?.unusual_transactions || []
      });

    } catch (error) {
      console.error('Error loading client data:', error);
      setErrors({ general: 'Failed to load client data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, [name]: numValue }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrors({});

      // Validate required fields
      const newErrors = {};
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.nric) newErrors.nric = 'NRIC is required';
      if (!validateNRIC(formData.nric)) newErrors.nric = 'Invalid NRIC format';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Update client table
      const { error: clientError } = await supabase
        .from('clients')
        .update({
          name: formData.name,
          email: formData.email,
          status: formData.status,
          risk_profile: formData.risk_profile,
          nationality: formData.nationality,
          gender: formData.gender,
          marital_status: formData.marital_status,
          employment_status: formData.employment_status,
          relationship_tier: formData.relationship_tier,
          credit_score: formData.credit_score ? parseInt(formData.credit_score) : null,
          dsr_ratio: formData.dsr_ratio ? parseFloat(formData.dsr_ratio) : null
        })
        .eq('nric', paramNric);

      if (clientError) throw clientError;

      // Update manual financial inputs (use update instead of upsert)
      const { error: financialError } = await supabase
        .from('manual_financial_inputs')
        .update({
          casa_balance: formData.casa_balance,
          fixed_deposit_amount: formData.fixed_deposit_amount,
          investment_portfolio_value: formData.investment_portfolio_value,
          insurance_value: formData.insurance_value,
          other_assets_value: formData.other_assets_value,
          loan_outstanding_balance: formData.loan_outstanding_balance,
          credit_card_limit: formData.credit_card_limit,
          credit_card_used_amount: formData.credit_card_used_amount,
          overdraft_limit: formData.overdraft_limit,
          overdraft_used_amount: formData.overdraft_used_amount,
          monthly_inflow: formData.monthly_inflow,
          monthly_outflow: formData.monthly_outflow,
          three_month_expenses: formData.three_month_expenses,
          current_emergency_fund: formData.current_emergency_fund,
          product_holdings: formData.product_holdings
        })
        .eq('client_nric', paramNric);

      if (financialError) throw financialError;

      // Update transaction behavioral data (use update instead of upsert)
      const { error: behavioralError } = await supabase
        .from('transaction_behavioral_data')
        .update({
          categorized_spending: formData.categorized_spending,
          fund_transfers_volume: formData.fund_transfers_volume,
          fund_transfers_count: formData.fund_transfers_count,
          pos_purchases_volume: formData.pos_purchases_volume,
          pos_purchases_count: formData.pos_purchases_count,
          atm_withdrawals_volume: formData.atm_withdrawals_volume,
          atm_withdrawals_count: formData.atm_withdrawals_count,
          fx_transactions_volume: formData.fx_transactions_volume,
          fx_transactions_count: formData.fx_transactions_count,
          unusual_transactions: formData.unusual_transactions
        })
        .eq('client_nric', paramNric);

      if (behavioralError) throw behavioralError;

      // Save trend data to database
      await supabase.from('financial_trends_monthly').delete().eq('client_nric', paramNric);
      for (const row of trendData) {
        await supabase.from('financial_trends_monthly').upsert({
          client_nric: paramNric,
          month_year: row.month_year,
          casa: row.casa || 0,
          cards: row.cards || 0,
          investments: row.investments || 0,
          loans: row.loans || 0
        });
      }

      // Navigate back to dashboard
      navigate(`/dashboard/${paramNric}`, { state: { fromEdit: true } });

    } catch (error) {
      console.error('Error saving client data:', error);
      setErrors({ general: 'Failed to save client data' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={paramNric} />
        <div style={{ padding: 32, marginLeft: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Loading Client Data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6f7f9" }}>
      <Sidebar clientId={paramNric} />
      
      <main style={{ flex: 1, padding: 32, marginLeft: 240 }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32
        }}>
          <div>
            <button
              onClick={() => navigate(`/dashboard/${paramNric}`)}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 16,
                marginBottom: 8
              }}
            >
              <FaArrowLeft /> Back to Dashboard
            </button>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Edit Client Information</h1>
            <p style={{ color: '#6b7280', margin: '8px 0 0 0' }}>
              Update manually input client data. Calculated fields are automatically updated.
            </p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 600,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: isSaving ? 0.6 : 1
            }}
          >
            <FaSave />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {errors.general && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: 16,
            borderRadius: 8,
            marginBottom: 24
          }}>
            {errors.general}
          </div>
        )}

        {/* Form Sections */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          
          {/* Basic Profile Information */}
          <div style={{ flex: 1, minWidth: 400 }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              marginBottom: 24
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Basic Profile Information</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    NRIC *
                  </label>
                  <input
                    type="text"
                    name="nric"
                    value={formData.nric}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.nric ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="000000-00-0000"
                  />
                  {errors.nric && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.nric}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.name ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="Full Name"
                  />
                  {errors.name && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: errors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="email@example.com"
                  />
                  {errors.email && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Dormant">Dormant</option>
                    <option value="High Risk">High Risk</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Risk Profile
                  </label>
                  <select
                    name="risk_profile"
                    value={formData.risk_profile}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Risk Profile</option>
                    <option value="Conservative">Conservative</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Relationship Tier
                  </label>
                  <select
                    name="relationship_tier"
                    value={formData.relationship_tier}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                    <option value="Priority">Priority</option>
                    <option value="Private">Private</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Credit Score
                  </label>
                  <input
                    type="number"
                    name="credit_score"
                    value={formData.credit_score}
                    onChange={handleChange}
                    min="300"
                    max="850"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="300-850"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    DSR Ratio (%)
                  </label>
                  <input
                    type="number"
                    name="dsr_ratio"
                    value={formData.dsr_ratio}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0-100"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Nationality
                  </label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., Malaysian"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Marital Status
                  </label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Employment Status
                  </label>
                  <select
                    name="employment_status"
                    value={formData.employment_status}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select Employment Status</option>
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Retired">Retired</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Assets */}
          <div style={{ flex: 1, minWidth: 400 }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              marginBottom: 24
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Financial Assets</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    CASA Balance (RM)
                  </label>
                  <input
                    type="number"
                    name="casa_balance"
                    value={formData.casa_balance}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Fixed Deposit Amount (RM)
                  </label>
                  <input
                    type="number"
                    name="fixed_deposit_amount"
                    value={formData.fixed_deposit_amount}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Investment Portfolio Value (RM)
                  </label>
                  <input
                    type="number"
                    name="investment_portfolio_value"
                    value={formData.investment_portfolio_value}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Insurance Value (RM)
                  </label>
                  <input
                    type="number"
                    name="insurance_value"
                    value={formData.insurance_value}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Other Assets Value (RM)
                  </label>
                  <input
                    type="number"
                    name="other_assets_value"
                    value={formData.other_assets_value}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liabilities Section */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
          <div style={{ flex: 1, minWidth: 400 }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Liabilities & Credit</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Loan Outstanding Balance (RM)
                  </label>
                  <input
                    type="number"
                    name="loan_outstanding_balance"
                    value={formData.loan_outstanding_balance}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Credit Card Limit (RM)
                  </label>
                  <input
                    type="number"
                    name="credit_card_limit"
                    value={formData.credit_card_limit}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Credit Card Used Amount (RM)
                  </label>
                  <input
                    type="number"
                    name="credit_card_used_amount"
                    value={formData.credit_card_used_amount}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Overdraft Limit (RM)
                  </label>
                  <input
                    type="number"
                    name="overdraft_limit"
                    value={formData.overdraft_limit}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Overdraft Used Amount (RM)
                  </label>
                  <input
                    type="number"
                    name="overdraft_used_amount"
                    value={formData.overdraft_used_amount}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cash Flow Section */}
          <div style={{ flex: 1, minWidth: 400 }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Cash Flow & Emergency Fund</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Monthly Inflow (RM)
                  </label>
                  <input
                    type="number"
                    name="monthly_inflow"
                    value={formData.monthly_inflow}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Monthly Outflow (RM)
                  </label>
                  <input
                    type="number"
                    name="monthly_outflow"
                    value={formData.monthly_outflow}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    3-Month Expenses (RM)
                  </label>
                  <input
                    type="number"
                    name="three_month_expenses"
                    value={formData.three_month_expenses}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#374151' }}>
                    Current Emergency Fund (RM)
                  </label>
                  <input
                    type="number"
                    name="current_emergency_fund"
                    value={formData.current_emergency_fund}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontSize: 14,
                      boxSizing: 'border-box'
                    }}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Behavioral Data Section */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Transaction Behavioral Data</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#374151' }}>Fund Transfers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#6b7280', fontSize: 14 }}>
                      Volume (RM)
                    </label>
                    <input
                      type="number"
                      name="fund_transfers_volume"
                      value={formData.fund_transfers_volume}
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#6b7280', fontSize: 14 }}>
                      Count
                    </label>
                    <input
                      type="number"
                      name="fund_transfers_count"
                      value={formData.fund_transfers_count}
                      onChange={handleNumberChange}
                      min="0"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#374151' }}>POS Purchases</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#6b7280', fontSize: 14 }}>
                      Volume (RM)
                    </label>
                    <input
                      type="number"
                      name="pos_purchases_volume"
                      value={formData.pos_purchases_volume}
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#6b7280', fontSize: 14 }}>
                      Count
                    </label>
                    <input
                      type="number"
                      name="pos_purchases_count"
                      value={formData.pos_purchases_count}
                      onChange={handleNumberChange}
                      min="0"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#374151' }}>ATM Withdrawals</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#6b7280', fontSize: 14 }}>
                      Volume (RM)
                    </label>
                    <input
                      type="number"
                      name="atm_withdrawals_volume"
                      value={formData.atm_withdrawals_volume}
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#6b7280', fontSize: 14 }}>
                      Count
                    </label>
                    <input
                      type="number"
                      name="atm_withdrawals_count"
                      value={formData.atm_withdrawals_count}
                      onChange={handleNumberChange}
                      min="0"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: '#374151' }}>FX Transactions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#6b7280', fontSize: 14 }}>
                      Volume (RM)
                    </label>
                    <input
                      type="number"
                      name="fx_transactions_volume"
                      value={formData.fx_transactions_volume}
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#6b7280', fontSize: 14 }}>
                      Count
                    </label>
                    <input
                      type="number"
                      name="fx_transactions_count"
                      value={formData.fx_transactions_count}
                      onChange={handleNumberChange}
                      min="0"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        boxSizing: 'border-box'
                      }}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trend Data Section */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Edit Trend Data</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 8px', textAlign: 'left', fontWeight: 600, fontSize: 16 }}>Month (YYYY-MM)</th>
                <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 8px', textAlign: 'left', fontWeight: 600, fontSize: 16 }}>CASA</th>
                <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 8px', textAlign: 'left', fontWeight: 600, fontSize: 16 }}>Cards</th>
                <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 8px', textAlign: 'left', fontWeight: 600, fontSize: 16 }}>Investments</th>
                <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 8px', textAlign: 'left', fontWeight: 600, fontSize: 16 }}>Loans</th>
                <th style={{ borderBottom: '1px solid #e5e7eb', padding: '12px 8px' }}></th>
              </tr>
            </thead>
            <tbody>
              {trendData.map((row, idx) => (
                <tr key={row.month_year}>
                  <td style={{ padding: 8 }}>
                    <input
                      type="text"
                      value={row.month_year}
                      onChange={e => {
                        const newTrend = [...trendData];
                        newTrend[idx].month_year = e.target.value;
                        setTrendData(newTrend);
                      }}
                      style={{ width: 120, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                      placeholder="YYYY-MM"
                    />
                  </td>
                  <td style={{ padding: 8 }}>
                    <input
                      type="number"
                      value={row.casa || 0}
                      onChange={e => {
                        const newTrend = [...trendData];
                        newTrend[idx].casa = parseFloat(e.target.value) || 0;
                        setTrendData(newTrend);
                      }}
                      style={{ width: 120, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                      placeholder="CASA"
                    />
                  </td>
                  <td style={{ padding: 8 }}>
                    <input
                      type="number"
                      value={row.cards || 0}
                      onChange={e => {
                        const newTrend = [...trendData];
                        newTrend[idx].cards = parseFloat(e.target.value) || 0;
                        setTrendData(newTrend);
                      }}
                      style={{ width: 120, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                      placeholder="Cards"
                    />
                  </td>
                  <td style={{ padding: 8 }}>
                    <input
                      type="number"
                      value={row.investments || 0}
                      onChange={e => {
                        const newTrend = [...trendData];
                        newTrend[idx].investments = parseFloat(e.target.value) || 0;
                        setTrendData(newTrend);
                      }}
                      style={{ width: 120, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                      placeholder="Investments"
                    />
                  </td>
                  <td style={{ padding: 8 }}>
                    <input
                      type="number"
                      value={row.loans || 0}
                      onChange={e => {
                        const newTrend = [...trendData];
                        newTrend[idx].loans = parseFloat(e.target.value) || 0;
                        setTrendData(newTrend);
                      }}
                      style={{ width: 120, padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                      placeholder="Loans"
                    />
                  </td>
                  <td style={{ padding: 8 }}>
                    <button
                      type="button"
                      style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}
                      onClick={() => {
                        setTrendData(trendData.filter((_, i) => i !== idx));
                      }}
                    >Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 8 }}>
                  <button
                    type="button"
                    style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontWeight: 500, fontSize: 14, cursor: 'pointer' }}
                    onClick={() => {
                      let newMonth;
                      if (trendData.length > 0 && trendData[trendData.length - 1].month_year) {
                        // Get the last (oldest) month and go one month back
                        const [y, m] = trendData[trendData.length - 1].month_year.split('-').map(Number);
                        let prevYear = y, prevMonth = m - 1;
                        if (prevMonth === 0) { prevMonth = 12; prevYear -= 1; }
                        newMonth = `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;
                      } else {
                        // Default to last month from today
                        const today = new Date();
                        today.setMonth(today.getMonth() - 1);
                        newMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
                      }
                      setTrendData([
                        ...trendData,
                        { month_year: newMonth, casa: 0, cards: 0, investments: 0, loans: 0 }
                      ]);
                    }}
                  >Add Month</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
} 