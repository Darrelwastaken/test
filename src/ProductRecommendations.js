import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import Sidebar from './Sidebar';
import ClientHeader from './components/ClientHeader';
import { useAIProductRecommendations } from './hooks/useAIProductRecommendations';
import { useClientMetrics } from './hooks/useClientMetrics';

export default function ProductRecommendations() {
  const { nric } = useParams();
  const navigate = useNavigate();
  const { isMobile, sidebarOpen, setSidebarOpen, toggleSidebar, getMainContentStyle } = useResponsiveLayout();
  const { recommendations, loading, error, aiInsights } = useAIProductRecommendations(nric);
  const { client, clientName, clientStatus, clientRiskProfile } = useClientMetrics(nric);

  // All insights are automatically expanded
  const isInsightExpanded = (insightIndex) => true;

  // Get the top 3 insights
  const topInsights = aiInsights.slice(0, 3);

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
            <div style={{ fontSize: '18px', color: '#666' }}>Analyzing your financial profile...</div>
            <div style={{ marginTop: '16px', fontSize: '14px', color: '#999' }}>
              Generating personalized product recommendations
            </div>
          </div>
        </div>
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
        <div style={{ ...getMainContentStyle(), display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', color: '#dc2626', marginBottom: '8px' }}>
              Unable to load recommendations
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {error}
            </div>
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
      <main style={getMainContentStyle()}>
        <ClientHeader
          clientName={clientName}
          clientStatus={clientStatus}
          clientRiskProfile={clientRiskProfile}
          nric={nric}
          isMobile={isMobile}
          showCrmButton={false}
        />

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}>
          <h2 style={{ fontWeight: 700, fontSize: 32 }}>Product Recommendations</h2>
          <button
            onClick={() => navigate(`/products/${nric}`)}
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
            View Products
          </button>
        </div>

        {/* Main Container */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
        }}>
          {topInsights.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '18px', color: '#666', marginBottom: '8px' }}>
                No AI insights available
              </div>
              <div style={{ fontSize: '14px', color: '#999' }}>
                AI analysis is required to generate personalized product recommendations
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '24px' }}>
              {topInsights.map((insight, index) => (
                <div key={index}>
                  {/* Combined Insight and Product Card */}
                  <div style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {/* Insight Section */}
                    <div style={{ marginBottom: '24px' }}>
                      
                      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                        {insight.insight || insight.text || 'AI Analysis Insight'}
                      </h3>
                      
                      <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                        {insight.reasoning || 'This insight is based on your financial profile and transaction patterns.'}
                      </p>
                    </div>

                    {/* Product Section */}
                    {insight.product && (
                      <>
                        <div style={{ 
                          borderTop: '1px solid #e5e7eb', 
                          paddingTop: '24px',
                          marginBottom: '20px'
                        }}>
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <div style={{ 
                              background: insight.recommendedProduct.type === 'Savings' ? '#dbeafe' : 
                                         insight.recommendedProduct.type === 'Investment' ? '#dcfce7' : 
                                         insight.recommendedProduct.type === 'Insurance' ? '#fef3c7' : 
                                         insight.recommendedProduct.type === 'Credit' ? '#f3e8ff' : 
                                         insight.recommendedProduct.type === 'Islamic' ? '#fef2f2' : '#f3f4f6',
                              color: insight.recommendedProduct.type === 'Savings' ? '#1e40af' : 
                                     insight.recommendedProduct.type === 'Investment' ? '#166534' : 
                                     insight.recommendedProduct.type === 'Insurance' ? '#92400e' : 
                                     insight.recommendedProduct.type === 'Credit' ? '#7c3aed' : 
                                     insight.recommendedProduct.type === 'Islamic' ? '#dc2626' : '#374151',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}>
                              Product Recommendation
                            </div>
                          </div>
                          
                          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                            {insight.product}
                          </h4>

                          {/* Product Reasoning */}
                          <div style={{ 
                            background: '#f0f9ff', 
                            padding: '12px 16px', 
                            borderRadius: '8px',
                            border: '1px solid #bae6fd',
                            marginBottom: '16px'
                          }}>
                            <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: '600', marginBottom: '4px' }}>
                              Why this product is recommended:
                            </div>
                            <div style={{ fontSize: '13px', color: '#0369a1' }}>
                              {insight.productReasoning || insight.reasoning}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <button style={{
                            background: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '12px 24px',
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
                            Learn More
                          </button>
                          <button style={{
                            background: '#059669',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 24px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'background 0.2s ease'
                          }}
                          onMouseOver={(e) => e.target.style.background = '#047857'}
                          onMouseOut={(e) => e.target.style.background = '#059669'}
                          >
                            Apply Now
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>



        {/* CSS Animation */}
        <style>
          {`
            @keyframes slideDown {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </main>
    </div>
  );
} 