import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { supabase } from './supabaseClient';

export default function EditProductsPage() {
  const { nric } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
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

  // Fetch products from database
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products_catalog')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      subcategory: product.subcategory || '',
      type: product.type || '',
      suitability: product.suitability || 'Medium',
      risk_level: product.risk_level || 'Medium',
      interest_rate: product.interest_rate || '',
      annual_fee: product.annual_fee || '',
      min_deposit: product.min_deposit || '',
      min_investment: product.min_investment || '',
      max_amount: product.max_amount || '',
      credit_limit: product.credit_limit || '',
      monthly_premium: product.monthly_premium || '',
      coverage: product.coverage || '',
      service_fee: product.service_fee || '',
      is_islamic: product.is_islamic || false,
      is_active: product.is_active !== false
    });
  };



  const handleSave = async () => {
    try {
      // Update existing product
      const updateData = { ...formData };
      
      // Clean up empty string values to null for numeric fields
      if (updateData.min_deposit === '') updateData.min_deposit = null;
      if (updateData.min_investment === '') updateData.min_investment = null;
      if (updateData.max_amount === '') updateData.max_amount = null;

      console.log('Updating product data:', updateData);

      const { data, error } = await supabase
        .from('products_catalog')
        .update(updateData)
        .eq('id', editingProduct.id)
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Product updated successfully:', data);
      setEditingProduct(null);
      
      fetchProducts(); // Refresh the list
    } catch (err) {
      console.error('Error updating product:', err);
      const errorMessage = err.message || 'Failed to update product';
      setError(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({
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
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const { error } = await supabase
          .from('products_catalog')
          .delete()
          .eq('id', productId);

        if (error) throw error;
        fetchProducts(); // Refresh the list
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product');
      }
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

  if (loading) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={nric} />
        <main style={{ marginLeft: 240, padding: 32 }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Loading products...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
        <Sidebar clientId={nric} />
        <main style={{ marginLeft: 240, padding: 32 }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '18px', color: '#dc2626', marginBottom: '8px' }}>
              Unable to load products
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
              {error}
            </div>
            <button
              onClick={() => {
                setError(null);
                fetchProducts();
              }}
              style={{
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = '#000'}
              onMouseOut={(e) => e.target.style.background = '#222'}
            >
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

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
            onClick={() => navigate(`/products/${nric}`)}
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
          <h2 style={{ fontWeight: 700, fontSize: 32 }}>Edit Products</h2>
          <button
            onClick={() => navigate(`/add-product/${nric}`)}
            style={{
              background: '#059669',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#047857'}
            onMouseOut={(e) => e.target.style.background = '#059669'}
          >
            Add New Product
          </button>
        </div>



        {/* Products List */}
        <div style={{ display: 'grid', gap: '16px' }}>
          {products.map((product) => (
            <div key={product.id} style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {categoryNames[product.category] || product.category}
                    </span>
                    <span style={{
                      background: product.is_islamic ? '#fef2f2' : '#f3f4f6',
                      color: product.is_islamic ? '#dc2626' : '#374151',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {product.is_islamic ? 'Islamic' : 'Conventional'}
                    </span>
                    <span style={{
                      background: product.is_active ? '#dcfce7' : '#fecaca',
                      color: product.is_active ? '#166534' : '#dc2626',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{
                      background: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#2563eb'}
                    onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{
                      background: '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#b91c1c'}
                    onMouseOut={(e) => e.target.style.background = '#dc2626'}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Edit Form */}
              {editingProduct && editingProduct.id === product.id && (
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '20px',
                  marginTop: '16px'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
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
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
                        Suitability
                      </label>
                      <select
                        value={formData.suitability}
                        onChange={(e) => setFormData({...formData, suitability: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
                        Risk Level
                      </label>
                      <select
                        value={formData.risk_level}
                        onChange={(e) => setFormData({...formData, risk_level: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
                        Interest Rate
                      </label>
                      <input
                        type="text"
                        value={formData.interest_rate}
                        onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
                        Annual Fee
                      </label>
                      <input
                        type="text"
                        value={formData.annual_fee}
                        onChange={(e) => setFormData({...formData, annual_fee: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '14px' }}>
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
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

                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button
                      onClick={handleSave}
                      style={{
                        background: '#059669',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 20px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#047857'}
                      onMouseOut={(e) => e.target.style.background = '#059669'}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '10px 20px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px',
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
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 