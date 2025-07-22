import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function ProductRecommendations() {
  const { nric } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading recommendations
    setTimeout(() => {
      setRecommendations([
        {
          id: 1,
          type: 'Investment',
          name: 'High-Yield Savings Account',
          description: 'Earn competitive interest rates with flexible access to your funds',
          suitability: 'High',
          expectedReturn: '3.5%',
          risk: 'Low'
        },
        {
          id: 2,
          type: 'Insurance',
          name: 'Term Life Insurance',
          description: 'Affordable life insurance coverage for your family\'s protection',
          suitability: 'High',
          monthlyPremium: '$45',
          coverage: '$500,000'
        },
        {
          id: 3,
          type: 'Investment',
          name: 'Index Fund Portfolio',
          description: 'Diversified investment portfolio tracking market indices',
          suitability: 'Medium',
          expectedReturn: '7-9%',
          risk: 'Medium'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [nric]);

  if (loading) {
    return (
      <div style={{ display: 'flex' }}>
        <Sidebar clientId={nric} />
        <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ fontSize: '18px', color: '#666' }}>Loading recommendations...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar clientId={nric} />
      <div style={{ flex: 1, padding: '32px', marginLeft: '240px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>
            Product Recommendations
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            Personalized product recommendations based on your financial profile
          </p>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
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
                  <div style={{ 
                    display: 'inline-block', 
                    background: rec.type === 'Investment' ? '#dbeafe' : '#fef3c7',
                    color: rec.type === 'Investment' ? '#1e40af' : '#92400e',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    {rec.type}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
                    {rec.name}
                  </h3>
                  <p style={{ color: '#666', lineHeight: '1.5' }}>
                    {rec.description}
                  </p>
                </div>
                <div style={{ 
                  background: rec.suitability === 'High' ? '#dcfce7' : '#fef3c7',
                  color: rec.suitability === 'High' ? '#166534' : '#92400e',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {rec.suitability} Suitability
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {rec.expectedReturn && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Expected Return</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{rec.expectedReturn}</div>
                  </div>
                )}
                {rec.risk && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Risk Level</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{rec.risk}</div>
                  </div>
                )}
                {rec.monthlyPremium && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Monthly Premium</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{rec.monthlyPremium}</div>
                  </div>
                )}
                {rec.coverage && (
                  <div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Coverage Amount</div>
                    <div style={{ fontSize: '16px', fontWeight: '600' }}>{rec.coverage}</div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                <button style={{
                  background: '#222',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Learn More
                </button>
                <button style={{
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}>
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 