import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import Sidebar from './Sidebar';
import ClientHeader from './components/ClientHeader';
import { useClientMetrics } from './hooks/useClientMetrics';
import { supabase } from './supabaseClient';

export default function ProductsPage() {
  const { nric } = useParams();
  const navigate = useNavigate();
  const { isMobile, sidebarOpen, setSidebarOpen, toggleSidebar, getMainContentStyle } = useResponsiveLayout();
  const { client, clientName, clientStatus, clientRiskProfile } = useClientMetrics(nric);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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
        .eq('is_active', true)
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

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group products by category
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  // Category display names
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
        <Sidebar 
          clientId={nric} 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onClose={() => setSidebarOpen(false)}
        />
        <main style={getMainContentStyle()}>
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
        <Sidebar 
          clientId={nric} 
          isMobile={isMobile}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          onClose={() => setSidebarOpen(false)}
        />
        <main style={getMainContentStyle()}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '18px', color: '#dc2626', marginBottom: '8px' }}>
              Unable to load products
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {error}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ background: '#f6f7f9', minHeight: '100vh' }}>
      <Sidebar 
        clientId={nric} 
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onClose={() => setSidebarOpen(false)}
      />
      <main style={getMainContentStyle()}>
        <ClientHeader
          clientName={clientName}
          clientStatus={clientStatus}
          clientRiskProfile={clientRiskProfile}
          nric={nric}
          isMobile={isMobile}
          showCrmButton={false}
        />
        
        {/* Navigation */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12
        }}>
          <button
            onClick={() => navigate(`/product-recommendations/${nric}`)}
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
          <button
            onClick={() => navigate(`/edit-products/${nric}`)}
            style={{
              background: '#222',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#000'}
            onMouseOut={(e) => e.target.style.background = '#222'}
          >
            Edit Products
          </button>
        </div>

        <h2 style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>Products Catalog</h2>

        {/* Search and Filter */}
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          marginBottom: 24,
          flexWrap: 'wrap'
        }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              minWidth: isMobile ? '100%' : '250px',
              flex: 1
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#fff',
              minWidth: isMobile ? '100%' : '200px'
            }}
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryNames).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        {/* Products Display */}
        <div style={{ display: 'grid', gap: '24px' }}>
          {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
            <div key={category} style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                marginBottom: '20px', 
                color: '#374151',
                borderBottom: '1px solid #e5e7eb',
                paddingBottom: '12px'
              }}>
                {categoryNames[category]} Products
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {categoryProducts.map((product) => (
                  <div key={product.id} style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <div style={{
                          background: product.is_islamic ? '#fef2f2' : '#f3f4f6',
                          color: product.is_islamic ? '#dc2626' : '#374151',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          {product.is_islamic ? 'Islamic' : 'Conventional'}
                        </div>
                        {product.suitability && (
                          <div style={{
                            background: product.suitability === 'High' ? '#dcfce7' : product.suitability === 'Medium' ? '#fef3c7' : '#f3f4f6',
                            color: product.suitability === 'High' ? '#166534' : product.suitability === 'Medium' ? '#92400e' : '#374151',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {product.suitability} Suitability
                          </div>
                        )}
                        {product.risk_level && (
                          <div style={{
                            background: product.risk_level === 'High' ? '#fecaca' : product.risk_level === 'Medium' ? '#fef3c7' : '#dcfce7',
                            color: product.risk_level === 'High' ? '#dc2626' : product.risk_level === 'Medium' ? '#92400e' : '#166534',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {product.risk_level} Risk
                          </div>
                        )}
                      </div>
                      
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                        {product.name}
                      </h4>
                      
                      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '12px' }}>
                        {product.description}
                      </p>

                      {/* Product Details */}
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#6b7280' }}>
                        {product.interest_rate && (
                          <span>Interest Rate: <strong>{product.interest_rate}</strong></span>
                        )}
                        {product.expected_return && (
                          <span>Expected Return: <strong>{product.expected_return}</strong></span>
                        )}
                        {product.annual_fee && (
                          <span>Annual Fee: <strong>{product.annual_fee}</strong></span>
                        )}
                        {product.min_deposit && (
                          <span>Min Deposit: <strong>RM{product.min_deposit.toLocaleString()}</strong></span>
                        )}
                        {product.min_investment && (
                          <span>Min Investment: <strong>RM{product.min_investment.toLocaleString()}</strong></span>
                        )}
                        {product.max_amount && (
                          <span>Max Amount: <strong>RM{product.max_amount.toLocaleString()}</strong></span>
                        )}
                        {product.credit_limit && (
                          <span>Credit Limit: <strong>{product.credit_limit}</strong></span>
                        )}
                        {product.monthly_premium && (
                          <span>Monthly Premium: <strong>{product.monthly_premium}</strong></span>
                        )}
                        {product.coverage && (
                          <span>Coverage: <strong>{product.coverage}</strong></span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                      <button style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '13px',
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
                        Learn More
                      </button>
                      <button style={{
                        background: '#059669',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.background = '#047857'}
                      onMouseOut={(e) => e.target.style.background = '#059669'}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {Object.keys(groupedProducts).length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px',
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
              No products found
            </div>
            <div style={{ fontSize: '14px', color: '#999' }}>
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 