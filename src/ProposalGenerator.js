import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import Sidebar from './Sidebar';
import ClientHeader from './components/ClientHeader';

export default function ProposalGenerator() {
  const { nric } = useParams();
  const { isMobile, sidebarOpen, setSidebarOpen, toggleSidebar, getMainContentStyle } = useResponsiveLayout();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);

  useEffect(() => {
    // Simulate loading client data and existing proposals
    setTimeout(() => {
      setClientInfo({
        name: 'John Doe',
        age: 35,
        income: '$75,000',
        riskProfile: 'Moderate'
      });
      
      setProposals([
        {
          id: 1,
          title: 'Retirement Planning Proposal',
          status: 'Draft',
          createdAt: '2024-01-15',
          products: ['401(k) Rollover', 'IRA Contribution', 'Life Insurance'],
          totalValue: '$125,000'
        },
        {
          id: 2,
          title: 'Investment Portfolio Proposal',
          status: 'Completed',
          createdAt: '2024-01-10',
          products: ['Index Funds', 'Bond Portfolio', 'Emergency Fund'],
          totalValue: '$85,000'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [nric]);

  const availableProducts = [
    { id: 1, name: 'AmVault Savings Account / Account‑i', category: 'Personal Banking', description: 'High-yield savings account with competitive interest rates and Islamic banking options' },
    { id: 2, name: 'TRUE Savers Account / Account‑i', category: 'Personal Banking', description: 'Savings account with bonus interest for regular deposits and Islamic banking option' },
    { id: 3, name: 'AmBank Visa Debit Card', category: 'Cards', description: 'Debit card for cashless transactions and ATM withdrawals' },
    { id: 4, name: 'AmBank Enrich Visa Infinite & Platinum', category: 'Cards', description: 'Premium credit cards with travel rewards and exclusive benefits' },
    { id: 5, name: 'Personal Financing / Financing‑i', category: 'Loans & Financing', description: 'Personal loan with flexible terms and Islamic financing option' },
    { id: 6, name: 'Unit Trusts via AmInvest', category: 'Wealth Management', description: 'Professional managed unit trust funds with various risk profiles' },
    { id: 7, name: 'General Insurance', category: 'Insurance & Takaful', description: 'Comprehensive general insurance coverage for various needs' },
    { id: 8, name: 'SME & Corporate Banking', category: 'Corporate & Treasury', description: 'Comprehensive banking services for SMEs and corporations' }
  ];

  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const generateProposal = () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product for the proposal.');
      return;
    }
    
    const newProposal = {
      id: proposals.length + 1,
      title: `Financial Proposal ${proposals.length + 1}`,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      products: selectedProducts.map(id => availableProducts.find(p => p.id === id)?.name),
      totalValue: '$0'
    };
    
    setProposals([newProposal, ...proposals]);
    setSelectedProducts([]);
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
        <div style={{ ...getMainContentStyle(), display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Loading proposal data...</div>
          </div>
        </div>
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
      <div style={getMainContentStyle()}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Proposal Generator
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Create and manage financial proposals for your clients
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? '16px' : '32px' 
        }}>
          {/* Client Information */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Client Information</h2>
            {clientInfo && (
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <span style={{ color: '#666', fontSize: '14px' }}>Name:</span>
                  <span style={{ marginLeft: '8px', fontWeight: '500' }}>{clientInfo.name}</span>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '14px' }}>Age:</span>
                  <span style={{ marginLeft: '8px', fontWeight: '500' }}>{clientInfo.age}</span>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '14px' }}>Annual Income:</span>
                  <span style={{ marginLeft: '8px', fontWeight: '500' }}>{clientInfo.income}</span>
                </div>
                <div>
                  <span style={{ color: '#666', fontSize: '14px' }}>Risk Profile:</span>
                  <span style={{ marginLeft: '8px', fontWeight: '500' }}>{clientInfo.riskProfile}</span>
                </div>
              </div>
            )}
          </div>

          {/* Product Selection */}
          <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Select Products</h2>
            <div style={{ marginBottom: '16px' }}>
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    background: selectedProducts.includes(product.id) ? '#f0f9ff' : '#fff'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleProductToggle(product.id)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{product.name}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{product.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={generateProposal}
              style={{
                background: '#222',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Generate Proposal
            </button>
          </div>
        </div>

        {/* Existing Proposals */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Existing Proposals</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {proposals.map((proposal) => (
              <div
                key={proposal.id}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      {proposal.title}
                    </h3>
                    <div style={{ color: '#666', fontSize: '14px' }}>
                      Created: {proposal.createdAt}
                    </div>
                  </div>
                  <div style={{
                    background: proposal.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                    color: proposal.status === 'Completed' ? '#166534' : '#92400e',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {proposal.status}
                  </div>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Products:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {proposal.products.map((product, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#f3f4f6',
                          color: '#374151',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '14px', color: '#666' }}>Total Value: </span>
                    <span style={{ fontWeight: '600' }}>{proposal.totalValue}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      View
                    </button>
                    <button style={{
                      background: '#222',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}>
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 