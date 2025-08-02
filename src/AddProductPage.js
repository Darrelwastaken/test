import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { supabase } from './supabaseClient';

export default function AddProductPage() {
  const { nric } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    type: '',
    suitability: 'Medium',
    risk_level: 'Medium',
    interest_rate: '',
    annual_fee: '',
    min_deposit: '',
    min_investment: '',
    max_amount: '',
    credit_limit: '',
    monthly_premium: '',
    coverage: '',
    service_fee: '',
    is_islamic: false,
    is_active: true
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const productData = {
        ...formData,
        product_id: `ambank_${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Clean up empty string values to null for numeric fields
      if (productData.min_deposit === '') productData.min_deposit = null;
      if (productData.min_investment === '') productData.min_investment = null;
      if (productData.max_amount === '') productData.max_amount = null;

      console.log('Inserting product data:', productData);

      const { data, error } = await supabase
        .from('products_catalog')
        .insert([productData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Product created successfully:', data);
      navigate(`/edit-products/${nric}`);
    } catch (err) {
      console.error('Error creating product:', err);
      const errorMessage = err.message || 'Failed to create product';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const categoryNames = {
    'personal_banking': 'Personal Banking',
    'cards': 'Cards',
    'loans_financing': 'Loans & Financing',
    'wealth_management': 'Wealth Management & Investments',
    'insurance_takaful': 'Insurance & Takaful',
    'corporate_treasury': 'Corporate & Treasury Solutions'
  };

  return (
    <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
      <Sidebar clientId={nric} />
      <main style={{ marginLeft: 240, padding: 32 }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }}>
          <button
            onClick={() => navigate(`/edit-products/${nric}`)}
            style={{
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '12px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
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
            Back
          </button>
          <h2 style={{ fontWeight: 700, fontSize: 32 }}>Add New Product</h2>
          <div style={{ width: '100px' }}></div> {/* Spacer for centering */}
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#dc2626'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Error</div>
            <div>{error}</div>
          </div>
        )}

        {/* Add New Product Form */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="">Select Category</option>
                {Object.entries(categoryNames).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Subcategory
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., savings, credit, investment"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Product Type
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., High-Yield Savings, Premium Credit Card"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Suitability
              </label>
              <select
                value={formData.suitability}
                onChange={(e) => setFormData({...formData, suitability: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Risk Level
              </label>
              <select
                value={formData.risk_level}
                onChange={(e) => setFormData({...formData, risk_level: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Interest Rate
              </label>
              <input
                type="text"
                value={formData.interest_rate}
                onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., 3.5-4.5%"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Annual Fee
              </label>
              <input
                type="text"
                value={formData.annual_fee}
                onChange={(e) => setFormData({...formData, annual_fee: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., RM200"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Min Deposit
              </label>
              <input
                type="number"
                value={formData.min_deposit}
                onChange={(e) => setFormData({...formData, min_deposit: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., 1000"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Min Investment
              </label>
              <input
                type="number"
                value={formData.min_investment}
                onChange={(e) => setFormData({...formData, min_investment: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., 5000"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Max Amount
              </label>
              <input
                type="number"
                value={formData.max_amount}
                onChange={(e) => setFormData({...formData, max_amount: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., 100000"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Credit Limit
              </label>
              <input
                type="text"
                value={formData.credit_limit}
                onChange={(e) => setFormData({...formData, credit_limit: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., RM50,000"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Monthly Premium
              </label>
              <input
                type="text"
                value={formData.monthly_premium}
                onChange={(e) => setFormData({...formData, monthly_premium: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., RM100"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Coverage
              </label>
              <input
                type="text"
                value={formData.coverage}
                onChange={(e) => setFormData({...formData, coverage: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., RM500,000"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                Service Fee
              </label>
              <input
                type="text"
                value={formData.service_fee}
                onChange={(e) => setFormData({...formData, service_fee: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                placeholder="e.g., 0.5%"
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical'
              }}
              placeholder="Enter product description"
            />
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={formData.is_islamic}
                onChange={(e) => setFormData({...formData, is_islamic: e.target.checked})}
              />
              Islamic Product
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
              Active
            </label>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={handleSave}
              disabled={loading || !formData.name || !formData.description || !formData.category}
              style={{
                background: (loading || !formData.name || !formData.description || !formData.category) ? '#9ca3af' : '#059669',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '600',
                cursor: (loading || !formData.name || !formData.description || !formData.category) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (!loading && formData.name && formData.description && formData.category) {
                  e.target.style.background = '#047857';
                }
              }}
              onMouseOut={(e) => {
                if (!loading && formData.name && formData.description && formData.category) {
                  e.target.style.background = '#059669';
                }
              }}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              onClick={() => navigate(`/edit-products/${nric}`)}
              disabled={loading}
              style={{
                background: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.background = '#e5e7eb';
                  e.target.style.borderColor = '#9ca3af';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.borderColor = '#d1d5db';
                }
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 